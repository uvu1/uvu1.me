import { describe, expect, test } from "vitest";
import {
  ProjectFrontmatterSchema,
  ProjectStatusSchema,
} from "../../scripts/lib/project-schema";

describe("ProjectStatusSchema", () => {
  test("valid statusを通す", () => {
    expect(ProjectStatusSchema.parse("running")).toBe("running");
    expect(ProjectStatusSchema.parse("planning")).toBe("planning");
    expect(ProjectStatusSchema.parse("archived")).toBe("archived");
  });

  test("invalid statusは落ちる", () => {
    const result = ProjectStatusSchema.safeParse("building");

    expect(result.success).toBe(false);
  });
});

describe("ProjectFrontmatterSchema", () => {
  test("valid frontmatterを通す", () => {
    const parsed = ProjectFrontmatterSchema.parse({
      title: "uvu1.me",
      description: "個人サイトです。",
      category: "web",
      status: "running",
      date: "2026-05-21",
      stack: ["TanStack", "TypeScript"],
      repo: "https://github.com/uvu1/uvu1.me-v2",
      link: "https://uvu1.me",
      featured: true,
    });

    expect(parsed).toEqual({
      title: "uvu1.me",
      description: "個人サイトです。",
      category: "web",
      status: "running",
      date: "2026-05-21",
      stack: ["TanStack", "TypeScript"],
      repo: "https://github.com/uvu1/uvu1.me-v2",
      link: "https://uvu1.me",
      featured: true,
    });
  });

  test("optional fieldsにdefaultが入る", () => {
    const parsed = ProjectFrontmatterSchema.parse({
      title: "Tool",
      date: "2026-05-21",
    });

    expect(parsed).toEqual({
      title: "Tool",
      description: "",
      category: "other",
      status: "running",
      date: "2026-05-21",
      stack: [],
      featured: false,
    });
  });

  test("titleが空文字なら落ちる", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      title: "",
      date: "2026-05-21",
    });

    expect(result.success).toBe(false);
  });

  test("dateがYYYY-MM-DDでなければ落ちる", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      title: "Tool",
      date: "2026/05/21",
    });

    expect(result.success).toBe(false);
  });

  test("stackが配列でなければ落ちる", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      title: "Tool",
      date: "2026-05-21",
      stack: "TanStack",
    });

    expect(result.success).toBe(false);
  });

  test("stackに空文字が含まれていたら落ちる", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      title: "Tool",
      date: "2026-05-21",
      stack: ["TanStack", ""],
    });

    expect(result.success).toBe(false);
  });

  test("repoがURLでなければ落ちる", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      title: "Tool",
      date: "2026-05-21",
      repo: "not-url",
    });

    expect(result.success).toBe(false);
  });

  test("linkがURLでなければ落ちる", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      title: "Tool",
      date: "2026-05-21",
      link: "not-url",
    });

    expect(result.success).toBe(false);
  });

  test("featuredがbooleanでなければ落ちる", () => {
    const result = ProjectFrontmatterSchema.safeParse({
      title: "Tool",
      date: "2026-05-21",
      featured: "true",
    });

    expect(result.success).toBe(false);
  });

test("invalid statusなら落ちる", () => {
  const result = ProjectFrontmatterSchema.safeParse({
    title: "Tool",
    date: "2026-05-21",
    status: "building",
  });

  expect(result.success).toBe(false);
})});
