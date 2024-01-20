import { PostTweet } from "./post-tweet";
import { Timeline } from "../timeline";
import { TimelineSourceProvider } from "../timelineSourceContext";

export default function HomePage() {
  return (
    <div className="w-full h-full overflow-y-scroll">
      <TimelineSourceProvider
        timelineSource={{ path: "home", payload: { profileId: "" } }}
      >
        <PostTweet />
        <Timeline />
      </TimelineSourceProvider>
    </div>
  );
}
