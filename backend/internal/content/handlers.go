package content

import (
	"encoding/json"
	"net/http"
)

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

// HandleAll serves the full aggregated content payload.
func HandleAll(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, Get())
}

// HandleProfile serves just the profile section.
func HandleProfile(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, Get().Profile)
}

// HandleExperience serves the experience timeline.
func HandleExperience(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, Get().Experience)
}

// HandleEducation serves the academic timeline + courses/certifications together.
func HandleEducation(w http.ResponseWriter, r *http.Request) {
	c := Get()
	writeJSON(w, http.StatusOK, map[string]any{
		"education":    c.Education,
		"institutions": c.Institutions,
	})
}

// HandleSkills serves infra skills + tech skill categories together.
func HandleSkills(w http.ResponseWriter, r *http.Request) {
	c := Get()
	writeJSON(w, http.StatusOK, map[string]any{
		"infraSkills": c.InfraSkills,
		"categories":  c.SkillCategories,
	})
}

// HandleProjects serves the project list.
func HandleProjects(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, Get().Projects)
}
