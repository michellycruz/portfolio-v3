package content

import (
	"fmt"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"testing"
	"time"
)

// These tests are the rules that keep the site's numbers honest. Every total it
// shows ("Cursos concluídos", "Horas de estudo", the chart by area) is computed
// from portfolio.json, so an entry that is merely malformed becomes a wrong
// claim. CI runs them before building, so a file that breaks a rule never
// reaches a release. Failure messages are in Portuguese, like the content they
// describe.

// knownAreas are the groups of the formation chart. The chart groups by the
// exact string, so a variant spelling ("IA e automação") would become a new
// bar and pull courses out of the highlighted one. A new area is a deliberate
// change: add it here.
var knownAreas = map[string]bool{
	"Back-end":            true,
	"Dados e Fundamentos": true,
	"Front-end":           true,
	"IA e Automação":      true,
	"Infra e DevOps":      true,
	"Processos e Design":  true,
}

var courseStatuses = map[string]bool{
	CourseDone:       true,
	CourseInProgress: true,
	CoursePlanned:    true,
}

// Track statuses. Each one says something about the track's courses, which
// TestTrackStatus holds it to.
const (
	trackDone     = "Concluída"
	trackOngoing  = "Em andamento"
	trackEnrolled = "Matriculada · aulas não iniciadas"
)

// Hours are whole hours with an "h", the way studyTotals parses them: "30h".
var hoursRe = regexp.MustCompile(`^[1-9][0-9]*h$`)

// A course date is the month on its certificate, or a range within one year:
// "Janeiro 2024", "Agosto - Setembro 2025".
var courseDateRe = regexp.MustCompile(`^(?:(\p{Lu}\p{Ll}+) - )?(\p{Lu}\p{Ll}+) ([0-9]{4})$`)

// An education period that ends in a month and year is finished ("Julho 2021 -
// Julho 2023"). Anything else after the dash ("Em andamento", "Trancado em
// maio de 2025") is not.
var finishedPeriodRe = regexp.MustCompile(`^(\p{Lu}\p{Ll}+) ([0-9]{4}) - (\p{Lu}\p{Ll}+) ([0-9]{4})$`)

var months = map[string]time.Month{
	"Janeiro": time.January, "Fevereiro": time.February, "Março": time.March,
	"Abril": time.April, "Maio": time.May, "Junho": time.June,
	"Julho": time.July, "Agosto": time.August, "Setembro": time.September,
	"Outubro": time.October, "Novembro": time.November, "Dezembro": time.December,
}

func load(t *testing.T) Content {
	t.Helper()
	c, err := parse(portfolioJSON)
	if err != nil {
		t.Fatal(err)
	}
	return c
}

type locatedCourse struct {
	where  string
	course Course
}

func everyCourse(c Content) []locatedCourse {
	var out []locatedCourse
	for _, inst := range c.Institutions {
		for _, track := range inst.Tracks {
			for _, course := range track.Courses {
				out = append(out, locatedCourse{inst.Name + " › " + track.Name + " › " + course.Title, course})
			}
		}
		for _, course := range inst.Courses {
			out = append(out, locatedCourse{inst.Name + " › " + course.Title, course})
		}
	}
	return out
}

// monthIndex turns a month name and year into a number that compares in
// calendar order. ok is false for a name that is not a month.
func monthIndex(name, year string) (index int, ok bool) {
	m, ok := months[name]
	if !ok {
		return 0, false
	}
	y, err := strconv.Atoi(year)
	if err != nil {
		return 0, false
	}
	return y*12 + int(m) - 1, true
}

func thisMonth() int {
	now := time.Now()
	return now.Year()*12 + int(now.Month()) - 1
}

func sortedKeys(set map[string]bool) string {
	keys := make([]string, 0, len(set))
	for k := range set {
		keys = append(keys, fmt.Sprintf("%q", k))
	}
	sort.Strings(keys)
	return strings.Join(keys, ", ")
}

