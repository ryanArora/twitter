import { TypographyH1 } from "@repo/ui/components/typography";

export default function ProfilePage({
  params,
}: {
  params: { profile: string };
}) {
  return (
    <div className="p-2">
      <TypographyH1>{`@${params.profile}'s Profile`}</TypographyH1>
    </div>
  );
}
