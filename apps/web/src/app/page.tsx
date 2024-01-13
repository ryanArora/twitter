import { api } from "@/trpc/server";

export default async function Home() {
  const session = await api.auth.getSession();

  return (
    <div>
      <h3>Session</h3>
      <p>{JSON.stringify(session, null, 2)}</p>
    </div>
  );
}
