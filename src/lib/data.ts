// Datos de ejemplo para la maqueta. No son personas reales.

export type TipoEvento = "Evento anual" | "Mentoría" | "Clínica" | "Reunión" | "Otro";
export type EstadoEvento = "Borrador" | "Convocando" | "Inscripción abierta" | "En curso" | "Cerrado";
export type Prioridad = "Alta" | "Media" | "Baja" | "Revisar correo" | "Revisar contacto" | "No invitar";
export type EstadoContacto =
  | "Contactable"
  | "Fuera de Chile"
  | "Contacto desactualizado"
  | "Correo con problema"
  | "Baja solicitada"
  | "No considerar";
export type EstadoInvitado = "Invitado" | "Inscrito" | "No puede" | "Llegó" | "Sin respuesta";

export interface Evento {
  codigo: string;
  nombre: string;
  tipo: TipoEvento;
  fecha: string; // ISO yyyy-mm-dd
  horaInicio?: string | undefined;
  horaFin?: string | undefined;
  lugar?: string | undefined;
  direccion?: string | undefined;
  cupo?: number | undefined;
  estado: EstadoEvento;
  registroAbierto: boolean;
  descripcion?: string | undefined;
}

export interface Persona {
  id: string;
  nombre: string;
  correo: string;
  organizacion: string;
  telefono: string;
  vinculos: string[];
  grupo: string;
  prioridad: Prioridad;
  estado: EstadoContacto;
  puntaje: number;
  ultimoEvento?: string | undefined;
}

export interface Participacion {
  personaId: string;
  codigo: string;
  estado: EstadoInvitado;
  fechaInscripcion?: string | undefined;
  origen?: "Formulario" | "Manual" | "Importación" | "QR" | undefined;
  horaLlegada?: string | undefined;
  origenLlegada?: "QR" | "Manual" | undefined;
  sinInscripcion?: boolean | undefined;
}

export const HOY = "2026-10-26";

export const eventos: Evento[] = [
  { codigo: "anual-2026", nombre: "Encuentro Anual ISF 2026", tipo: "Evento anual", fecha: "2026-11-11", horaInicio: "18:00", horaFin: "20:30", lugar: "Colegio de Ingenieros", cupo: 150, estado: "Inscripción abierta", registroAbierto: false, descripcion: "La jornada anual que reúne a voluntariado, equipo, socios y aliados de ISF." },
  { codigo: "mentoria-octubre", nombre: "Mentoría grupal · Emprendimiento social", tipo: "Mentoría", fecha: "2026-10-28", horaInicio: "18:30", horaFin: "20:00", lugar: "Oficina ISF", direccion: "Providencia 1208, Of. 401", cupo: 30, estado: "Convocando", registroAbierto: false },
  { codigo: "clinica-noviembre", nombre: "Clínica de proyectos comunitarios", tipo: "Clínica", fecha: "2026-11-07", horaInicio: "10:00", estado: "Borrador", registroAbierto: false },
  { codigo: "reunion-socios-nov", nombre: "Reunión de socios y aliados", tipo: "Reunión", fecha: "2026-11-12", horaInicio: "08:30", horaFin: "10:00", lugar: "Online (Meet)", estado: "Convocando", registroAbierto: false },
  { codigo: "mentoria-noviembre", nombre: "Mentoría grupal · Liderazgo", tipo: "Mentoría", fecha: "2026-11-26", horaInicio: "18:30", lugar: "Oficina ISF", cupo: 30, estado: "Borrador", registroAbierto: false },
  { codigo: "clinica-octubre", nombre: "Clínica de postulación a fondos", tipo: "Clínica", fecha: "2026-10-26", horaInicio: "17:00", horaFin: "19:30", lugar: "Oficina ISF", direccion: "Providencia 1208, Of. 401", cupo: 40, estado: "En curso", registroAbierto: true },
  { codigo: "reunion-equipo-oct", nombre: "Planificación trimestral del equipo", tipo: "Reunión", fecha: "2026-10-14", horaInicio: "09:00", lugar: "Oficina ISF", estado: "Cerrado", registroAbierto: false },
  { codigo: "mentoria-septiembre", nombre: "Mentoría grupal · Finanzas para ONG", tipo: "Mentoría", fecha: "2026-09-23", horaInicio: "18:30", lugar: "Oficina ISF", cupo: 30, estado: "Cerrado", registroAbierto: false },
  { codigo: "anual-2025", nombre: "Encuentro Anual ISF 2025", tipo: "Evento anual", fecha: "2025-11-22", horaInicio: "09:30", lugar: "Centro Cultural GAM", cupo: 250, estado: "Cerrado", registroAbierto: false },
  { codigo: "anual-2024", nombre: "Encuentro Anual ISF 2024", tipo: "Evento anual", fecha: "2024-11-16", horaInicio: "10:00", lugar: "Espacio Riesco", cupo: 220, estado: "Cerrado", registroAbierto: false },
];

