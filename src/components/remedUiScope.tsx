"use client";

import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

export type RemedUiVariant = "remed";
type RemedUiDensity = "compact" | "comfortable";
const RemedUiContext = createContext<RemedUiVariant | undefined>(undefined);
const RemedUiDensityContext = createContext<RemedUiDensity>("comfortable");
export const useRemedUiVariant = () => useContext(RemedUiContext);
export const useRemedUiDensity = () => useContext(RemedUiDensityContext);

/** No DOM wrapper: full-height workspaces and portal hosts keep their layout. */
export function RemedUiProvider({
  children,
  density = "compact",
}: {
  children: ReactNode;
  density?: RemedUiDensity;
}) {
  return (
    <RemedUiContext.Provider value="remed">
      <RemedUiDensityContext.Provider value={density}>
        {children}
      </RemedUiDensityContext.Provider>
    </RemedUiContext.Provider>
  );
}

/** Explicit scope also reaches react-select portals through React context. */
export function RemedUiScope({
  uiVariant,
  ...props
}: ComponentPropsWithoutRef<"div"> & { uiVariant?: RemedUiVariant }) {
  return (
    <RemedUiContext.Provider value={uiVariant}>
      <RemedUiDensityContext.Provider value="comfortable">
        <div {...props} />
      </RemedUiDensityContext.Provider>
    </RemedUiContext.Provider>
  );
}
