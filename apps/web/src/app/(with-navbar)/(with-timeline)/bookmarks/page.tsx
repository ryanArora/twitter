import { Header } from "../../header";
import { Timeline } from "../timeline";

export default function BookmarksPage() {
  return (
    <div className="h-full min-h-screen border-x">
      <Header title="Bookmarks" />
      <Timeline
        noTweetsMeta={{
          description:
            "Bookmark posts to easily find them again in the future.",
          title: "Save posts for later",
        }}
        path="bookmarks"
        payload={{
          profile_userId: "",
          tweetReplies_parentId: "",
        }}
      />
    </div>
  );
}
