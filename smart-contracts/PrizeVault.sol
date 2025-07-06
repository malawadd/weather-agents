// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PrizeVault (ERC‑4626)
 * @notice A lean prize‑linked savings vault: users deposit an underlying asset (e.g. USDC) and
 *         receive ERC‑20 **ticket shares**.  Shares are redeemable 1:1 for principal at any time.
 *         The vault can integrate with an off‑chain or on‑chain yield source (strategy) so the
 *         accumulated yield can later be harvested and passed to a prize distributor.
 *
 *         • Deposits / withdrawals follow the ERC‑4626 spec (OpenZeppelin implementation).
 *         • `harvest()` collects pending yield produced by an optional strategy and returns the
 *           net amount of new assets that became available inside the vault.
 *
 *         For an MVP the vault simply holds assets idle; you (or a test script) can **donate**
 *         yield via `donateYield()` to simulate interest.  In production replace
 *         `_pullYieldFromStrategy()` with real integration logic (e.g. Aave).
 */
contract PrizeVault is ERC4626, Ownable {
    /* -------------------------------------------------------------------------- */
    /*                                   Events                                   */
    /* -------------------------------------------------------------------------- */

    event StrategyUpdated(address indexed newStrategy);
    event YieldHarvested(uint256 amount);

    /* -------------------------------------------------------------------------- */
    /*                               Vault set‑up                                 */
    /* -------------------------------------------------------------------------- */

    constructor(
        IERC20Metadata asset_,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) ERC4626(asset_) Ownable(msg.sender) {}

    /* -------------------------------------------------------------------------- */
    /*                              Yield strategy                                 */
    /* -------------------------------------------------------------------------- */

    address public strategy; // optional external yield source

    /**
     * @notice Set/replace the external strategy address that accrues yield.
     *         Leave zero for a pure idle vault (tests, dry runs).
     */
    function setStrategy(address _strategy) external onlyOwner {
        strategy = _strategy;
        emit StrategyUpdated(_strategy);
    }

    /**
     * @dev Pull any newly‑accrued yield from the strategy.  Override this function when you
     *      integrate with Aave, Compound, LST wrappers, etc.
     */
    function _pullYieldFromStrategy() internal virtual {
        if (strategy != address(0)) {
            // Example: IStrategy(strategy).withdrawYield();
            // Keep empty for MVP.
        }
    }

    /**
     * @notice Harvest yield and return the amount (in underlying asset) that became available
     *         since the previous harvest.
     */
    function harvest() external returns (uint256 yieldAmount) {
        uint256 beforeBal = IERC20(asset()).balanceOf(address(this));
        _pullYieldFromStrategy();
        uint256 afterBal = IERC20(asset()).balanceOf(address(this));
        yieldAmount = afterBal > beforeBal ? afterBal - beforeBal : 0;
        if (yieldAmount > 0) emit YieldHarvested(yieldAmount);
    }

    /* -------------------------------------------------------------------------- */
    /*                       Test‑only helper: yield donation                      */
    /* -------------------------------------------------------------------------- */

    /**
     * @notice Send `amount` of the underlying asset to the vault so that the next `harvest()`
     *         sees it as freshly‑accrued yield.  Useful on testnets / Remix.
     */
    function donateYield(uint256 amount) external {
        IERC20(asset()).transferFrom(msg.sender, address(this), amount);
    }
}
