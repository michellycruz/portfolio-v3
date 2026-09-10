// Com a extensão: este arquivo também roda direto no Node, no npm run totais.
import type { Course, Institution, Track } from "../types/content.ts";

/** Junta os cursos de uma instituição, venham eles soltos ou dentro de trilhas. */
export function coursesOf(institution: Institution): Course[] {
  return [
    ...(institution.tracks?.flatMap((track) => track.courses) ?? []),
    ...(institution.courses ?? []),
  ];
}

export function allCourses(institutions: Institution[]): Course[] {
  return institutions.flatMap(coursesOf);
}

/**
 * Só "concluido" conta como estudo feito. Um curso "cursando", ou "previsto" na
 * grade de uma pós em que a matrícula está feita, aparece na lista para mostrar
 * o que está em curso e o que vem pela frente, mas fica fora de tudo que mede
 * estudo já feito. Qualquer outro valor também fica fora: na dúvida, o total
 * conta de menos, nunca de mais.
 */
export function isDone(course: Course): boolean {
  return course.status === "concluido";
}

/** Trilha em que nenhuma matéria começou: a grade de um curso só matriculado. */
export function isPlannedTrack(track: Track): boolean {
  return track.courses.length > 0 && track.courses.every((course) => course.status === "previsto");
}

function studiedCourses(institutions: Institution[]): Course[] {
  return allCourses(institutions).filter(isDone);
}

export interface StudyTotals {
  courses: number;
  hours: number;
  /** Cursos sem carga horária declarada — ficam de fora da soma de horas. */
  missingHours: number;
}

export function studyTotals(institutions: Institution[]): StudyTotals {
  const courses = studiedCourses(institutions);

  // "30h" -> 30. Um curso sem carga declarada continua contando como curso, mas
  // não entra nas horas: assim o total nunca reivindica mais estudo do que os
  // certificados sustentam.
  const hours = courses.reduce((sum, course) => sum + (Number.parseInt(course.hours ?? "", 10) || 0), 0);

  return {
    courses: courses.length,
    hours,
    missingHours: courses.filter((course) => !course.hours).length,
  };
}

export function coursesByArea(institutions: Institution[]): { area: string; count: number }[] {
  const totals = new Map<string, number>();
  for (const course of studiedCourses(institutions)) {
    totals.set(course.area, (totals.get(course.area) ?? 0) + 1);
  }

  return [...totals]
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * O que contar no cabeçalho de uma instituição: cursos já feitos, matérias em
 * curso e matérias apenas previstas são coisas diferentes e não somam no mesmo
 * número.
 */
export function courseCounts(institution: Institution): { studied: number; inProgress: number; planned: number } {
  const courses = coursesOf(institution);

  return {
    studied: courses.filter(isDone).length,
    inProgress: courses.filter((course) => course.status === "cursando").length,
    planned: courses.filter((course) => course.status === "previsto").length,
  };
}
