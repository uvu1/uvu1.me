import { projects } from "../generated/projects";

export type { Project, ProjectStatus } from "../generated/projects";

export function getAllProjects() {
  return projects;
}

export function getFeaturedProject() {
  return projects.find((project) => project.featured);
}

export function getProjectsByCategory(category: string) {
  return projects.filter((project) => project.category === category);
}

export function getProjectCategories() {
  return [...new Set(projects.map((project) => project.category))].sort();
}
