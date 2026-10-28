import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Clock3, MapPin, WifiOff } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { PrimaryButton } from "@/components/crm";
import { getEvento } from "@/lib/data";
import { firstName, mockArrival, parseCheckinState, type CheckinState } from "@/lib/checkin";

export const Route = createFileRoute("/checkin/$codigo")({
  validateSearch: (search: Record<string, unknown>) => ({ estado: parseCheckinState(search["estado"]) }),
  loader: ({ params }) => {
    const evento = getEvento(params.codigo);
    if (!evento) throw notFound();
    return { codigo: evento.codigo, nombre: evento.nombre, lugar: evento.lugar };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `Registro de llegada · ${loaderData?.nombre ?? "ISF"}` },
    { name: "description", content: "Registra tu llegada al encuentro ISF sin cuentas ni contraseñas." },
    { property: "og:title", content: `Registro de llegada · ${loaderData?.nombre ?? "ISF"}` },
    { property: "og:description", content: "Bienvenido al encuentro ISF." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: Arrival,
});

function Arrival() {
  const evento = Route.useLoaderData();
  const { estado } = Route.useSearch();
  const [state, setState] = useState<CheckinState>(estado);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [greeting, setGreeting] = useState("Daniela");
  const registered = useRef(new Set<string>());
  useEffect(() => { setState(estado); setEmail(""); setName(""); setOrganization(""); setGreeting("Daniela"); }, [estado]);
  function submitEmail(event: FormEvent) {
    event.preventDefault();
    if (!navigator.onLine) { setState("error"); return; }
    const result = mockArrival(email, registered.current);
    setGreeting(result.name);
    setState(result.state);
    setEmail("");
  }
  function submitName(event: FormEvent) {
    event.preventDefault();
    const givenName = firstName(name);
    if (!givenName) return;
    if (!navigator.onLine) { setState("error"); return; }
    setGreeting(givenName);
    setName(""); setOrganization(""); setEmail("");
    setState("bienvenida");
  }
  const success = state === "bienvenida" || state === "registrado";
  const inputClass = "mt-2 min-h-14 w-full rounded-lg border border-input bg-card px-4 text-base outline-none focus:ring-2 focus:ring-ring/30";
  return (
    <main className="arrival-page min-h-svh bg-background px-6 py-8 text-foreground">
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[327px] flex-col">
        <header className="border-b border-border pb-6">
          <span className="grid size-10 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">ISF</span>
          <p className="mt-7 text-xs font-medium uppercase text-muted-foreground">Registro de llegada</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">{evento.nombre}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4 shrink-0" />{evento.lugar}</p>
        </header>
        <section className="flex-1 py-9" aria-live="polite">
          {state === "inicio" && <form onSubmit={submitEmail}>
            <label htmlFor="arrival-email" className="text-sm font-medium">Tu correo</label>
            <input id="arrival-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="nombre@ejemplo.cl" />
            <PrimaryButton type="submit" className="mt-6 min-h-14 w-full justify-center text-base">Registrar mi llegada<ArrowRight className="size-5" /></PrimaryButton>
          </form>}
          {success && <div className="pt-2 text-center">
            <span className="mx-auto grid size-24 place-items-center rounded-full bg-success-soft text-success-strong"><Check className="size-12" strokeWidth={2.5} /></span>
            <h2 className="mt-7 break-words text-2xl font-semibold leading-snug">{state === "bienvenida" ? `¡Bienvenida, ${greeting}!` : `Ya estabas registrada, ${greeting}. ¡Disfruta el evento!`}</h2>
            {state === "bienvenida" && <p className="mt-3 text-base text-muted-foreground">¡Disfruta el evento!</p>}
          </div>}
          {state === "no-encontrado" && <form onSubmit={submitName}>
            <h2 className="mb-7 text-xl font-semibold leading-snug">No te encontramos en la lista. Regístrate aquí</h2>
            <label htmlFor="arrival-name" className="text-sm font-medium">Nombre <span className="text-muted-foreground">(obligatorio)</span></label>
            <input id="arrival-name" autoComplete="given-name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            <label htmlFor="arrival-org" className="mt-5 block text-sm font-medium">Organización <span className="text-muted-foreground">(opcional)</span></label>
            <input id="arrival-org" autoComplete="organization" maxLength={120} value={organization} onChange={(e) => setOrganization(e.target.value)} className={inputClass} />
            <PrimaryButton type="submit" disabled={!firstName(name)} className="mt-6 min-h-14 w-full justify-center text-base disabled:opacity-50">Registrarme<ArrowRight className="size-5" /></PrimaryButton>
          </form>}
          {state === "cerrado" && <div className="pt-2 text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-warning-soft text-warning"><Clock3 className="size-9" /></span><h2 className="mt-7 text-xl font-semibold leading-snug">El registro de llegada aún no está abierto. Pregunta en la entrada.</h2></div>}
          {state === "error" && <div className="pt-2 text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-rose-soft text-rose"><WifiOff className="size-9" /></span><h2 className="mt-7 text-xl font-semibold leading-snug">No pudimos registrarte. Intenta de nuevo o pide ayuda en la entrada.</h2><PrimaryButton className="mt-7 min-h-14 w-full justify-center text-base" onClick={() => setState("inicio")}>Intentar de nuevo</PrimaryButton></div>}
        </section>
        <footer className="pt-6 text-center text-xs text-muted-foreground">ISF · Encuentro Anual 2026</footer>
      </div>
    </main>
  );
}