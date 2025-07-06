/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { internalAction } from "./_generated/server";
import { createWalletClient, http, keccak256, toBytes } from "viem";
import { privateKeyToAccount } from "viem/accounts";
//filecoincalibration viem chain
import { filecoinCalibration } from "viem/chains"; // filecoin calibration chain
import WeatherOracleAbi from "./lib/WeatherOracleAbi";   // paste the ABI JSON here

const CITY_ID = "0x4c6f6e646f6e0000000000000000000000000000000000000000000000000000" as const;
const ORACLE_ADDRESS = "0x5EB5F1c600ccb1729B1034d2147D4B6678021b88" as const;
// ─────────── Fetch → Convert → Push ───────────
export const pushWeather = internalAction({
  args: {},                       // cron passes no args
  handler: async () => {
    // 1) Pull latest WeatherXM reading
    const res = await fetch(
      `https://pro.weatherxm.com/api/v1/stations/${process.env.WEATHER_STATION_ID}/latest`,
      { headers: { "X-API-KEY": process.env.WEATHERXM_API_KEY! } }
    );
    if (!res.ok) throw new Error(`WeatherXM ${res.status}`);
    const { observation } = (await res.json()) as any;

    // 2) Unit-safe conversions for the Solidity oracle
    const tempMilli     = BigInt(Math.round(observation.temperature * 1_000)); // int256  (can be < 0)
    const humidityMilli = BigInt(Math.round(observation.humidity    * 1_000)); // uint256
    const windMilli     = BigInt(Math.round(observation.wind_speed  * 1_000)); // uint256
    const rain          = Number(observation.precipitation_rate) > 0;
    const pressurePa    = BigInt(Math.round(observation.pressure    * 100)); 
 

    
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
    const wallet  = createWalletClient({
      account,
      transport: http("https://rpc.ankr.com/filecoin_testnet")
    });

    await wallet.writeContract({
        address: ORACLE_ADDRESS,
        abi: WeatherOracleAbi,
        functionName: "updateWeather",
        args: [
            CITY_ID,
            tempMilli,
            humidityMilli,
            windMilli,
            rain,
            pressurePa
        ],
        chain: filecoinCalibration
    });
  },
});
