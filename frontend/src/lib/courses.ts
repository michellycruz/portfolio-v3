import type { Course, Institution, Track } from "../types/content";

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
 * Só o que já foi estudado. Uma trilha `planned` é a grade de um curso em que
 * a matrícula está feita mas nenhuma aula começou: ela aparece na lista, para
 * mostrar o que vem pela frente, e fica fora de tudo que conta estudo feito.
 */
function studiedCourses(institutions: Institution[]): Course[] {
  const fromTracks = (tracks: Track[] | undefined) =>
    tracks?.filter((track) => !track.planned).flatMap((track) => track.courses) ?? [];

  return institutions.flatMap((institution) => [
    ...fromTracks(institution.tracks),
    ...(institution.courses ?? []),
  ]);
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
 * O que contar no cabeçalho de uma instituição: cursos já feitos e matérias
 * apenas previstas são coisas diferentes e não somam no mesmo número.
 */
export function courseCounts(institution: Institution): { studied: number; planned: number } {
  const planned = institution.tracks?.filter((track) => track.planned) ?? [];

  return {
    studied: coursesOf(institution).length - planned.reduce((sum, track) => sum + track.courses.length, 0),
    planned: planned.reduce((sum, track) => sum + track.courses.length, 0),
  };
}
