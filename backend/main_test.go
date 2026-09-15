package main

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestSPAFallbackCache(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "index.html"), []byte("<!doctype html>"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.Mkdir(filepath.Join(dir, "assets"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "assets", "index-abc123.js"), []byte("0"), 0o644); err != nil {
		t.Fatal(err)
	}
	h := spaFallback(dir, http.FileServer(http.Dir(dir)))

	cases := []struct {
		path  string
		code  int
		cache string
	}{
		{"/", http.StatusOK, "no-cache"},
		{"/sobre", http.StatusOK, "no-cache"},
		{"/assets/index-abc123.js", http.StatusOK, ""},
		{"/images/nao-existe.png", http.StatusNotFound, ""},
	}
	for _, c := range cases {
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, c.path, nil))
		if rec.Code != c.code {
			t.Errorf("%s: status %d, esperava %d", c.path, rec.Code, c.code)
		}
		if got := rec.Header().Get("Cache-Control"); got != c.cache {
			t.Errorf("%s: Cache-Control %q, esperava %q", c.path, got, c.cache)
		}
	}
}
