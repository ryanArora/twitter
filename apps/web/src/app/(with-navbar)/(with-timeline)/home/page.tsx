import { PostTweet } from "./post-tweet";
import { Timeline } from "../timeline";

export default function HomePage() {
  return (
    <div className="h-full min-h-screen border-x">
      <div className="border-b">
        <PostTweet
          inputPlaceholder="What is happening?!"
          parentTweetId={null}
          submitButtonText="Tweet"
        />
      </div>
      <Timeline
        noTweetsMeta={{
          description:
            "This is the best place to see what’s happening in your world. Find some people to follow now.",
          title: "Welcome to Twitter!",
        }}
        path="home"
        payload={{
          profile_userId: "",
          tweetReplies_parentId: "",
        }}
      />
    </div>
  );
}
