import { PostTweet } from "./post-tweet";
import { Timeline } from "../timeline";

export default function HomePage() {
  return (
    <div className="w-full h-full overflow-y-scroll">
      <PostTweet />
      <Timeline />
    </div>
  );
}
