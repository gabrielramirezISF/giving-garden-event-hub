import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { SoftButton } from "@/components/crm";
import { fechaLarga, getEvento } from "@/lib/data";
import { checkinPath, checkinStates, type CheckinState } from "@/lib/checkin";

export const Route = createFileRoute("/eventos/$codigo_/qr")({
  loader: ({ params }) => {
    const evento = getEvento(params.codigo);
    if (!evento) throw notFound();
    return evento;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `QR de la puerta · ${loaderData?.nombre ?? "Evento"} · ISF` },
    { name: "description", content: "Código QR imprimible para registrar la llegada al evento ISF." },
    { property: "og:title", content: `QR de la puerta · ${loaderData?.nombre ?? "ISF"}` },
    { property: "og:description", content: "Registro de llegada al encuentro ISF." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: DoorQR,
});

const labels: Record<CheckinState, string> = {
  inicio: "Inicio", bienvenida: "Bienvenida", registrado: "Ya registrado",
  "no-encontrado": "Correo no encontrado", cerrado: "Registro cerrado", error: "Error de conexión",
};

function DoorQR() {
  const evento = Route.useLoaderData();
  const [origin, setOrigin] = useState("https://giving-garden-event-hub.lovable.app");
  const [variant, setVariant] = useState<CheckinState>("inicio");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const url = `${origin}${checkinPath(evento.codigo)}`;
  return (
    <main className="door-page min-h-screen px-4 py-6 text-foreground">
      <div className="door-tools mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-3">
        <Link to="/eventos/$codigo" params={{ codigo: evento.codigo }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Volver al evento</Link>
        <SoftButton onClick={() => window.print()} className="min-h-11"><Printer className="size-4" /> Imprimir</SoftButton>
      </div>
      <section className="door-poster mx-auto flex max-w-[1000px] flex-col items-center py-8 text-center">
        <span className="mb-5 grid size-12 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">ISF</span>
        <h1 className="max-w-[760px] text-3xl font-semibold leading-tight md:text-4xl">{evento.nombre}</h1>
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground md:text-base">
          <span className="flex items-center gap-2"><CalendarDays className="size-4 shrink-0" /><span className="capitalize">{fechaLarga(evento.fecha)} · {evento.horaInicio}–{evento.horaFin}</span></span>
          <span className="flex items-center gap-2"><MapPin className="size-4" />{evento.lugar}</span>
        </div>
        <div className="door-code mt-7 aspect-square w-full max-w-[480px] bg-qr-paper p-4 text-qr-ink">
          <QRCodeSVG value={url} level="M" marginSize={4} size={480} bgColor="var(--qr-paper)" fgColor="var(--qr-ink)" title="QR para registrar tu llegada" className="h-full w-full" />
        </div>
        <h2 className="mt-7 text-xl font-semibold md:text-2xl">Escanea para registrar tu llegada</h2>
        <a href={url} className="door-address mt-3 max-w-full break-all font-mono text-sm text-primary md:text-base">{url.replace(/^https?:\/\//, "")}</a>
        <p className="mt-6 text-sm text-muted-foreground">86 personas ya llegaron</p>
      </section>
      <div className="door-tools mx-auto flex max-w-[640px] flex-wrap items-center justify-center gap-3 border-t border-border pt-5">
        <label htmlFor="checkin-variant" className="text-sm text-muted-foreground">Vista previa</label>
        <select id="checkin-variant" value={variant} onChange={(e) => setVariant(e.target.value as CheckinState)} className="min-h-11 rounded-lg border border-input bg-card px-3 text-sm">
          {checkinStates.map((state) => <option key={state} value={state}>{labels[state]}</option>)}
        </select>
        <Link to="/checkin/$codigo" params={{ codigo: evento.codigo }} search={{ estado: variant }} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent">Abrir registro móvil<ArrowUpRight className="size-4" /></Link>
      </div>
    </main>
  );
}