export const checkinStates = ["inicio", "bienvenida", "registrado", "no-encontrado", "cerrado", "error"] as const;
export type CheckinState = (typeof checkinStates)[number];

export function parseCheckinState(value: unknown): CheckinState {
  return checkinStates.find((state) => state === value) ?? "inicio";
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

// Isolated fictional fixtures; never import the CRM contact directory here.
const attendees = new Map([
  ["daniela@example.org", "Daniela"],
  ["camila@example.org", "Camila"],
]);

export function mockArrival(email: string, registered: Set<string>): { state: CheckinState; name: string } {
  const key = email.trim().toLowerCase();
  const name = attendees.get(key);
  if (!name) return { state: "no-encontrado", name: "" };
  if (registered.has(key)) return { state: "registrado", name };
  registered.add(key);
  return { state: "bienvenida", name };
}

export const checkinPath = (codigo: string) => `/checkin/${encodeURIComponent(codigo)}`;