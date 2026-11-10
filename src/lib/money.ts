/** Valores financeiros são representados em centavos inteiros. */
export function parseMoney(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(/^R\$/i, "");
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.replace(/\./g, "").split(",");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) && cents > 0 && cents <= 2147483647 ? cents : null;
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export function variation(current: number, previous: number) {
  return { difference: current - previous, percent: previous === 0 ? null : ((current - previous) / Math.abs(previous)) * 100 };
}

export function monthBounds(month: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error("Mês inválido");
  const [year, index] = month.split("-").map(Number);
  const next = index === 12 ? `${year + 1}-01` : `${year}-${String(index + 1).padStart(2, "0")}`;
  return { start: `${month}-01`, end: `${next}-01` };
}
