import { DB_LIVE } from "./env";
import * as mem from "./data-memory";
import * as sb from "./data-supabase";

// The data layer entry point. Everything in the app reads/writes through this.
// It routes to the real Supabase store when configured (DB_LIVE), else the
// in-memory demo store. Both implement the same async API, so nothing else in
// the app changes when you switch.

export type { Move, Watcher, PromoteInput, PromoteResult } from "./data-types";

const impl = DB_LIVE ? sb : mem;

export const getAllListings = impl.getAllListings;
export const getListingBySlug = impl.getListingBySlug;
export const getBoard = impl.getBoard;
export const getCityWar = impl.getCityWar;
export const getRecentMoves = impl.getRecentMoves;
export const getIndiaRank = impl.getIndiaRank;
export const applyPromotion = impl.applyPromotion;
export const addHype = impl.addHype;
export const addWatcher = impl.addWatcher;
