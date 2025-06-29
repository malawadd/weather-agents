/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as agents from "../agents.js";
import type * as aiChat from "../aiChat.js";
import type * as auth from "../auth.js";
import type * as demoData from "../demoData.js";
import type * as fleekAgents from "../fleekAgents.js";
import type * as funds from "../funds.js";
import type * as http from "../http.js";
import type * as portfolio from "../portfolio.js";
import type * as router from "../router.js";
import type * as transactions from "../transactions.js";
import type * as walletAuth from "../walletAuth.js";
import type * as walletAuthNode from "../walletAuthNode.js";
import type * as weatherxm_config from "../weatherxm/config.js";
import type * as weatherxm_regionStats from "../weatherxm/regionStats.js";
import type * as weatherxm_regionUtils from "../weatherxm/regionUtils.js";
import type * as weatherxm_stationDetails from "../weatherxm/stationDetails.js";
import type * as weatherxm_stationFilters from "../weatherxm/stationFilters.js";
import type * as weatherxm_stationTransform from "../weatherxm/stationTransform.js";
import type * as weatherxm_stationsApi from "../weatherxm/stationsApi.js";
import type * as weatherxm_userQueries from "../weatherxm/userQueries.js";
import type * as weatherxm_userStations from "../weatherxm/userStations.js";
import type * as weatherxm_weatherDataApi from "../weatherxm/weatherDataApi.js";
import type * as weatherxmApi from "../weatherxmApi.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  aiChat: typeof aiChat;
  auth: typeof auth;
  demoData: typeof demoData;
  fleekAgents: typeof fleekAgents;
  funds: typeof funds;
  http: typeof http;
  portfolio: typeof portfolio;
  router: typeof router;
  transactions: typeof transactions;
  walletAuth: typeof walletAuth;
  walletAuthNode: typeof walletAuthNode;
  "weatherxm/config": typeof weatherxm_config;
  "weatherxm/regionStats": typeof weatherxm_regionStats;
  "weatherxm/regionUtils": typeof weatherxm_regionUtils;
  "weatherxm/stationDetails": typeof weatherxm_stationDetails;
  "weatherxm/stationFilters": typeof weatherxm_stationFilters;
  "weatherxm/stationTransform": typeof weatherxm_stationTransform;
  "weatherxm/stationsApi": typeof weatherxm_stationsApi;
  "weatherxm/userQueries": typeof weatherxm_userQueries;
  "weatherxm/userStations": typeof weatherxm_userStations;
  "weatherxm/weatherDataApi": typeof weatherxm_weatherDataApi;
  weatherxmApi: typeof weatherxmApi;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
