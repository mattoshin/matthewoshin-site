"use client";

import { createContext, useContext } from "react";
import type { ModuleId } from "@/data/sec-demo";
import type { Role } from "./SecKit";

/**
 * Two small contexts shared across the SEC console:
 *  - SecNav lets any module switch the active module without prop-drilling
 *    (e.g. the dashboard quick-actions jump straight into a module).
 *  - SecRole exposes the live Wealth Manager / Trader role so the role-aware
 *    modules (dashboard, watchlist) re-render instantly off the topbar toggle.
 * The console provides the real values; the defaults keep modules safe in
 * isolation.
 */
export const SecNav = createContext<(id: ModuleId) => void>(() => {});
export const useSecNav = () => useContext(SecNav);

export const SecRole = createContext<Role>("advisor");
export const useSecRole = () => useContext(SecRole);
