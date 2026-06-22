"use client";

import { createContext, useContext } from "react";
import type { ModuleId } from "@/data/icr-demo";

/**
 * Lets any Beacon module switch the active console module without prop-drilling
 * (e.g. the dashboard's quick actions jump straight into a module). The console
 * provides the real setter; the default is a no-op so modules render safely in
 * isolation.
 */
export const BeaconNav = createContext<(id: ModuleId) => void>(() => {});
export const useBeaconNav = () => useContext(BeaconNav);
