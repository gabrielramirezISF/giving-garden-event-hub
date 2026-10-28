import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Archive, ChevronRight, Mail, Pencil, Phone, Plus, Building2, X } from "lucide-react";
import { useState } from "react";
import { Card, Chip, SoftButton, toneContacto, toneInvitado, tonePrioridad } from "@/components/crm";
import { catalogoVinculos, getEvento, getPersona, participaciones } from "@/lib/data";

export const Route = createFileRoute("/personas/$id")({
  loader: ({ params }) => {
    const p = getPersona(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.nombre} · ISF` : "Persona · ISF" },
      { name: "description", content: "Ficha de contacto en ISF." },
      { property: "og:title", content: loaderData ? `${loaderData.nombre} · ISF` : "Persona · ISF" },
      { property: "og:description", content: "Ficha de contacto en ISF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ficha,
});

function Ficha() {
  const p = Route.useLoaderData();
  const [vinculos, setVinculos] = useState(p.vinculos);
  const [estado, setEstado] = useState(p.estado);
  const [baja, setBaja] = useState(false);
  const [motivo, setMotivo] = useState("");
  const hist = participaciones.filter((x) => x.personaId === p.id).map((x) => ({ x, e: getEvento(x.codigo)! })).sort((a, b) => b.e.fecha.localeCompare(a.e.fecha));
  const disponibles = catalogoVinculos.filter((v) => !vinculos.includes(v));

  return (
    <main className="mx-auto max-w-[960px] px-4 py-8">
      <Link to="/personas" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">Personas <ChevronRight className="size-3.5" /></Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-info-soft text-xl font-semibold text-info">{p.nombre.split(" ").map((s) => s[0]).join("")}</span>
          <div>
            <h1 className="text-[28px] font-semibold leading-tight tracking-tight">{p.nombre}</h1>
            <div className="mt-1 flex flex-wrap gap-2"><Chip tone={tonePrioridad[p.prioridad]}>Prioridad {p.prioridad}</Chip><Chip tone={toneContacto[estado]}>{estado}</Chip><span className="font-mono text-xs leading-5 text-muted-foreground">{p.id}</span></div>
          </div>
        </div>
        <div className="flex gap-2"><SoftButton><Pencil className="size-4" /> Editar</SoftButton><SoftButton onClick={() => setBaja(true)}><Archive className="size-4" /> Dar de baja</SoftButton></div>
      </div>

      {baja && (
        <Card className="mt-4 border-warning/40 bg-warning-soft p-4">
          <div className="text-sm font-medium">Dar de baja a {p.nombre}</div>
          <p className="text-xs text-muted-foreground">No se borra: cambia su estado a "Baja solicitada" y queda registrado con el motivo.</p>
          <div className="mt-2 flex gap-2">
            <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Motivo" className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm" />
            <button disabled={!motivo} onClick={() => { setEstado("Baja solicitada"); setBaja(false); }} className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40">Confirmar</button>
            <SoftButton onClick={() => setBaja(false)}>Cancelar</SoftButton>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <Card className="space-y-2.5 p-5 text-sm">
            <h3 className="mb-1 text-sm font-semibold text-muted-foreground">Contacto</h3>
            <div className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" />{p.correo}</div>
            <div className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" />{p.telefono}</div>
            <div className="flex items-center gap-2"><Building2 className="size-4 text-muted-foreground" />{p.organizacion}</div>
            <div className="pt-1 text-xs text-muted-foreground">Grupo: {p.grupo}</div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Vínculos</h3>
            <div className="flex flex-wrap gap-1.5">
              {vinculos.map((v) => (
                <span key={v} className="inline-flex items-center gap-1 rounded-full bg-muted py-0.5 pl-2.5 pr-1 text-xs font-medium">{v} <span className="text-muted-foreground">desde 2024</span>
                  <button onClick={() => setVinculos(vinculos.filter((x) => x !== v))} className="rounded-full p-0.5 hover:bg-background" aria-label={`Terminar ${v}`}><X className="size-3" /></button></span>
              ))}
              {disponibles.length > 0 && (
                <select value="" onChange={(e) => e.target.value && setVinculos([...vinculos, e.target.value])} className="rounded-full border border-dashed border-border bg-card px-2 py-0.5 text-xs text-muted-foreground">
                  <option value="">+ Agregar vínculo</option>{disponibles.map((v) => <option key={v}>{v}</option>)}
                </select>
              )}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Potencial para el próximo evento</h3>
            <div className="text-3xl font-semibold">{p.puntaje}<span className="text-base text-muted-foreground"> pts</span></div>
            <p className="text-xs text-muted-foreground">Según su participación en los dos últimos eventos anuales y su grupo.</p>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <h3 className="border-b border-border px-5 py-3 text-sm font-semibold text-muted-foreground">Historial por evento</h3>
            {hist.length === 0 ? <p className="p-5 text-sm text-muted-foreground">Aún no participa en eventos.</p> : hist.map(({ x, e }) => (
              <Link key={e.codigo} to="/eventos/$codigo" params={{ codigo: e.codigo }} className="flex items-center justify-between border-b border-border px-5 py-3 text-sm last:border-0 hover:bg-muted/50">
                <div><div className="font-medium">{e.nombre}</div><div className="text-xs text-muted-foreground">{e.fecha}</div></div>
                <Chip tone={toneInvitado[x.estado]}>{x.sinInscripcion ? "Llegó sin inscripción" : x.estado}</Chip>
              </Link>
            ))}
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Cambios de estado</h3>
            <ol className="space-y-3 border-l border-border pl-4 text-sm">
              {estado !== p.estado && <li><div className="font-medium">{p.estado} → {estado}</div><div className="text-xs text-muted-foreground">Hoy · Álvaro · {motivo}</div></li>}
              <li><div className="font-medium">Sin estado → {p.estado}</div><div className="text-xs text-muted-foreground">2024-03-12 · Importación del Excel</div></li>
            </ol>
            <button className="mt-3 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><Plus className="size-3.5" /> Cambiar estado</button>
          </Card>
        </div>
      </div>
    </main>
  );
}
