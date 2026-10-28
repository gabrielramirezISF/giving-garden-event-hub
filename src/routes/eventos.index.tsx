import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarX2, Clock, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { Chip, EmptyState, PageTitle, toneEstadoEvento, toneTipo } from "@/components/crm";
import { DIAS, HOY, MESES, embudo, eventos } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/eventos/")({
  head: () => ({
    meta: [
      { title: "Eventos · ISF" },
      { name: "description", content: "Próximos y pasados eventos de ISF." },
      { property: "og:title", content: "Eventos · ISF" },
      { property: "og:description", content: "Próximos y pasados eventos de ISF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Eventos,
});

function Eventos() {
  const [vista, setVista] = useState<"proximos" | "pasados">("proximos");
  const lista = eventos
    .filter((e) => (vista === "proximos" ? e.fecha >= HOY : e.fecha < HOY))
    .sort((a, b) => (vista === "proximos" ? a.fecha.localeCompare(b.fecha) : b.fecha.localeCompare(a.fecha)));

  return (
    <main className="mx-auto max-w-[960px] px-4 py-10">
      <PageTitle
        right={
          <div className="flex rounded-lg bg-accent p-0.5 text-sm">
            {(["proximos", "pasados"] as const).map((v) => (
              <button key={v} onClick={() => setVista(v)} className={cn("rounded-md px-3 py-1 font-medium", vista === v ? "bg-card shadow-sm" : "text-muted-foreground")}>
                {v === "proximos" ? "Próximos" : "Pasados"}
              </button>
            ))}
          </div>
        }
      >
        Eventos
      </PageTitle>

      {lista.length === 0 ? (
        <EmptyState icon={<CalendarX2 className="size-10" />} text="Sin eventos próximos" action={<Link to="/eventos/nuevo" className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground"><Plus className="size-4" /> Crear evento</Link>} />
      ) : (
        <ol className="relative space-y-8 border-l border-dashed border-border pl-6 md:pl-0 md:border-0">
          {groupByDate(lista).map(([fecha, evs]) => {
            const d = new Date(fecha + "T12:00:00");
            return (
              <li key={fecha} className="md:grid md:grid-cols-[150px_1fr] md:gap-6">
                <div className="mb-2 md:pt-3">
                  <div className="font-semibold">{d.getDate()} {MESES[d.getMonth()]}{d.getFullYear() !== 2026 ? ` ${d.getFullYear()}` : ""}</div>
                  <div className="text-sm capitalize text-muted-foreground">{fecha === HOY ? "Hoy" : DIAS[d.getDay()]}</div>
                </div>
                <div className="space-y-3">
                  {evs.map((e) => {
                    const f = embudo(e.codigo);
                    const cifra = e.estado === "Cerrado" || e.estado === "En curso" ? `${f.llegaron} llegaron` : `${f.inscritos} inscritos`;
                    return (
                      <Link key={e.codigo} to="/eventos/$codigo" params={{ codigo: e.codigo }} className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
                        <div className="grid w-14 shrink-0 place-items-center self-start overflow-hidden rounded-lg border border-border text-center">
                          <div className="w-full bg-muted py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">{MESES[d.getMonth()]}</div>
                          <div className="py-1 text-xl font-semibold">{d.getDate()}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            {e.horaInicio && <span className="flex items-center gap-1"><Clock className="size-3.5" />{e.horaInicio}</span>}
                            <Chip tone={toneTipo[e.tipo]}>{e.tipo}</Chip>
                          </div>
                          <h2 className="mt-1 truncate text-lg font-semibold group-hover:text-primary">{e.nombre}</h2>
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="size-3.5" />
                            {e.lugar ?? <span className="text-warning">Falta la ubicación</span>}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Chip tone={toneEstadoEvento[e.estado]}>{e.estado}</Chip>
                            {e.registroAbierto && <Chip tone="greenStrong">● Registro abierto</Chip>}
                            <span className="text-sm font-medium">{cifra}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}

function groupByDate<T extends { fecha: string }>(l: T[]) {
  const m = new Map<string, T[]>();
  l.forEach((e) => m.set(e.fecha, [...(m.get(e.fecha) ?? []), e]));
  return [...m.entries()];
}
