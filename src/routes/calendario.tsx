import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, Chip, PageTitle, SoftButton, toneTipo, type Tone } from "@/components/crm";
import { HOY, MESES_LARGO, eventos, type TipoEvento } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendario · ISF" },
      { name: "description", content: "Calendario mensual de eventos de ISF." },
      { property: "og:title", content: "Calendario · ISF" },
      { property: "og:description", content: "Calendario mensual de eventos de ISF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Calendario,
});

const chipCls: Record<Tone, string> = {
  blue: "bg-info-soft text-info border-l-info", violet: "bg-violet-soft text-violet border-l-violet", green: "bg-success-soft text-success border-l-success",
  amber: "bg-warning-soft text-warning border-l-warning", gray: "bg-muted text-muted-foreground border-l-muted-foreground", greenStrong: "", rose: "",
};

function Calendario() {
  const y0 = Number(HOY.slice(0, 4)); const m0 = Number(HOY.slice(5, 7));
  const [ym, setYm] = useState({ y: y0, m: m0 - 1 });
  const nav = useNavigate();
  const first = new Date(ym.y, ym.m, 1);
  const offset = (first.getDay() + 6) % 7; // lunes primero
  const days = new Date(ym.y, ym.m + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + days) / 7) * 7 }, (_, i) => i - offset + 1);
  const move = (d: number) => setYm(({ y, m }) => ({ y: m + d < 0 ? y - 1 : m + d > 11 ? y + 1 : y, m: (m + d + 12) % 12 }));
  const iso = (d: number) => `${ym.y}-${String(ym.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10">
      <PageTitle right={
        <div className="flex items-center gap-2">
          <SoftButton onClick={() => setYm({ y: y0, m: m0 - 1 })}>Hoy</SoftButton>
          <SoftButton onClick={() => move(-1)} aria-label="Mes anterior"><ChevronLeft className="size-4" /></SoftButton>
          <SoftButton onClick={() => move(1)} aria-label="Mes siguiente"><ChevronRight className="size-4" /></SoftButton>
        </div>
      }>
        {MESES_LARGO[ym.m]} <span className="text-muted-foreground">{ym.y}</span>
      </PageTitle>
      <div className="mb-3 flex flex-wrap gap-2">{(["Evento anual", "Mentoría", "Clínica", "Reunión"] as TipoEvento[]).map((t) => <Chip key={t} tone={toneTipo[t]}>{t}</Chip>)}</div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border text-center text-xs font-medium text-muted-foreground">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => {
            const valid = d >= 1 && d <= days;
            const evs = valid ? eventos.filter((e) => e.fecha === iso(d)) : [];
            const hoy = valid && iso(d) === HOY;
            return (
              <div key={i} onClick={() => valid && evs.length === 0 && nav({ to: "/eventos/nuevo", search: { fecha: iso(d) } })}
                className={cn("group min-h-24 border-b border-r border-border p-1.5 md:min-h-28", (i + 1) % 7 === 0 && "border-r-0", valid ? "cursor-pointer hover:bg-muted/40" : "bg-muted/30")}>
                {valid && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className={cn("grid size-6 place-items-center rounded-full text-xs", hoy ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground")}>{d}</span>
                      {evs.length === 0 && <span className="hidden text-xs text-muted-foreground group-hover:inline">+ Crear</span>}
                    </div>
                    <div className="mt-1 space-y-1">
                      {evs.map((e) => (
                        <Link key={e.codigo} to="/eventos/$codigo" params={{ codigo: e.codigo }} onClick={(ev) => ev.stopPropagation()}
                          className={cn("block truncate rounded border-l-2 px-1.5 py-0.5 text-xs font-medium hover:brightness-95", chipCls[toneTipo[e.tipo]])}>
                          <span className="hidden sm:inline">{e.horaInicio} </span>{e.nombre}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      <p className="mt-3 text-sm text-muted-foreground">Toca un evento para ver su detalle, o un día vacío para crear un evento en esa fecha.</p>
    </main>
  );
}
