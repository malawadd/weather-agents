// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface IWeatherOracle {
    function getTemperature(bytes32 cityId) external view returns (int256);
}

contract TempBidModule is Ownable {
    using Counters for Counters.Counter;

    /* ───────────────────────────── Storage ─────────────────────────────── */

    IERC20 public immutable tickets; // PrizeVault share token
    IERC20 public immutable asset;   // Underlying asset (USDC) used for the pot
    IWeatherOracle public immutable oracle;

    struct DrawMeta {
        bytes32  cityId;
        uint256  endTime;
        bool     settled;
        int256   actualTemp;
        uint256  pot;
    }

    // drawId ⇒ meta
    mapping(uint256 => DrawMeta) public draws;
    // Index of all draw ids (for off-chain enumeration)
    uint256[] private _allDrawIds;

    // Allowed temperature buckets
    mapping(uint256 => int256[]) private thresholdsOf;

    // drawId ⇒ threshold ⇒ TOTAL shares
    mapping(uint256 => mapping(int256 => uint256)) public totalShares;
    // drawId ⇒ user ⇒ threshold ⇒ shares
    mapping(uint256 => mapping(address => mapping(int256 => uint256))) public userShares;
    // drawId ⇒ user ⇒ claimed?
    mapping(uint256 => mapping(address => bool)) public claimed;

    Counters.Counter private _nextDrawId; // starts at 0 → first draw is 0

    /* ───────────────────────────── Events ──────────────────────────────── */

    event DrawCreated(
        uint256 indexed drawId,
        bytes32 cityId,
        uint256 endTime,
        int256[] thresholds
    );
    event BidPlaced(uint256 indexed drawId, address indexed user, int256 threshold, uint256 shareAmt);
    event PotFunded(uint256 indexed drawId, uint256 amount);
    event DrawSettled(uint256 indexed drawId, int256 actualTemp, uint256 totalWinners, uint256 pot);
    event Claimed(uint256 indexed drawId, address indexed user, uint256 reward, uint256 principal);

    /* ─────────────────────────── Constructor ───────────────────────────── */

    constructor(IERC20 _tickets, IERC20 _asset, IWeatherOracle _oracle)
        Ownable(msg.sender)
    {
        tickets = _tickets;
        asset   = _asset;
        oracle  = _oracle;
    }

    /* ─────────────────────────── Draw admin ────────────────────────────── */

    /**
     * @notice Create a new temperature-prediction draw with predefined thresholds.
     * @param cityId     WeatherOracle key.
     * @param endTime    UNIX timestamp after which no more bids are accepted.
     * @param thresholds Array of milli-°C values (strictly increasing recommended).
     */
    function createDraw(
        bytes32 cityId,
        uint256 endTime,
        int256[] calldata thresholds
    ) external onlyOwner {
        require(thresholds.length > 0, "No thresholds");
        require(endTime > block.timestamp, "End must be future");

        uint256 drawId = _nextDrawId.current();
        _nextDrawId.increment();
        draws[drawId] = DrawMeta({
            cityId:      cityId,
            endTime:     endTime,
            settled:     false,
            actualTemp:  0,
            pot:         0
        });
        thresholdsOf[drawId] = thresholds;
        _allDrawIds.push(drawId);

        emit DrawCreated(drawId, cityId, endTime, thresholds);
    }

    /* ───────────────────────── Bid placement ──────────────────────────── */

    function placeBid(uint256 drawId, int256 threshold, uint256 shareAmt) external {
        DrawMeta storage meta = draws[drawId];
        require(meta.cityId != 0x0,       "Draw unknown");
        require(block.timestamp < meta.endTime, "Bidding closed");
        require(!_isSettled(meta),        "Settled");
        require(_isAllowedThreshold(drawId, threshold), "Bad threshold");
        require(shareAmt > 0,             "Zero amount");

        tickets.transferFrom(msg.sender, address(this), shareAmt);

        userShares[drawId][msg.sender][threshold] += shareAmt;
        totalShares[drawId][threshold]            += shareAmt;

        emit BidPlaced(drawId, msg.sender, threshold, shareAmt);
    }

    /* ────────────────────────── Pot funding ───────────────────────────── */

    function fundPot(uint256 drawId, uint256 amount) external {
        DrawMeta storage meta = draws[drawId];
        require(meta.cityId != 0x0, "Draw unknown");
        require(!_isSettled(meta),  "Settled");
        require(amount > 0,         "Zero");

        asset.transferFrom(msg.sender, address(this), amount);
        meta.pot += amount;

        emit PotFunded(drawId, amount);
    }

    /* ────────────────────────── Settlement ────────────────────────────── */

    function settle(uint256 drawId) external {
        DrawMeta storage meta = draws[drawId];
        require(meta.cityId != 0x0,  "Draw unknown");
        require(!_isSettled(meta),   "Already settled");
        require(block.timestamp >= meta.endTime, "Too early");

        int256 actual = oracle.getTemperature(meta.cityId);
        meta.actualTemp = actual;
        meta.settled    = true;

        uint256 totalWinnerShares;
        int256[] storage ths = thresholdsOf[drawId];
        for (uint256 i = 0; i < ths.length; ++i) {
            if (actual > ths[i]) {
                totalWinnerShares += totalShares[drawId][ths[i]];
            }
        }

        if (totalWinnerShares == 0 && meta.pot > 0) {
            asset.transfer(owner(), meta.pot);                 // roll over / treasury
        }

        emit DrawSettled(drawId, actual, totalWinnerShares, meta.pot);
    }

    /* ─────────────────────────── User claims ──────────────────────────── */

    function claim(uint256 drawId) external {
        DrawMeta storage meta = draws[drawId];
        require(_isSettled(meta),             "Not settled");
        require(!claimed[drawId][msg.sender], "Claimed");

        uint256 stake;
        uint256 winningStake;
        int256[] storage ths = thresholdsOf[drawId];
        for (uint256 i = 0; i < ths.length; ++i) {
            int256 th = ths[i];
            uint256 s = userShares[drawId][msg.sender][th];
            if (s == 0) continue;
            stake += s;
            if (meta.actualTemp > th) {
                winningStake += s;
            }
        }
        require(stake > 0, "No stake");

        uint256 reward;
        if (winningStake > 0) {
            uint256 totalWinnerShares;
            for (uint256 i = 0; i < ths.length; ++i) {
                if (meta.actualTemp > ths[i]) {
                    totalWinnerShares += totalShares[drawId][ths[i]];
                }
            }
            reward = (meta.pot * winningStake) / totalWinnerShares;
        }

        claimed[drawId][msg.sender] = true;

        tickets.transfer(msg.sender, stake);   // principal back
        if (reward > 0) asset.transfer(msg.sender, reward);

        emit Claimed(drawId, msg.sender, reward, stake);
    }

    /* ─────────────────────────── View helpers ─────────────────────────── */

    /// Full DrawMeta struct
    function getDraw(uint256 drawId)
        external
        view
        returns (
            bytes32   cityId,
            uint256   endTime,
            bool      settled,
            int256    actualTemp,
            uint256   pot
        )
    {
        DrawMeta storage m = draws[drawId];
        return (m.cityId, m.endTime, m.settled, m.actualTemp, m.pot);
    }

    /// IDs of every draw ever created (for off-chain enumeration)
    function getAllDrawIds() external view returns (uint256[] memory) {
        return _allDrawIds;
    }

    /// Already had getThresholds(drawId) – leaving unchanged
    function getThresholds(uint256 drawId) external view returns (int256[] memory) {
        return thresholdsOf[drawId];
    }

    /// Total tickets on a specific threshold
    function getTotalShares(uint256 drawId, int256 th) external view returns (uint256) {
        return totalShares[drawId][th];
    }

    /// Tickets a user staked on a threshold
    function getUserShares(uint256 drawId, address user, int256 th) external view returns (uint256) {
        return userShares[drawId][user][th];
    }

    /* ─────────────────────── Internal utility helpers ─────────────────── */

    function _isAllowedThreshold(uint256 drawId, int256 th) internal view returns (bool) {
        int256[] storage arr = thresholdsOf[drawId];
        for (uint256 i = 0; i < arr.length; ++i) {
            if (arr[i] == th) return true;
        }
        return false;
    }

    function _isSettled(DrawMeta storage meta) private view returns (bool) {
        return meta.settled;
    }
}
