package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"portfolio/backend/internal/contact"
	"portfolio/backend/internal/content"
	"portfolio/backend/internal/envfile"
	"portfolio/backend/internal/middleware"
)

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	if err := envfile.Load(".env"); err != nil {
		log.Printf("warning: could not read .env: %v", err)
	}

	port := getenv("PORT", "8080")
	origin := getenv("FRONTEND_ORIGIN", "http://localhost:5173")
	staticDir := os.Getenv("STATIC_DIR") // set to the built frontend/dist for single-binary deploys

	mailCfg := contact.LoadConfig()
	checkMailConfig(mailCfg, staticDir)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/content", content.HandleAll)
	mux.HandleFunc("GET /api/profile", content.HandleProfile)
	mux.HandleFunc("GET /api/experience", content.HandleExperience)
	mux.HandleFunc("GET /api/education", content.HandleEducation)
	mux.HandleFunc("GET /api/skills", content.HandleSkills)
	mux.HandleFunc("GET /api/projects", content.HandleProjects)
	mux.HandleFunc("POST /api/contact", contact.Handler(mailCfg))
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	if staticDir != "" {
		fs := http.FileServer(http.Dir(staticDir))
		mux.Handle("/", spaFallback(staticDir, fs))
		log.Printf("serving static frontend from %s", staticDir)
	}

	handler := middleware.CORS(origin)(mux)

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("portfolio backend listening on :%s (allowed origin: %s)", port, origin)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

// checkMailConfig refuses to start a deployment whose SMTP settings are
// incomplete. Without this the contact form is silently broken in the worst
// way: Send falls back to logging and still reports success, so visitors get a
// "message sent" confirmation while the message only ever reaches the log.
//
// A deployment is anything serving the built frontend (STATIC_DIR) or marked
// APP_ENV=production — inferring it from STATIC_DIR means a real deploy is
// covered even if nobody remembers to set APP_ENV. Local runs keep the
// log-only fallback so `go run .` works with no email account, and
// ALLOW_UNCONFIGURED_SMTP=true opts a deployment out on purpose.
func checkMailConfig(cfg contact.Config, staticDir string) {
	missing := cfg.Missing()
	if len(missing) == 0 {
		return
	}

	deployment := staticDir != "" || os.Getenv("APP_ENV") == "production"
	if deployment && os.Getenv("ALLOW_UNCONFIGURED_SMTP") != "true" {
		log.Fatalf("refusing to start: %s not set, so the contact form would confirm messages it never sends. "+
			"Set them, or start with ALLOW_UNCONFIGURED_SMTP=true to accept log-only mode.",
			strings.Join(missing, ", "))
	}

	log.Printf("warning: %s not set - contact messages will be logged, not emailed", strings.Join(missing, ", "))
}

// spaFallback serves static files when they exist and falls back to
// index.html otherwise, so client-side routing works on refresh/deep links.
//
// Um caminho com extensao nao entra nessa regra: ele pede um arquivo, e
// arquivo que nao existe responde 404. Devolver o index.html com 200 para
// /images/foo.png fez o Cloudflare guardar a pagina inteira debaixo da URL da
// imagem, com quatro horas de validade -- a imagem certa chegou depois e nao
// teve como aparecer. Alem disso, 200 em asset errado esconde o erro: o
// caminho quebrado parece funcionar ate alguem repara que veio HTML.
//
// O index.html vai com Cache-Control: no-cache. Sem cabecalho nenhum, o
// navegador calcula sozinho por quanto tempo reaproveitar a pagina a partir do
// Last-Modified, e depois de um deploy continuava abrindo o HTML antigo -- que
// aponta para o bundle antigo -- por horas. Com no-cache ele confere a cada
// visita; como o ServeFile responde 304 quando nada mudou, conferir custa pouco.
// Os arquivos de /assets tem hash no nome e ficam fora dessa regra.
func spaFallback(dir string, fileServer http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if info, err := os.Stat(dir + r.URL.Path); err == nil && !info.IsDir() {
			fileServer.ServeHTTP(w, r)
			return
		}

		if filepath.Ext(r.URL.Path) != "" {
			http.NotFound(w, r)
			return
		}

		w.Header().Set("Cache-Control", "no-cache")
		http.ServeFile(w, r, dir+"/index.html")
	})
}
