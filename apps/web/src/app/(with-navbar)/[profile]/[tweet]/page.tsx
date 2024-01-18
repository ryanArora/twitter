import { TypographyP } from "@repo/ui/components/typography";
import { api } from "@/trpc/server";

export default async function TweetPage({
  params,
}: {
  params: { tweet: string; profile: string };
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

  return (
    <div className="p-2 truncate">
      <TypographyP>{`Tweet: ${tweet.content}`}</TypographyP>
    </div>
  );
}