// Generador determinista para que la maqueta se vea igual en cada carga.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}
const r = rng(42);
const pick = <T,>(a: readonly T[]): T => a[Math.floor(r() * a.length)] as T;

const nombres = ["Camila", "Matías", "Valentina", "Benjamín", "Josefa", "Tomás", "Antonia", "Vicente", "Catalina", "Martín", "Fernanda", "Diego", "Isidora", "Joaquín", "Javiera", "Felipe", "Constanza", "Sebastián", "Francisca", "Nicolás", "Daniela", "Cristóbal", "Paula", "Ignacio", "Macarena", "Rodrigo", "Trinidad", "Andrés", "Carolina", "Pablo"];
const apellidos = ["González", "Muñoz", "Rojas", "Díaz", "Pérez", "Soto", "Contreras", "Silva", "Martínez", "Sepúlveda", "Morales", "Rodríguez", "López", "Fuentes", "Hernández", "Torres", "Araya", "Flores", "Espinoza", "Valenzuela", "Castillo", "Tapia", "Reyes", "Gutiérrez", "Castro", "Vargas", "Álvarez", "Vásquez", "Carrasco", "Cortés"];
const orgs = ["Universidad de Chile", "PUC", "Fundación Mi Parque", "Banco Estado", "Municipalidad de Recoleta", "Techo Chile", "Independiente", "Corfo", "USACH", "Fundación Las Rosas", "Sodexo", "Natura", "Colegio San Ignacio", "—"];
export const catalogoVinculos = ["Voluntad", "Mentor/a", "Socio", "Practicante", "Alianza", "Cercano", "Equipo", "Comunidad", "Asesor/a", "Proveedor"];
export const grupos = ["Equipo ISF", "Voluntariado activo", "Ex voluntariado / histórico", "Socios y aliados", "Cercanos / otros", "Sin clasificar"];
export const prioridades: Prioridad[] = ["Alta", "Media", "Baja", "Revisar correo", "Revisar contacto", "No invitar"];
export const estadosContacto: EstadoContacto[] = ["Contactable", "Fuera de Chile", "Contacto desactualizado", "Correo con problema", "Baja solicitada", "No considerar"];

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const personas: Persona[] = Array.from({ length: 186 }, (_, i) => {
  const n = pick(nombres);
  const a = pick(apellidos);
  const pr = r();
  const prioridad: Prioridad = pr < 0.3 ? "Alta" : pr < 0.6 ? "Media" : pr < 0.82 ? "Baja" : pr < 0.88 ? "Revisar correo" : pr < 0.94 ? "Revisar contacto" : "No invitar";
  const estado: EstadoContacto =
    prioridad === "Revisar correo" ? "Correo con problema" : prioridad === "Revisar contacto" ? "Contacto desactualizado" : prioridad === "No invitar" ? pick(["Baja solicitada", "No considerar"] as const) : r() < 0.08 ? "Fuera de Chile" : "Contactable";
  const nv = 1 + Math.floor(r() * 2.4);
  const vinculos = Array.from(new Set(Array.from({ length: nv }, () => pick(catalogoVinculos))));
  return {
    id: `P${String(1001 + i)}`,
    nombre: `${n} ${a}`,
    correo: `${norm(n)}.${norm(a)}${i % 7 === 0 ? i : ""}@${pick(["gmail.com", "uchile.cl", "outlook.com", "uc.cl", "yahoo.com"])}`,
    organizacion: pick(orgs),
    telefono: `+56 9 ${Math.floor(1000 + r() * 8999)} ${Math.floor(1000 + r() * 8999)}`,
    vinculos,
    grupo: pick(grupos),
    prioridad,
    estado,
    puntaje: prioridad === "Alta" ? 7 + Math.floor(r() * 4) : prioridad === "Media" ? 4 + Math.floor(r() * 3) : Math.floor(r() * 4),
    ultimoEvento: r() < 0.75 ? pick(["anual-2025", "mentoria-septiembre", "reunion-equipo-oct", "anual-2024"]) : undefined,
  };
});

const excluidos = (p: Persona) => ["Baja solicitada", "No considerar", "Correo con problema"].includes(p.estado);

