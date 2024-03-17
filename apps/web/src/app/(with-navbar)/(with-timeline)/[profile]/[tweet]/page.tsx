import { PageClient } from "./page-client";
import { api } from "@/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: { profile: string; tweet: string };
}) {
  const tweet = await api.tweet.find({
    id: params.tweet,
    username: params.profile,
  });

  if (!tweet) {
    return {
      title: "Page not found",
    };
  }

  return {
    title: `${tweet.author.name}: "${tweet.content}" / Twitter`,
  };
}

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
