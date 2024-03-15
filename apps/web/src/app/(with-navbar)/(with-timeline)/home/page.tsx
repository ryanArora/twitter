import { PostTweet } from "./post-tweet";
import { Timeline } from "../timeline";

export default function HomePage() {
  return (
    <div className="h-full min-h-screen border-x">
      <div className="border-b">
        <PostTweet
          inputPlaceholder="What is happening?!"
          submitButtonText="Tweet"
          parentTweetId={null}
        />
      </div>
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