function genParticipaciones(): Participacion[] {
  const out: Participacion[] = [];
  const conf: Record<string, { inv: number; ins: number; lle: number; walk: number; start: string; days: number }> = {
    "anual-2026": { inv: 150, ins: 0.55, lle: 0, walk: 0, start: "2026-09-28", days: 29 },
    "mentoria-octubre": { inv: 40, ins: 0.5, lle: 0, walk: 0, start: "2026-10-12", days: 14 },
    "reunion-socios-nov": { inv: 25, ins: 0.4, lle: 0, walk: 0, start: "2026-10-20", days: 6 },
    "clinica-octubre": { inv: 50, ins: 0.65, lle: 0.6, walk: 3, start: "2026-10-05", days: 20 },
    "reunion-equipo-oct": { inv: 18, ins: 0.9, lle: 0.95, walk: 0, start: "2026-10-01", days: 10 },
    "mentoria-septiembre": { inv: 35, ins: 0.6, lle: 0.8, walk: 2, start: "2026-09-01", days: 20 },
    "anual-2025": { inv: 170, ins: 0.62, lle: 0.78, walk: 11, start: "2025-09-25", days: 55 },
    "anual-2024": { inv: 160, ins: 0.58, lle: 0.8, walk: 8, start: "2024-09-20", days: 55 },
  };
  for (const [codigo, c] of Object.entries(conf)) {
    const pool = personas.filter((p) => !excluidos(p));
    const start = (codigo.length * 7) % pool.length;
    const chosen = [...pool.slice(start), ...pool.slice(0, start)].slice(0, c.inv);
    chosen.forEach((p, idx) => {
      const x = r();
      let estado: EstadoInvitado = "Invitado";
      let fechaInscripcion: string | undefined;
      let horaLlegada: string | undefined;
      if (x < c.ins) {
        estado = "Inscrito";
        // curva: más inscripciones al principio y al final
        const t = Math.min(c.days - 1, Math.floor(Math.pow(r(), 1.4) * c.days));
        const d = new Date(c.start + "T12:00:00");
        d.setDate(d.getDate() + t);
        fechaInscripcion = d.toISOString().slice(0, 10);
        if (r() < c.lle) {
          estado = "Llegó";
          horaLlegada = `${String(9 + Math.floor(r() * 2)).padStart(2, "0")}:${String(Math.floor(r() * 60)).padStart(2, "0")}`;
          if (codigo === "clinica-octubre") horaLlegada = `17:${String(Math.floor(r() * 50)).padStart(2, "0")}`;
        }
      } else if (x < c.ins + 0.08) estado = "No puede";
      else if (idx % 3 === 0) estado = "Sin respuesta";
      out.push({ personaId: p.id, codigo, estado, fechaInscripcion, origen: fechaInscripcion ? (r() < 0.8 ? "Formulario" : "Manual") : undefined, horaLlegada, origenLlegada: horaLlegada ? (r() < 0.85 ? "QR" : "Manual") : undefined });
    });
    const resto = personas.filter((p) => !chosen.includes(p) && !excluidos(p));
    for (let k = 0; k < c.walk; k++) {
      const p = resto[k * 3];
      if (!p) continue;
      out.push({ personaId: p.id, codigo, estado: "Llegó", sinInscripcion: true, horaLlegada: codigo === "clinica-octubre" ? `17:${String(20 + k * 7)}` : `10:${String(10 + k * 4).padStart(2, "0")}`, origenLlegada: "QR" });
    }
  }
  return out;
}

export const participaciones = genParticipaciones();

export const getEvento = (codigo: string) => eventos.find((e) => e.codigo === codigo);
export const getPersona = (id: string) => personas.find((p) => p.id === id);

export function embudo(codigo: string) {
  const ps = participaciones.filter((p) => p.codigo === codigo);
  const invitados = ps.filter((p) => !p.sinInscripcion).length;
  const respondieron = ps.filter((p) => !p.sinInscripcion && p.estado !== "Invitado" && p.estado !== "Sin respuesta").length;
  const inscritos = ps.filter((p) => p.fechaInscripcion).length;
  const llegaron = ps.filter((p) => p.estado === "Llegó").length;
  const sinInscripcion = ps.filter((p) => p.sinInscripcion).length;
  return { invitados, respondieron, inscritos, llegaron, sinInscripcion };
}

export const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
export const MESES_LARGO = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
export const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function fechaLarga(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${(MESES_LARGO[d.getMonth()] ?? "").toLowerCase()} de ${d.getFullYear()}`;
}

export const ultimosCambios = [
  { personaId: "P1004", de: "Contactable", a: "Baja solicitada", motivo: "Pidió no recibir más correos", usuario: "Álvaro", fecha: "2026-10-24" },
  { personaId: "P1019", de: "Contactable", a: "Correo con problema", motivo: "Rebote del correo de invitación", usuario: "Sistema", fecha: "2026-10-22" },
  { personaId: "P1033", de: "Contacto desactualizado", a: "Contactable", motivo: "Actualizó su correo en el formulario", usuario: "Gabriel", fecha: "2026-10-20" },
  { personaId: "P1051", de: "Contactable", a: "Fuera de Chile", motivo: "Se fue a estudiar a España", usuario: "Álvaro", fecha: "2026-10-18" },
  { personaId: "P1077", de: "Contactable", a: "No considerar", motivo: "Duplicado confirmado", usuario: "Gabriel", fecha: "2026-10-15" },
];
