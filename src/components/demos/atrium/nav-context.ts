"use client";

import { createContext, useContext } from "react";
import type { ModuleId } from "@/data/atrium-demo";

/**
 * Lets any Atrium module switch the active console module without prop-drilling
 * (e.g. the home "pending for you" cards jump into the relevant module, and the
 * assistant's action cards deep-link to where the work landed). The console
 * provides the real setter; the default is a no-op so modules render safely in
 * isolation.
 */
export const AtriumNav = createContext<(id: ModuleId) => void>(() => {});
export const useAtriumNav = () => useContext(AtriumNav);
