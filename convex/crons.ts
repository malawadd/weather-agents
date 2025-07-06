import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
    "weatherxm-oracle-1500utc",
    { hourUTC: 15, minuteUTC: 0 },
    internal.weatherOracle.pushWeather,
    {}
  );

export default crons;
