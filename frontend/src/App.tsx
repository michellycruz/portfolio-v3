import { ThemeProvider } from "./context/ThemeContext";
import { usePortfolioContent } from "./hooks/usePortfolioContent";
import { CURRENT_SITE_LABEL, CURRENT_SITE_URL } from "./lib/site";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { BackToTop } from "./components/layout/BackToTop";
import { Hero } from "./components/sections/Hero";
import { Experience } from "./components/sections/Experience";
import { Education } from "./components/sections/Education";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Contact } from "./components/sections/Contact";

function PortfolioApp() {
  const { content } = usePortfolioContent();

  return (
    <div className="min-h-screen">
      {/* Esta versão ficou no ar como arquivo. A tarja aqui era o erro de API
          ("não foi possível conectar"), que sem backend aparecia em toda visita e
          não dizia nada de útil a quem chegava; no lugar dela, o caminho para a
          versão atual. */}
      <div className="bg-coral px-4 py-2 text-center text-xs font-medium text-white">
        Esta é a versão anterior do portfólio.{" "}
        <a
          href={CURRENT_SITE_URL}
          className="font-bold underline decoration-2 underline-offset-2"
        >
          Ver a versão atual em {CURRENT_SITE_LABEL}
        </a>
      </div>

      <Navbar />

      <main>
        <Hero profile={content.profile} />
        <Experience items={content.experience} />
        <Education items={content.education} institutions={content.institutions} />
        <Skills
          infraSkills={content.infraSkills}
          infraHighlights={content.infraHighlights}
          categories={content.skillCategories}
        />
        <Projects items={content.projects} />
        <Contact />
      </main>

      <Footer social={content.profile.social} name={content.profile.name} />
      <BackToTop />
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