func TestParseIsStrict(t *testing.T) {
	for name, doc := range map[string]string{
		"campo desconhecido":    `{"education":[{"course":"x","hourz":"10h"}]}`,
		"carga como número":     `{"education":[{"course":"x","hours":10}]}`,
		"dado depois do objeto": `{} {}`,
		"planned no arquivo":    `{"institutions":[{"name":"x","tracks":[{"name":"y","status":"Em andamento","planned":true}]}]}`,
	} {
		if _, err := parse([]byte(doc)); err == nil {
			t.Errorf("%s: o parse aceitou %s", name, doc)
		}
	}
}

// An empty or truncated file still parses, and would put a blank site online.
func TestContentIsNotEmpty(t *testing.T) {
	c := load(t)
	if c.Profile.Name == "" {
		t.Error("perfil sem nome")
	}
	if len(c.Experience) == 0 || len(c.Education) == 0 || len(c.Institutions) == 0 || len(c.Projects) == 0 {
		t.Errorf("seção vazia: %d experiências, %d formações, %d instituições, %d projetos",
			len(c.Experience), len(c.Education), len(c.Institutions), len(c.Projects))
	}
}

func TestHoursFormat(t *testing.T) {
	c := load(t)
	check := func(where, field, value string) {
		if value != "" && !hoursRe.MatchString(value) {
			t.Errorf(`%s: %s %q fora do formato "Nh" (ex.: "30h")`, where, field, value)
		}
	}
	for _, lc := range everyCourse(c) {
		check(lc.where, "carga", lc.course.Hours)
	}
	for _, e := range c.Education {
		check(e.Course, "carga", e.Hours)
		check(e.Course, "carga prevista", e.PlannedHours)
	}
}

func TestCourseAreas(t *testing.T) {
	for _, lc := range everyCourse(load(t)) {
		if !knownAreas[lc.course.Area] {
			t.Errorf("%s: área %q fora da lista (%s)", lc.where, lc.course.Area, sortedKeys(knownAreas))
		}
	}
}

func TestCourseStatus(t *testing.T) {
	for _, lc := range everyCourse(load(t)) {
		course := lc.course
		if !courseStatuses[course.Status] {
			t.Errorf("%s: status %q fora da lista (%s)", lc.where, course.Status, sortedKeys(courseStatuses))
			continue
		}
		// Date and hours come from the certificate, so a course without one
		// has neither. Hours left on a planned course would be one step away
		// from being counted.
		if course.Status != CourseDone && (course.Date != "" || course.Hours != "") {
			t.Errorf("%s: curso %q não tem data nem carga, que vêm do certificado", lc.where, course.Status)
		}
	}
}

func TestTrackStatus(t *testing.T) {
	for _, inst := range load(t).Institutions {
		for _, track := range inst.Tracks {
			where := inst.Name + " › " + track.Name
			if len(track.Courses) == 0 {
				t.Errorf("%s: trilha sem nenhum curso", where)
				continue
			}
			var done, planned int
			for _, course := range track.Courses {
				switch course.Status {
				case CourseDone:
					done++
				case CoursePlanned:
					planned++
				}
			}
			all := len(track.Courses)
			switch track.Status {
			case trackDone:
				if done != all {
					t.Errorf("%s: trilha %q com %d de %d cursos concluídos", where, track.Status, done, all)
				}
			case trackOngoing:
				if planned == all {
					t.Errorf("%s: trilha %q sem nenhum curso começado; o status certo é %q", where, track.Status, trackEnrolled)
				}
			case trackEnrolled:
				if planned != all {
					t.Errorf("%s: trilha %q com curso já começado", where, track.Status)
				}
			default:
				t.Errorf("%s: status %q fora da lista (%q, %q, %q)", where, track.Status, trackDone, trackOngoing, trackEnrolled)
			}
		}
	}
}

func TestCourseDates(t *testing.T) {
	now := thisMonth()
	for _, lc := range everyCourse(load(t)) {
		date := lc.course.Date
		if date == "" {
			continue
		}
		m := courseDateRe.FindStringSubmatch(date)
		if m == nil {
			t.Errorf(`%s: data %q fora do formato "Mês AAAA" ou "Mês - Mês AAAA"`, lc.where, date)
			continue
		}
		end, ok := monthIndex(m[2], m[3])
		if !ok {
			t.Errorf("%s: data %q com mês inválido", lc.where, date)
			continue
		}
		if m[1] != "" {
			start, ok := monthIndex(m[1], m[3])
			if !ok || start >= end {
				t.Errorf("%s: intervalo %q inválido", lc.where, date)
			}
		}
		if end > now {
			t.Errorf("%s: data %q no futuro; um curso só entra depois de concluído", lc.where, date)
		}
	}
}

