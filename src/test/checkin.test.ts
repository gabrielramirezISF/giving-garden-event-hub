import { describe, expect, it } from "vitest";
import { firstName, mockArrival, parseCheckinState, checkinStates, checkinPath } from "@/lib/checkin";
import { getEvento } from "@/lib/data";

describe("Check-in mockup rules", () => {
  it("uses November 11, 2026 for the annual event", () => { expect(getEvento("anual-2026")?.fecha).toBe("2026-11-11"); });
  it("starts at 18:00", () => { expect(getEvento("anual-2026")?.horaInicio).toBe("18:00"); });
  it("ends at 20:30", () => { expect(getEvento("anual-2026")?.horaFin).toBe("20:30"); });
  it("takes place at Colegio de Ingenieros", () => { expect(getEvento("anual-2026")?.lugar).toBe("Colegio de Ingenieros"); });
  it("has capacity 150", () => { expect(getEvento("anual-2026")?.cupo).toBe(150); });
  it("retains only the first name", () => { expect(firstName("  Daniela  Ramírez Soto ")).toBe("Daniela"); });
  it("requires a nonempty name for new arrivals", () => { expect(firstName("   ")).toBe(""); });
  it("returns only first name and state, without private details", () => {
    expect(mockArrival("daniela@example.org", new Set())).toEqual({ name: "Daniela", state: "bienvenida" });
  });
  it("recognizes duplicate arrivals", () => {
    const registered = new Set<string>();
    mockArrival("daniela@example.org", registered);
    expect(mockArrival(" DANIELA@example.org ", registered)).toEqual({ name: "Daniela", state: "registrado" });
  });
  it("offers registration for unknown emails without revealing records", () => {
    expect(mockArrival("unknown@example.org", new Set())).toEqual({ name: "", state: "no-encontrado" });
  });
  it("supports all six requested states", () => {
    expect(checkinStates).toEqual(["inicio", "bienvenida", "registrado", "no-encontrado", "cerrado", "error"]);
    expect(parseCheckinState("invalid")).toBe("inicio");
  });
  it("links the QR to the public arrival path", () => { expect(checkinPath("anual-2026")).toBe("/checkin/anual-2026"); });
});