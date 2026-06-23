"use client";

import { createContext, useContext } from "react";
import type { ModuleId } from "@/data/vantage-demo";

/**
 * Lets any SecOps Command module switch the active console module without prop-drilling
 * (e.g. the overview's quick actions jump straight into a module). The console
 * provides the real setter; the default is a no-op so modules render safely in
 * isolation.
 */
export const VantageNav = createContext<(id: ModuleId) => void>(() => {});
export const useVantageNav = () => useContext(VantageNav);
