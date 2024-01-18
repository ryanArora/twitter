import { TypographyH1 } from "@repo/ui/components/typography";
import { api } from "@/trpc/server";

export default async function ProfilePage({
  params,
}: {
  params: { profile: string };
}) {
  const profile = await api.user.find({ username: params.profile });

  if (!profile) {
    return (
      <div>
        <p>Page Not Found</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <TypographyH1>{`@${profile.username}'s Profile`}</TypographyH1>
    </div>
  );
}
