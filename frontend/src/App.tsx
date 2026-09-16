import { useCallback, useMemo, useRef, useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { usePortfolioContent } from "./hooks/usePortfolioContent";
import { useActiveSection, useMediaQuery, useScrolledPast } from "./hooks/useScrollNav";
import { navItems } from "./lib/nav";
import { Landing } from "./components/layout/Landing";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { Footer } from "./components/layout/Footer";
import { About } from "./components/sections/About";
import { Experience } from "./components/sections/Experience";
import { Education } from "./components/sections/Education";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Contact } from "./components/sections/Contact";

function PortfolioApp() {
  const { content, offline } = usePortfolioContent();

  const landingRef = useRef<HTMLElement>(null);
  const pastLanding = useScrolledPast(landingRef);
  const [menuOpen, setMenuOpen] = useState(false);
  const abrirMenu = useCallback(() => setMenuOpen(true), []);
  const fecharMenu = useCallback(() => setMenuOpen(false), []);

  // O menu tem dois gatilhos: no desktop ele acompanha a rolagem, no celular
  // é uma gaveta que a pessoa abre. O breakpoint aqui é o mesmo lg do Tailwind.
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sidebarShown = isDesktop ? pastLanding : menuOpen;

  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);
  const activeId = useActiveSection(sectionIds, pastLanding);
  const activeLabel = navItems.find((item) => item.id === activeId)?.label ?? navItems[0].label;

  // No celular o menu e uma gaveta por cima da pagina. Enquanto ela esta
  // aberta, o resto vira inert: o Tab nao escapa para os links atras do veu, e
  // o leitor de tela tambem nao le o que esta coberto.
  const gavetaAberta = menuOpen && !isDesktop;

  return (
    <div className="min-h-svh">
      {/* Primeiro tab da página: pular a capa e o menu e cair no conteúdo. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:border-2 focus:border-stroke-soft focus:bg-orange focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:tracking-[0.08em] focus:text-on-accent focus:uppercase"
      >
        Pular para o conteúdo
      </a>

      {offline && (
        <div className="bg-orange px-4 py-2 text-center font-mono text-[11px] tracking-[0.06em] text-on-accent uppercase">
          API fora do ar — exibindo o conteúdo local de reserva.
        </div>
      )}

      <Sidebar
        profile={content.profile}
        shown={sidebarShown}
        open={menuOpen}
        onClose={fecharMenu}
        activeId={activeId}
      />

      <div inert={gavetaAberta || undefined}>
        <Topbar
          visible={pastLanding}
          onOpenMenu={abrirMenu}
          crumb={activeLabel}
          resumeUrl={content.profile.resumeUrl}
        />

        <Landing ref={landingRef} profile={content.profile} />

        {/* O respiro à esquerda já fica reservado no desktop, então o menu entra
            por cima do próprio vão em vez de empurrar o texto no meio da rolagem. */}
        <main
          id="conteudo"
          tabIndex={-1}
          className="mx-auto flex max-w-[1000px] flex-col gap-16 px-5 pt-10 pb-24 sm:px-8 lg:mx-0 lg:max-w-none lg:pr-8 lg:pl-[calc(var(--spacing-sidebar)+2rem)]"
        >
          <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-16">
            <About profile={content.profile} />
            <Experience items={content.experience} />
            <Education items={content.education} institutions={content.institutions} />
            <Skills categories={content.skillCategories} infraSkills={content.infraSkills} />
            <Projects items={content.projects} />
            <Contact profile={content.profile} />
            <Footer name={content.profile.name} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}
