export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface BehaviorTrait {
  label: string;
  percent: number;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  summary: string[];
  profileBadge: string;
  behavior: BehaviorTrait[];
  photoUrl: string;
  resumeUrl: string;
  social: SocialLink[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  results?: string;
}

export interface Education {
  course: string;
  institution: string;
  period: string;
  /** Carga do certificado de conclusão: só em curso concluído. */
  hours?: string;
  /** Carga prometida de um curso em andamento. Sai quando o certificado chega. */
  plannedHours?: string;
}

export interface Course {
  title: string;
  /** "concluido", "cursando" ou "previsto". Só "concluido" conta como estudo feito. */
  status: string;
  date?: string;
  hours?: string;
  area: string;
}

export interface Track {
  name: string;
  status: string;
  courses: Course[];
}

export interface Institution {
  name: string;
  tracks?: Track[];
  courses?: Course[];
}

/** Uma área de atuação: o que é, mais as tarefas concretas feitas nela. As
 *  tarefas eram uma lista solta no Content, órfãs da área a que pertencem. */
export interface InfraSkill {
  title: string;
  description: string;
  highlights: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Project {
  title: string;
  year: string;
  description: string;
  tech: string[];
  imageUrl: string;
  linkUrl: string;
  /** Vazio quando o repositorio e privado. */
  repoUrl: string;
  private: boolean;
}

export interface Content {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  institutions: Institution[];
  infraSkills: InfraSkill[];
  skillCategories: SkillCategory[];
  projects: Project[];
}
