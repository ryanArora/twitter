import { PostTweet } from "./post-tweet";
import { Timeline } from "../timeline/timeline";
import { TimelineSourceProvider } from "../timeline/timelineSourceContext";

export default function HomePage() {
  return (
    <div className="w-full h-full overflow-y-scroll">
      <TimelineSourceProvider timelineSource="home">
        <PostTweet />
        <Timeline />
      </TimelineSourceProvider>
    </div>
  );
}