func TestEducationPeriodAndHours(t *testing.T) {
	now := thisMonth()
	for _, e := range load(t).Education {
		m := finishedPeriodRe.FindStringSubmatch(e.Period)
		finished := m != nil
		if finished {
			start, okStart := monthIndex(m[1], m[2])
			end, okEnd := monthIndex(m[3], m[4])
			switch {
			case !okStart || !okEnd:
				t.Errorf("%s: período %q com mês inválido", e.Course, e.Period)
			case start > end:
				t.Errorf("%s: período %q termina antes de começar", e.Course, e.Period)
			case end > now:
				t.Errorf("%s: período %q termina no futuro", e.Course, e.Period)
			}
		}
		if e.Hours != "" && !finished {
			t.Errorf("%s: carga %q num curso não concluído (%q); a carga só vem com o certificado, até lá use plannedHours",
				e.Course, e.Hours, e.Period)
		}
		if e.PlannedHours != "" && finished {
			t.Errorf("%s: carga prevista num curso concluído (%q); troque pela carga do certificado, em hours", e.Course, e.Period)
		}
		if e.Hours != "" && e.PlannedHours != "" {
			t.Errorf("%s: carga e carga prevista ao mesmo tempo", e.Course)
		}
	}
}

// A finished program whose grade is listed as a track must add up to the
// workload on its certificate. The postgraduate in software engineering is the
// case today: its twelve courses sum to exactly the 540h on the card.
func TestTrackAddsUpToCertificate(t *testing.T) {
	c := load(t)
	tracks := map[string]Track{}
	for _, inst := range c.Institutions {
		for _, track := range inst.Tracks {
			tracks[track.Name] = track
		}
	}
	for _, e := range c.Education {
		track, ok := tracks[e.Course]
		if e.Hours == "" || !ok {
			continue
		}
		sum, complete := 0, true
		for _, course := range track.Courses {
			if course.Status != CourseDone || course.Hours == "" {
				complete = false
				break
			}
			n, _ := strconv.Atoi(strings.TrimSuffix(course.Hours, "h"))
			sum += n
		}
		if !complete {
			t.Logf("%s: nem todo curso da trilha declara carga, a soma não dá para conferir", e.Course)
			continue
		}
		if got := strconv.Itoa(sum) + "h"; got != e.Hours {
			t.Errorf("%s: os cursos da trilha somam %s, mas a carga do certificado é %s", e.Course, got, e.Hours)
		}
	}
}

// The frontend keys its lists by these names, so a repeated one breaks the
// rendering. A repeated course is also two public entries for one certificate.
func TestUniqueNames(t *testing.T) {
	c := load(t)
	unique := func(kind string) func(string) {
		seen := map[string]bool{}
		return func(name string) {
			switch {
			case name == "":
				t.Errorf("%s sem nome", kind)
			case seen[name]:
				t.Errorf("%s repetido: %q", kind, name)
			}
			seen[name] = true
		}
	}

	institution := unique("instituição")
	for _, inst := range c.Institutions {
		institution(inst.Name)
		track := unique("trilha em " + inst.Name)
		course := unique("curso em " + inst.Name)
		for _, tr := range inst.Tracks {
			track(tr.Name)
			for _, co := range tr.Courses {
				course(co.Title)
			}
		}
		for _, co := range inst.Courses {
			course(co.Title)
		}
	}

	education := unique("formação")
	for _, e := range c.Education {
		education(e.Course)
	}
	experience := unique("experiência")
	for _, e := range c.Experience {
		experience(e.Company + " · " + e.Period)
	}
	project := unique("projeto")
	for _, p := range c.Projects {
		project(p.Title)
	}
}
