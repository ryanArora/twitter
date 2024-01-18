import { TypographyH1 } from "@repo/ui/components/typography";

export default function TweetPage({
  params,
}: {
  params: { profile: string; tweet: string };
}) {
  return (
    <div className="p-2">
      <TypographyH1>{`@${params.profile} ${params.tweet}'s Tweet`}</TypographyH1>
    </div>
  );
}
