import { PageClient } from "./page-client";
import { api } from "@/trpc/server";


export default async function TweetPage({
  params,
}: {
  params: { profile: string; tweet: string };
}) {
  const tweet = await api.tweet.find({
    id: params.tweet,
    username: params.profile,
  });

  if (!tweet) {
    return (
      <div>
        <p>Page Not Found</p>
      </div>
    );
  }

  return <PageClient tweet={tweet}></PageClient>;
}
