import {
  Briefcase,
  GraduationCap,
  LayoutGrid,
  Mail,
  SlidersHorizontal,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

/** Ordem das seções: alimenta o menu lateral, o rastro do topo e o observador
 *  que marca a seção ativa. Uma lista só, para os três não saírem de sincronia. */
export const navItems: NavItem[] = [
  { id: "sobre", label: "Sobre", icon: User },
  { id: "experiencia", label: "Experiência", icon: Briefcase },
  { id: "formacao", label: "Formação", icon: GraduationCap },
  { id: "habilidades", label: "Habilidades", icon: SlidersHorizontal },
  { id: "projetos", label: "Projetos", icon: LayoutGrid },
  { id: "contato", label: "Contato", icon: Mail },
];
