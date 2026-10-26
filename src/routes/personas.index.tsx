import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpDown, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, Chip, PageTitle, PrimaryButton, toneContacto, tonePrioridad } from "@/components/crm";
import { catalogoVinculos, embudo, estadosContacto, eventos, getPersona, grupos, participaciones, personas, prioridades, ultimosCambios, type Prioridad } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/personas/")({
  head: () => ({
    meta: [
      { title: "Personas · ISF" },
      { name: "description", content: "Contactos de ISF con prioridad, estado y vínculos." },
      { property: "og:title", content: "Personas · ISF" },
      { property: "og:description", content: "Contactos de ISF con prioridad, estado y vínculos." },
    ],
  }),
  component: Personas,
});

const PAGE = 50;
const ordenPrio = Object.fromEntries(prioridades.map((p, i) => [p, i])) as Record<Prioridad, number>;

function Personas() {
  const [q, setQ] = useState("");
  const [prio, setPrio] = useState<Prioridad | "">("");
  const [estado, setEstado] = useState("");
  const [vinculo, setVinculo] = useState("");
  const [evento, setEvento] = useState("");
  const [sort, setSort] = useState<"nombre" | "prioridad">("prioridad");
  const [page, setPage] = useState(0);

  const conteo = (p: Prioridad) => personas.filter((x) => x.prioridad === p).length;
  const filtradas = useMemo(() => {
    const enEvento = evento ? new Set(participaciones.filter((p) => p.codigo === evento).map((p) => p.personaId)) : null;
    return personas
      .filter((p) => (!prio || p.prioridad === prio) && (!estado || p.estado === estado) && (!vinculo || p.vinculos.includes(vinculo)) && (!enEvento || enEvento.has(p.id)))
      .filter((p) => (p.nombre + p.correo + p.organizacion).toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (sort === "nombre" ? a.nombre.localeCompare(b.nombre) : ordenPrio[a.prioridad] - ordenPrio[b.prioridad] || b.puntaje - a.puntaje));
  }, [q, prio, estado, vinculo, evento, sort]);
  const pages = Math.max(1, Math.ceil(filtradas.length / PAGE));
  const rows = filtradas.slice(page * PAGE, page * PAGE + PAGE);
  const sel = "rounded-lg border border-input bg-card px-2.5 py-2 text-sm";
  const anuales = eventos.filter((e) => e.estado !== "Borrador").slice(0, 6);

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-10">
      <PageTitle right={<PrimaryButton><Plus className="size-4" /> Nueva persona</PrimaryButton>}>Personas</PageTitle>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {prioridades.map((p) => (
          <button key={p} onClick={() => { setPrio(prio === p ? "" : p); setPage(0); }} className={cn("rounded-xl border bg-card p-4 text-left transition-shadow hover:shadow-md", prio === p ? "border-primary ring-2 ring-primary/20" : "border-border")}>
            <Chip tone={tonePrioridad[p]}>{p}</Chip>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{conteo(p)}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Participación por evento</h3>
          {anuales.map((e) => { const f = embudo(e.codigo); const pct = f.invitados ? (f.inscritos / f.invitados) * 100 : 0; return (
            <div key={e.codigo} className="mb-2.5">
              <div className="flex justify-between text-sm"><span className="truncate">{e.nombre}</span><span className="ml-2 shrink-0 text-muted-foreground">{f.inscritos}/{f.invitados}</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div>
            </div>); })}
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Por grupo</h3>
          {grupos.map((g) => <div key={g} className="flex justify-between border-b border-border py-1.5 text-sm last:border-0"><span>{g}</span><span className="font-medium">{personas.filter((p) => p.grupo === g).length}</span></div>)}
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Últimos cambios de estado</h3>
          {ultimosCambios.map((c) => { const per = getPersona(c.personaId)!; return (
            <div key={c.personaId} className="border-b border-border py-2 text-sm last:border-0">
              <div className="flex justify-between"><Link to="/personas/$id" params={{ id: per.id }} className="font-medium hover:text-primary">{per.nombre}</Link><span className="text-xs text-muted-foreground">{c.fecha.slice(5)}</span></div>
              <div className="text-xs text-muted-foreground">{c.de} → <span className="text-foreground">{c.a}</span> · {c.usuario}</div>
            </div>); })}
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <div className="relative min-w-60 flex-1"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Buscar por nombre, correo u organización" className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" /></div>
        <select className={sel} value={prio} onChange={(e) => { setPrio(e.target.value as Prioridad); setPage(0); }}><option value="">Prioridad</option>{prioridades.map((p) => <option key={p}>{p}</option>)}</select>
        <select className={sel} value={estado} onChange={(e) => { setEstado(e.target.value); setPage(0); }}><option value="">Estado</option>{estadosContacto.map((p) => <option key={p}>{p}</option>)}</select>
        <select className={sel} value={vinculo} onChange={(e) => { setVinculo(e.target.value); setPage(0); }}><option value="">Vínculo</option>{catalogoVinculos.map((p) => <option key={p}>{p}</option>)}</select>
        <select className={sel} value={evento} onChange={(e) => { setEvento(e.target.value); setPage(0); }}><option value="">Participó en…</option>{eventos.map((p) => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}</select>
        {(prio || estado || vinculo || evento) && <button onClick={() => { setPrio(""); setEstado(""); setVinculo(""); setEvento(""); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><X className="size-3.5" /> Limpiar</button>}
      </div>

      <Card className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-2.5 font-medium"><button onClick={() => setSort("nombre")} className={cn("flex items-center gap-1", sort === "nombre" && "text-foreground")}>Nombre <ArrowUpDown className="size-3" /></button></th>
              <th className="px-4 py-2.5 font-medium">Organización</th>
              <th className="px-4 py-2.5 font-medium">Vínculos</th>
              <th className="px-4 py-2.5 font-medium"><button onClick={() => setSort("prioridad")} className={cn("flex items-center gap-1", sort === "prioridad" && "text-foreground")}>Prioridad <ArrowUpDown className="size-3" /></button></th>
              <th className="px-4 py-2.5 font-medium">Estado</th>
              <th className="px-4 py-2.5 font-medium">Último evento</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-4 py-2.5"><Link to="/personas/$id" params={{ id: p.id }} className="font-medium hover:text-primary">{p.nombre}</Link><div className="text-xs text-muted-foreground">{p.correo}</div></td>
                <td className="px-4 py-2.5 text-muted-foreground">{p.organizacion}</td>
                <td className="px-4 py-2.5"><div className="flex flex-wrap gap-1">{p.vinculos.map((v) => <Chip key={v}>{v}</Chip>)}</div></td>
                <td className="px-4 py-2.5"><Chip tone={tonePrioridad[p.prioridad]}>{p.prioridad}</Chip></td>
                <td className="px-4 py-2.5"><Chip tone={toneContacto[p.estado]}>{p.estado}</Chip></td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.ultimoEvento ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
          <span>{filtradas.length} personas</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-md border border-border p-1 disabled:opacity-40" aria-label="Anterior"><ChevronLeft className="size-4" /></button>
            <span>Página {page + 1} de {pages}</span>
            <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="rounded-md border border-border p-1 disabled:opacity-40" aria-label="Siguiente"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </Card>
    </main>
  );
}
