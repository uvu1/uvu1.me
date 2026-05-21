import { describe, expect, test } from "vitest";
import { formatDate } from "../../src/lib/date";

describe("formatDate", () => {
  test("YYYY-MM-DDをYYYY/MM/DDに変換する", () => {
    expect(formatDate("2026-05-21")).toBe("2026/05/21");
  });

  test("undefinedなら空文字を返す", () => {
    expect(formatDate(undefined)).toBe("");
  });

  test("空文字なら空文字を返す", () => {
    expect(formatDate("")).toBe("");
  });
});
