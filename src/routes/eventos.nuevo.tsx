import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, PrimaryButton } from "@/components/crm";
import { z } from "zod";

export const Route = createFileRoute("/eventos/nuevo")({
  validateSearch: z.object({ fecha: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Crear evento · ISF" },
      { name: "description", content: "Crear un nuevo evento de ISF." },
      { property: "og:title", content: "Crear evento · ISF" },
      { property: "og:description", content: "Crear un nuevo evento de ISF." },
    ],
  }),
  component: Nuevo,
});

const slug = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Nuevo() {
  const { fecha } = Route.useSearch();
  const nav = useNavigate();
  const [nombre, setNombre] = useState("");
  const input = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30";
  const label = "mb-1 block text-sm font-medium";
  return (
    <main className="mx-auto max-w-[640px] px-4 py-10">
      <Link to="/eventos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">Eventos <ChevronRight className="size-3.5" /></Link>
      <h1 className="mb-6 mt-1 text-[28px] font-semibold tracking-tight">Crear evento</h1>
      <Card className="space-y-4 p-6">
        <div><label className={label}>Nombre *</label><input className={input} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Encuentro Anual ISF 2027" /></div>
        <div><label className={label}>Código</label><input className={input + " font-mono text-muted-foreground"} value={slug(nombre)} readOnly placeholder="se-genera-desde-el-nombre" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={label}>Tipo *</label><select className={input}>{["Evento anual", "Mentoría", "Clínica", "Reunión", "Otro"].map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><label className={label}>Fecha *</label><input type="date" defaultValue={fecha} className={input} /></div>
          <div><label className={label}>Hora de inicio</label><input type="time" className={input} /></div>
          <div><label className={label}>Hora de término</label><input type="time" className={input} /></div>
          <div><label className={label}>Lugar</label><input className={input} placeholder="Centro Cultural GAM" /></div>
          <div><label className={label}>Cupo máximo</label><input type="number" className={input} placeholder="250" /></div>
        </div>
        <div><label className={label}>Dirección</label><input className={input} /></div>
        <div><label className={label}>Descripción breve</label><textarea rows={3} className={input} /></div>
        <p className="text-xs text-muted-foreground">Solo nombre, tipo y fecha son obligatorios. Lo demás se puede completar después.</p>
        <div className="flex justify-end"><PrimaryButton onClick={() => nav({ to: "/eventos/$codigo", params: { codigo: "clinica-noviembre" } })}>Crear evento</PrimaryButton></div>
      </Card>
    </main>
  );
}
