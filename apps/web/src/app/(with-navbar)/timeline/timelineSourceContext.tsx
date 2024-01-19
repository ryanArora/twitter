"use client";

import { type RouterInputs } from "@repo/api";
import { type ReactNode, createContext, useContext } from "react";

export type TimelineSource = keyof RouterInputs["timeline"];
export const TimelineSourceContext = createContext<TimelineSource | null>(null);

export function TimelineSourceProvider({
  timelineSource,
  children,
}: {
  timelineSource: TimelineSource | null;
  children: ReactNode;
}) {
  return (
    <TimelineSourceContext.Provider value={timelineSource}>
      {children}
    </TimelineSourceContext.Provider>
  );
}

export function useTimelineSource(): TimelineSource {
  const timelineSource = useContext(TimelineSourceContext);

  if (!timelineSource) {
    throw Error("No timeline source");
  }

  return timelineSource;
}
