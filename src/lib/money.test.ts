import { strict as assert } from "node:assert";
import { test } from "node:test";
import { parseMoney, variation, monthBounds } from "./money";

test("valores brasileiros são convertidos em centavos sem aceitar valores inválidos", () => {
  assert.equal(parseMoney("1.234,56"), 123456);
  assert.equal(parseMoney("0"), null);
  assert.equal(parseMoney("-1,00"), null);
  assert.equal(parseMoney("1,999"), null);
});
test("comparações e limites de mês lidam com casos extremos", () => {
  assert.deepEqual(variation(100, 0), { difference: 100, percent: null });
  assert.equal(variation(150, 100).percent, 50);
  assert.deepEqual(monthBounds("2026-12"), { start: "2026-12-01", end: "2027-01-01" });
  assert.throws(() => monthBounds("2026-13"));
});
