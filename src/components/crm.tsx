import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, LogOut, Plus, Settings, Users, Ticket } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { EstadoContacto, EstadoEvento, EstadoInvitado, Prioridad, TipoEvento } from "@/lib/data";

export function TopNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const items = [
    { to: "/eventos", label: "Eventos", icon: Ticket },
    { to: "/calendario", label: "Calendario", icon: CalendarDays },
    { to: "/personas", label: "Personas", icon: Users },
  ] as const;
  if (path.startsWith("/checkin/") || /^\/eventos\/[^/]+\/qr\/?$/.test(path)) return null;
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-6 px-4">
        <Link to="/eventos" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">ISF</span>
          <span className="hidden sm:inline">Eventos</span>
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((it) => {
            const active = path.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to} className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                <it.icon className="size-4" />
                <span className="hidden md:inline">{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/eventos/nuevo" className="hidden items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground sm:flex">
            <Plus className="size-4" /> Crear evento
          </Link>
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-1 rounded-full">
              <span className="grid size-8 place-items-center rounded-full bg-info-soft text-sm font-semibold text-info">A</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card p-1 text-sm shadow-lg">
                <div className="px-3 py-2">
                  <div className="font-medium">Álvaro</div>
                  <div className="text-xs text-muted-foreground">Equipo ISF</div>
                </div>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent"><Settings className="size-4" /> Ajustes</button>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent"><LogOut className="size-4" /> Salir</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

const tones = {
  green: "bg-success-soft text-success",
  greenStrong: "bg-success-soft text-success-strong",
  blue: "bg-info-soft text-info",
  gray: "bg-muted text-muted-foreground",
  amber: "bg-warning-soft text-warning",
  violet: "bg-violet-soft text-violet",
  rose: "bg-rose-soft text-rose",
} as const;
export type Tone = keyof typeof tones;

export function Chip({ tone = "gray", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", tones[tone], className)}>{children}</span>;
}

export const toneEstadoEvento: Record<EstadoEvento, Tone> = { Borrador: "gray", Convocando: "blue", "Inscripción abierta": "green", "En curso": "amber", Cerrado: "gray" };
export const toneInvitado: Record<EstadoInvitado, Tone> = { Invitado: "blue", Inscrito: "green", "No puede": "amber", Llegó: "greenStrong", "Sin respuesta": "gray" };
export const tonePrioridad: Record<Prioridad, Tone> = { Alta: "green", Media: "blue", Baja: "gray", "Revisar correo": "amber", "Revisar contacto": "amber", "No invitar": "rose" };
export const toneTipo: Record<TipoEvento, Tone> = { "Evento anual": "blue", Mentoría: "violet", Clínica: "green", Reunión: "amber", Otro: "gray" };
export const toneContacto: Record<EstadoContacto, Tone> = { Contactable: "green", "Fuera de Chile": "blue", "Contacto desactualizado": "amber", "Correo con problema": "amber", "Baja solicitada": "rose", "No considerar": "rose" };

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-border bg-card", className)}>{children}</div>;
}

export function PageTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-[28px] font-semibold tracking-tight md:text-[32px]">{children}</h1>
      {right}
    </div>
  );
}

export function SoftButton({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={cn("inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent", className)}>{children}</button>;
}
export function PrimaryButton({ children, className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={cn("inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90", className)}>{children}</button>;
}

export function EmptyState({ icon, text, action }: { icon: ReactNode; text: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="text-muted-foreground">{icon}</div>
      <p className="text-muted-foreground">{text}</p>
      {action}
    </Card>
  );
}
