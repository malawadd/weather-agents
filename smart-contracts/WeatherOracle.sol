// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WeatherOracle
 * @notice Minimal on-chain oracle that stores the latest weather measurements for a given city/location ID.
 *         The owner (or a delegated updater) can push new measurements; anyone can read them.
 *         All numeric values use milli-units for extra precision while staying within reasonable integer ranges.
 *           • temperature   = milli-degrees Celsius  (25.315 °C  →  25315)
 *           • humidity      = milli-percent          (57.792 %   →  57792)
 *           • windSpeed     = milli-metres/second    (3.456 m/s   →  3456)
 *           • pressure      = Pascals (Pa)           (101325 Pa   →  101325)
 */
contract WeatherOracle is Ownable {
    struct WeatherData {
        int256 temperature;   // milli-degrees Celsius (1e-3 °C)
        uint256 humidity;     // milli-percent (1e-3 %)
        uint256 windSpeed;    // milli-metres/second (1e-3 m/s)
        bool rain;            // true if measurable rain occurred
        uint256 pressure;     // Pascals (Pa)
        uint256 timestamp;    // block timestamp when measurement was pushed
    }

    /**
     * @dev cityId can be any bytes32 identifier: keccak256(city name), geohash, ISO code, etc.
     */
    mapping(bytes32 => WeatherData) private cityWeather;

    event WeatherUpdated(
        bytes32 indexed cityId,
        int256 temperature,
        uint256 humidity,
        uint256 windSpeed,
        bool rain,
        uint256 pressure,
        uint256 timestamp
    );

    // ────────────────────────────────────────────
    //                 Constructor
    // ────────────────────────────────────────────

    /**
     * @notice Sets the deployer as the initial owner.
     *         OpenZeppelin Ownable (v5+) requires an address argument.
     */
    constructor() Ownable(msg.sender) {}

    // ────────────────────────────────────────────
    //               Mutative function
    // ────────────────────────────────────────────

    /**
     * @notice Push a fresh measurement set for a city.
     * @param cityId      Location identifier (e.g. keccak256 of city name).
     * @param temperature Temperature in milli-degrees Celsius (1e-3 °C).
     * @param humidity    Relative humidity in milli-percent (1e-3 %).
     * @param windSpeed   Wind speed in milli-m/s (1e-3 m/s).
     * @param rain        Whether rain occurred.
     * @param pressure    Atmospheric pressure in Pascals (Pa).
     */
    function updateWeather(
        bytes32 cityId,
        int256 temperature,
        uint256 humidity,
        uint256 windSpeed,
        bool rain,
        uint256 pressure
    ) external onlyOwner {
        WeatherData storage ref = cityWeather[cityId];
        ref.temperature = temperature;
        ref.humidity = humidity;
        ref.windSpeed = windSpeed;
        ref.rain = rain;
        ref.pressure = pressure;
        ref.timestamp = block.timestamp;

        emit WeatherUpdated(
            cityId,
            temperature,
            humidity,
            windSpeed,
            rain,
            pressure,
            block.timestamp
        );
    }

    // ────────────────────────────────────────────
    //                View functions
    // ────────────────────────────────────────────

    function getTemperature(bytes32 cityId) external view returns (int256) {
        return cityWeather[cityId].temperature;
    }

    function getHumidity(bytes32 cityId) external view returns (uint256) {
        return cityWeather[cityId].humidity;
    }

    function getWindSpeed(bytes32 cityId) external view returns (uint256) {
        return cityWeather[cityId].windSpeed;
    }

    function hasRain(bytes32 cityId) external view returns (bool) {
        return cityWeather[cityId].rain;
    }

    function getPressure(bytes32 cityId) external view returns (uint256) {
        return cityWeather[cityId].pressure;
    }

    function latestWeather(
        bytes32 cityId
    )
        external
        view
        returns (
            int256 temperature,
            uint256 humidity,
            uint256 windSpeed,
            bool rain,
            uint256 pressure,
            uint256 timestamp
        )
    {
        WeatherData memory data = cityWeather[cityId];
        return (
            data.temperature,
            data.humidity,
            data.windSpeed,
            data.rain,
            data.pressure,
            data.timestamp
        );
    }
}
