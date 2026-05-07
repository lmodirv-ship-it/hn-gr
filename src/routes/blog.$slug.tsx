import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/insights/$slug", params: { slug: params.slug } });
  },
});
