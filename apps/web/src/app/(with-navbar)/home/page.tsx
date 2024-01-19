import { PostTweet } from "./post-tweet";
import { Timeline } from "../timeline/timeline";
import { TimelineSourceProvider } from "../timeline/timelineSourceContext";

export default function HomePage() {
  return (
    <div className="w-full h-full overflow-y-scroll">
      <TimelineSourceProvider
        timelineSource={{ path: "home", payload: { authorId: "" } }}
      >
        <PostTweet />
        <Timeline />
      </TimelineSourceProvider>
    </div>
  );
}
