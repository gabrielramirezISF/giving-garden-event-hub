import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, ChevronRight, Copy, Download, FileUp, Printer, QrCode, Search, Trash2, UserPlus, Users, DoorOpen, Pencil, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, Chip, PrimaryButton, SoftButton, toneEstadoEvento, toneInvitado, tonePrioridad, toneTipo } from "@/components/crm";
import { embudo, fechaLarga, getEvento, getPersona, participaciones, type EstadoInvitado, type Evento } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/eventos/$codigo")({
  loader: ({ params }) => {
    const e = getEvento(params.codigo);
    if (!e) throw notFound();
    return e;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.nombre} · ISF` : "Evento · ISF" },
      { name: "description", content: loaderData ? `Detalle de ${loaderData.nombre}` : "Detalle del evento" },
      { property: "og:title", content: loaderData ? `${loaderData.nombre} · ISF` : "Evento · ISF" },
      { property: "og:description", content: "Invitados, inscritos y check-in del evento." },
    ],
  }),
  component: Detalle,
});

const TABS = ["Resumen", "Invitados", "Inscritos", "Check-in", "Más"] as const;
type Tab = (typeof TABS)[number];

function Detalle() {
  const e = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("Resumen");
  return (
    <main className="mx-auto max-w-[960px] px-4 py-8">
      <Link to="/eventos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">Eventos <ChevronRight className="size-3.5" /></Link>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight md:text-[32px]">{e.nombre}</h1>
          <div className="mt-2 flex flex-wrap gap-2"><Chip tone={toneTipo[e.tipo]}>{e.tipo}</Chip><Chip tone={toneEstadoEvento[e.estado]}>{e.estado}</Chip><span className="font-mono text-xs leading-5 text-muted-foreground">{e.codigo}</span></div>
        </div>
        <SoftButton><Pencil className="size-4" /> Editar evento</SoftButton>
      </div>
      <div className="mt-6 flex gap-5 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("-mb-px whitespace-nowrap border-b-2 pb-2.5 text-sm font-medium", tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>{t}</button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "Resumen" && <Resumen e={e} go={setTab} />}
        {tab === "Invitados" && <Invitados e={e} />}
        {tab === "Inscritos" && <Inscritos e={e} />}
        {tab === "Check-in" && <CheckIn e={e} />}
        {tab === "Más" && <Mas />}
      </div>
    </main>
  );
}

function Resumen({ e, go }: { e: Evento; go: (t: Tab) => void }) {
  const f = embudo(e.codigo);
  const faltan = [!e.lugar && "Falta la ubicación", !e.cupo && "Falta el cupo máximo", !e.horaFin && "Falta la hora de término"].filter(Boolean) as string[];
  const porDia = useMemo(() => {
    const m = new Map<string, number>();
    participaciones.filter((p) => p.codigo === e.codigo && p.fechaInscripcion).forEach((p) => m.set(p.fechaInscripcion!, (m.get(p.fechaInscripcion!) ?? 0) + 1));
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [e.codigo]);
  const max = Math.max(1, ...porDia.map(([, n]) => n));
  const acciones = [
    { icon: UserPlus, t: "Agregar invitados", d: "Desde la base de personas", tab: "Invitados" as Tab },
    { icon: FileUp, t: "Importar inscripciones", d: "CSV del formulario", tab: "Inscritos" as Tab },
    { icon: DoorOpen, t: "Abrir check-in", d: "Registro en la puerta", tab: "Check-in" as Tab },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {acciones.map((a) => (
          <button key={a.t} onClick={() => go(a.tab)} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:shadow-md">
            <span className="grid size-10 place-items-center rounded-lg bg-info-soft text-info"><a.icon className="size-5" /></span>
            <span><span className="block text-sm font-semibold">{a.t}</span><span className="text-xs text-muted-foreground">{a.d}</span></span>
          </button>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Cuándo y dónde</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><div className="font-medium capitalize">{fechaLarga(e.fecha)}</div><div className="text-sm text-muted-foreground">{e.horaInicio ?? "—"}{e.horaFin ? ` – ${e.horaFin}` : ""}</div></div>
          <div><div className="font-medium">{e.lugar ?? "Sin lugar"}</div><div className="text-sm text-muted-foreground">{e.direccion ?? ""}{e.cupo ? ` · Cupo ${e.cupo}` : ""}</div></div>
        </div>
        {faltan.length > 0 && (
          <div className="mt-4 space-y-1.5">
            {faltan.map((x) => (
              <div key={x} className="flex items-center gap-2 rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning"><AlertTriangle className="size-4" />{x}<button className="ml-auto font-medium underline">Editar</button></div>
            ))}
          </div>
        )}
      </Card>
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Embudo</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[["Invitados", f.invitados], ["Inscritos", f.inscritos], ["Llegaron", f.llegaron]].map(([l, n], i) => (
            <div key={l} className="relative">
              <div className="text-4xl font-semibold tracking-tight">{n}</div>
              <div className="text-sm text-muted-foreground">{l}</div>
              {i > 0 && <ChevronRight className="absolute -left-3 top-3 size-5 text-muted-foreground/50" />}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">{f.respondieron} respondieron · <span className="font-medium text-foreground">+{f.sinInscripcion} llegaron sin inscripción</span></div>
      </Card>
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Inscripciones por día</h3>
        {porDia.length === 0 ? <p className="text-sm text-muted-foreground">Aún no hay inscripciones.</p> : (
          <div className="flex h-40 items-end gap-1">
            {porDia.map(([d, n]) => (
              <div key={d} className="group relative flex-1" title={`${d}: ${n}`}>
                <div className="rounded-t bg-primary/80 group-hover:bg-primary" style={{ height: `${(n / max) * 150}px` }} />
              </div>
            ))}
          </div>
        )}
        {porDia.length > 0 && <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{porDia[0][0]}</span><span>{porDia.at(-1)![0]}</span></div>}
      </Card>
    </div>
  );
}

function Invitados({ e }: { e: Evento }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<"Todos" | EstadoInvitado>("Todos");
  const rows = participaciones.filter((p) => p.codigo === e.codigo && !p.sinInscripcion).map((p) => ({ p, per: getPersona(p.personaId)! }))
    .filter(({ p, per }) => (f === "Todos" || p.estado === f) && (per.nombre + per.correo + per.organizacion).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <PrimaryButton><UserPlus className="size-4" /> Agregar persona</PrimaryButton>
        <SoftButton><FileUp className="size-4" /> Importar lista (CSV)</SoftButton>
        <SoftButton><Download className="size-4" /> Exportar para envío</SoftButton>
        <span className="ml-auto self-center text-xs text-muted-foreground">Cupo semanal: 300 correos · excluye bajas</span>
      </div>
      <Filtros q={q} setQ={setQ} opts={["Todos", "Invitado", "Inscrito", "No puede", "Llegó"]} f={f} setF={(v) => setF(v as typeof f)} />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground"><tr className="border-b border-border">{["Nombre", "Organización", "Vínculos", "Estado", "Prioridad"].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {rows.slice(0, 60).map(({ p, per }) => (
              <tr key={per.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-4 py-2.5"><Link to="/personas/$id" params={{ id: per.id }} className="font-medium hover:text-primary">{per.nombre}</Link><div className="text-xs text-muted-foreground">{per.correo}</div></td>
                <td className="px-4 py-2.5 text-muted-foreground">{per.organizacion}</td>
                <td className="px-4 py-2.5"><div className="flex flex-wrap gap-1">{per.vinculos.map((v) => <Chip key={v}>{v}</Chip>)}</div></td>
                <td className="px-4 py-2.5"><Chip tone={toneInvitado[p.estado]}>{p.estado}</Chip></td>
                <td className="px-4 py-2.5"><Chip tone={tonePrioridad[per.prioridad]}>{per.prioridad}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 text-xs text-muted-foreground">{rows.length} personas</div>
      </Card>
    </div>
  );
}

function Filtros({ q, setQ, opts, f, setF }: { q: string; setQ: (s: string) => void; opts: string[]; f: string; setF: (s: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-56 flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, correo u organización" className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" /></div>
      <div className="flex flex-wrap gap-1">{opts.map((o) => <button key={o} onClick={() => setF(o)} className={cn("rounded-full px-3 py-1 text-sm", f === o ? "bg-foreground text-background" : "bg-card text-muted-foreground border border-border hover:text-foreground")}>{o}</button>)}</div>
    </div>
  );
}

function Inscritos({ e }: { e: Evento }) {
  const rows = participaciones.filter((p) => p.codigo === e.codigo && p.fechaInscripcion).map((p) => ({ p, per: getPersona(p.personaId)! }));
  const n = rows.length;
  const logistica = [
    { t: "Restricción alimentaria", items: [["Vegetariana", Math.round(n * 0.14)], ["Vegana", Math.round(n * 0.05)], ["Sin gluten", Math.round(n * 0.04)], ["Sin lactosa", Math.round(n * 0.03)]] },
    { t: "Transporte", items: [["Metro / micro", Math.round(n * 0.52)], ["Auto", Math.round(n * 0.28)], ["Bicicleta", Math.round(n * 0.08)], ["Otro", Math.round(n * 0.12)]] },
    { t: "Hospedaje", items: [["Necesitan", Math.round(n * 0.06)], ["No necesitan", n - Math.round(n * 0.06)]] },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2"><PrimaryButton><UserPlus className="size-4" /> Inscribir a mano</PrimaryButton><SoftButton><FileUp className="size-4" /> Importar inscripciones</SoftButton></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {logistica.map((l) => (
          <Card key={l.t} className="p-4"><h4 className="mb-2 text-sm font-semibold">{l.t}</h4>
            {l.items.map(([k, v]) => <div key={k} className="flex justify-between py-0.5 text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>)}
          </Card>
        ))}
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground"><tr className="border-b border-border">{["Nombre", "Organización", "Inscripción", "Origen", "Estado"].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr></thead>
          <tbody>{rows.sort((a, b) => b.p.fechaInscripcion!.localeCompare(a.p.fechaInscripcion!)).slice(0, 60).map(({ p, per }) => (
            <tr key={per.id} className="border-b border-border last:border-0 hover:bg-muted/50">
              <td className="px-4 py-2.5 font-medium">{per.nombre}</td><td className="px-4 py-2.5 text-muted-foreground">{per.organizacion}</td>
              <td className="px-4 py-2.5">{p.fechaInscripcion}</td><td className="px-4 py-2.5"><Chip>{p.origen}</Chip></td><td className="px-4 py-2.5"><Chip tone={toneInvitado[p.estado]}>{p.estado}</Chip></td>
            </tr>))}
          </tbody>
        </table>
        <div className="px-4 py-2.5 text-xs text-muted-foreground">{n} inscritos · las restricciones por persona solo aparecen en la lista de respaldo imprimible</div>
      </Card>
    </div>
  );
}

function CheckIn({ e }: { e: Evento }) {
  const base = participaciones.filter((p) => p.codigo === e.codigo);
  const [abierto, setAbierto] = useState(e.registroAbierto);
  const [extra, setExtra] = useState<{ id: string; hora: string }[]>([]);
  const [q, setQ] = useState("");
  const marcados = new Set(extra.map((x) => x.id));
  const llegadas = [
    ...extra.map((x) => ({ per: getPersona(x.id)!, hora: x.hora, origen: "Manual" })),
    ...base.filter((p) => p.horaLlegada).sort((a, b) => b.horaLlegada!.localeCompare(a.horaLlegada!)).map((p) => ({ per: getPersona(p.personaId)!, hora: p.horaLlegada!, origen: p.origenLlegada! + (p.sinInscripcion ? " · sin inscripción" : "") })),
  ];
  const inscritos = base.filter((p) => p.fechaInscripcion).length;
  const llegaronIns = base.filter((p) => p.fechaInscripcion && p.horaLlegada).length + extra.length;
  const sinIns = base.filter((p) => p.sinInscripcion).length;
  const pendientes = q.length < 2 ? [] : base.filter((p) => p.fechaInscripcion && !p.horaLlegada && !marcados.has(p.personaId)).map((p) => getPersona(p.personaId)!).filter((per) => (per.nombre + per.correo).toLowerCase().includes(q.toLowerCase())).slice(0, 5);
  return (
    <div className="mx-auto max-w-[520px] space-y-4">
      <button onClick={() => setAbierto(!abierto)} className={cn("flex w-full items-center justify-between rounded-xl border p-5 text-left", abierto ? "border-success/30 bg-success-soft" : "border-border bg-card")}>
        <span><span className="block text-lg font-semibold">{abierto ? "Registro abierto" : "Registro cerrado"}</span><span className="text-sm text-muted-foreground">{abierto ? "La gente puede registrarse con el QR" : "Toca para abrir el registro"}</span></span>
        <span className={cn("relative h-8 w-14 rounded-full transition-colors", abierto ? "bg-success" : "bg-input")}><span className={cn("absolute top-1 size-6 rounded-full bg-card shadow transition-all", abierto ? "left-7" : "left-1")} /></span>
      </button>
      <Card className="p-6 text-center">
        <div className="text-6xl font-semibold tracking-tight">{llegaronIns}<span className="text-3xl text-muted-foreground">/{inscritos}</span></div>
        <div className="text-sm text-muted-foreground">llegaron de los inscritos</div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm"><div className="rounded-lg bg-muted p-2"><b>{sinIns}</b> sin inscripción</div><div className="rounded-lg bg-muted p-2"><b>{llegaronIns + sinIns}</b> en el lugar</div></div>
      </Card>
      <div className="grid grid-cols-2 gap-2"><SoftButton className="justify-center py-3"><QrCode className="size-4" /> Mostrar QR</SoftButton><SoftButton className="justify-center py-3"><Printer className="size-4" /> Lista de respaldo</SoftButton></div>
      <Card className="p-4">
        <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Buscar por nombre o correo para marcar llegada" className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-3 outline-none focus:ring-2 focus:ring-ring/30" /></div>
        {pendientes.map((per) => (
          <div key={per.id} className="mt-2 flex items-center justify-between rounded-lg border border-border p-3">
            <div><div className="font-medium">{per.nombre}</div><div className="text-xs text-muted-foreground">{per.organizacion}</div></div>
            <PrimaryButton onClick={() => { setExtra([{ id: per.id, hora: new Date().toTimeString().slice(0, 5) }, ...extra]); setQ(""); }}><Check className="size-4" /> Marcar llegada</PrimaryButton>
          </div>
        ))}
        {q.length >= 2 && pendientes.length === 0 && <p className="mt-2 text-sm text-muted-foreground">Sin coincidencias entre los inscritos pendientes.</p>}
      </Card>
      <Card>
        <div className="flex items-center justify-between border-b border-border px-4 py-3"><h4 className="text-sm font-semibold">Últimas llegadas</h4><span className="text-xs text-muted-foreground">se actualiza cada 15 s</span></div>
        {llegadas.length === 0 ? <div className="flex flex-col items-center gap-2 p-8 text-sm text-muted-foreground"><Users className="size-8" />Aún no llega nadie</div> :
          llegadas.slice(0, 10).map((l, i) => (
            <div key={l.per.id + i} className="flex items-center gap-3 border-b border-border px-4 py-2.5 text-sm last:border-0"><span className="w-12 font-mono text-muted-foreground">{l.hora}</span><span className="flex-1 font-medium">{l.per.nombre}</span><Chip tone={l.origen.startsWith("QR") ? "blue" : "gray"}>{l.origen}</Chip></div>
          ))}
      </Card>
    </div>
  );
}

function Mas() {
  const items = [
    { icon: Download, t: "Exportar asistencia (CSV)", d: "Lista de quienes llegaron, con hora y origen." },
    { icon: Copy, t: "Duplicar evento", d: "Crea una copia para el próximo año, sin invitados." },
    { icon: Trash2, t: "Eliminar evento", d: "Solo disponible si el evento no tiene invitados ni inscritos.", disabled: true },
  ];
  return (
    <Card>
      {items.map((it) => (
        <div key={it.t} className="flex items-center gap-4 border-b border-border p-4 last:border-0">
          <it.icon className={cn("size-5", it.disabled ? "text-muted-foreground/50" : "text-muted-foreground")} />
          <div className="flex-1"><div className={cn("font-medium", it.disabled && "text-muted-foreground")}>{it.t}</div><div className="text-sm text-muted-foreground">{it.d}</div></div>
          <SoftButton disabled={it.disabled} className="disabled:opacity-40">{it.t.split(" ")[0]}</SoftButton>
        </div>
      ))}
    </Card>
  );
}
