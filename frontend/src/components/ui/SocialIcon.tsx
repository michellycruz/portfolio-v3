/**
 * Ícones de marca desenhados aqui porque o lucide-react v1 deixou de trazê-los.
 * São traços em currentColor, no mesmo peso dos ícones do menu, para o tema
 * claro e o escuro pintarem sozinhos.
 */
const paths: Record<string, React.ReactNode> = {
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 10v7M7 7v.01M12 17v-4a2.5 2.5 0 0 1 5 0v4" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.4-4-2.2-6-2.8m12 5v-3.4c0-1 .1-1.4-.5-2 2.6-.3 5-1.3 5-5.7a4.4 4.4 0 0 0-1.2-3.1 4 4 0 0 0-.1-3.1s-1-.3-3.3 1.2a11 11 0 0 0-6 0C6.6 3.6 5.6 3.9 5.6 3.9a4 4 0 0 0-.1 3.1A4.4 4.4 0 0 0 4.3 10c0 4.4 2.4 5.4 5 5.7-.6.6-.6 1.2-.5 2V21" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.7-4.4A8.5 8.5 0 1 1 8 20.2L3 21Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" />
    </>
  ),
};

interface SocialIconProps {
  name: string;
  className?: string;
}

export function SocialIcon({ name, className = "h-5 w-5" }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name] ?? paths.github}
    </svg>
  );
}
