"use client";

import { createContext, useContext } from "react";
import type { ModuleId } from "@/data/mtrain-demo";

/**
 * Lets any mTrain module switch the active console module without prop-drilling
 * (e.g. the Overview "new leads" peek jumps into the Leads module). The console
 * provides the real setter; the default is a no-op so modules render safely in
 * isolation.
 */
export const MtrainNav = createContext<(id: ModuleId) => void>(() => {});
export const useMtrainNav = () => useContext(MtrainNav);
