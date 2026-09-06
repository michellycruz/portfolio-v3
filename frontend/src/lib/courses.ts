import type { Course, Institution } from "../types/content";

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

export interface StudyTotals {
  courses: number;
  hours: number;
  /** Cursos sem carga horária declarada — ficam de fora da soma de horas. */
  missingHours: number;
}

export function studyTotals(institutions: Institution[]): StudyTotals {
  const courses = allCourses(institutions);

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
  for (const course of allCourses(institutions)) {
    totals.set(course.area, (totals.get(course.area) ?? 0) + 1);
  }

  return [...totals]
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count);
}
