"use client";

import { type RouterInputs } from "@repo/api";
import { type ReactNode, createContext, useContext } from "react";
import { type TimelineInput } from "../../../../../../packages/api/src/router/timeline";

export type TimelineSource = {
  path: keyof RouterInputs["timeline"];
  payload: TimelineInput;
};

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
