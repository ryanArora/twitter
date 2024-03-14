import { PostTweet } from "./post-tweet";
import { Timeline } from "../timeline";

export default function HomePage() {
  return (
    <div className="w-full h-full">
      <PostTweet />
      <Timeline
        path="home"
        payload={{
          profile_userId: "",
          tweetReplies_parentId: "",
        }}
      />
    </div>
  );
}
