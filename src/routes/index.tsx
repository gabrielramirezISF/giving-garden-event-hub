import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/eventos" });
  },
  head: () => ({
    meta: [
      { title: "ISF Eventos" },
      { name: "description", content: "CRM de eventos y contactos de ISF." },
      { property: "og:title", content: "ISF Eventos" },
      { property: "og:description", content: "CRM de eventos y contactos de ISF." },
    ],
  }),
});
