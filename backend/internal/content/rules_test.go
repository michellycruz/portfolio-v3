package content

import (
	"encoding/json"
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

// A finished education period ends in a month and year: "Julho 2021 - Julho
// 2023". Anything else after the dash ("Em andamento", "Matriculada",
// "Trancado em maio de 2025") is a program not finished.
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

func hoursOf(value string) int {
	n, _ := strconv.Atoi(strings.TrimSuffix(value, "h"))
	return n
}

type periodState int

const (
	periodOpen     periodState = iota // not finished: in progress, enrolled, locked
	periodFinished                    // ended in a month that has already come
	periodInvalid                     // in the finished format, but with dates that make no sense
)

// educationPeriod says whether a program is finished and, when the period is
// wrong, why. A planned end date is not a finished program: until the
// certificate exists, the card says so in words.
func educationPeriod(period string, now int) (periodState, string) {
	m := finishedPeriodRe.FindStringSubmatch(period)
	if m == nil {
		return periodOpen, ""
	}
	start, okStart := monthIndex(m[1], m[2])
	end, okEnd := monthIndex(m[3], m[4])
	switch {
	case !okStart || !okEnd:
		return periodInvalid, fmt.Sprintf("período %q com mês inválido", period)
	case start > end:
		return periodInvalid, fmt.Sprintf("período %q termina antes de começar", period)
	case end > now:
		return periodOpen, fmt.Sprintf(`período %q termina no futuro; até terminar, escreva "Mês AAAA - Em andamento"`, period)
	}
	return periodFinished, ""
}

func sortedKeys(set map[string]bool) string {
	keys := make([]string, 0, len(set))
	for k := range set {
		keys = append(keys, fmt.Sprintf("%q", k))
	}
	sort.Strings(keys)
	return strings.Join(keys, ", ")
}

// changed returns the real file with one change made through its structure, so
// that parse gets past everything else and fails for the reason under test,
// whatever the content is at the time.
func changed(t *testing.T, change func(doc map[string]any)) string {
	t.Helper()
	var doc map[string]any
	if err := json.Unmarshal(portfolioJSON, &doc); err != nil {
		t.Fatal(err)
	}
	change(doc)
	out, err := json.Marshal(doc)
	if err != nil {
		t.Fatal(err)
	}
	return string(out)
}

func TestParseIsStrict(t *testing.T) {
	withPlanned := changed(t, func(doc map[string]any) {
		for _, inst := range doc["institutions"].([]any) {
			if tracks, ok := inst.(map[string]any)["tracks"].([]any); ok {
				tracks[0].(map[string]any)["planned"] = true
				return
			}
		}
		t.Fatal("nenhuma trilha no arquivo para o teste")
	})
	withCaseSwapped := changed(t, func(doc map[string]any) {
		profile := doc["profile"].(map[string]any)
		profile["NAME"] = profile["name"]
		delete(profile, "name")
	})

	for _, tc := range []struct {
		name, doc, want string
	}{
		{"campo desconhecido", `{"education":[{"course":"x","hourz":"10h"}]}`, "unknown field"},
		{"carga como número", `{"education":[{"course":"x","hours":10}]}`, "cannot unmarshal number"},
		{"dado depois do objeto", `{} {}`, "unexpected data"},
		{"planned no arquivo", withPlanned, `"planned"`},
		{"chave com caixa trocada", withCaseSwapped, "differs from what the API serves"},
	} {
		_, err := parse([]byte(tc.doc))
		if err == nil || !strings.Contains(err.Error(), tc.want) {
			t.Errorf("%s: esperava um erro com %q, veio %v", tc.name, tc.want, err)
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
		// And the other way round: a done course has a certificate, so it
		// carries at least one of the two. Otherwise flipping the status alone
		// would put it in the totals.
		if course.Status == CourseDone && course.Date == "" && course.Hours == "" {
			t.Errorf("%s: curso concluído sem data nem carga; preencha o que o certificado traz", lc.where)
		}
	}
}

func TestTrackStatus(t *testing.T) {
	c := load(t)
	now := thisMonth()
	cards := map[string]Education{}
	for _, e := range c.Education {
		cards[e.Course] = e
	}

	for _, inst := range c.Institutions {
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

			// The track and the card of the same program tell one story: the
			// grade is "Concluída" exactly when the card's period is finished.
			// Every discipline passed with the thesis or the certificate still
			// missing is not a finished program.
			if e, ok := cards[track.Name]; ok {
				state, _ := educationPeriod(e.Period, now)
				if state != periodInvalid && (track.Status == trackDone) != (state == periodFinished) {
					t.Errorf("%s: trilha %q, mas o cartão da formação diz %q", where, track.Status, e.Period)
				}
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
		state, problem := educationPeriod(e.Period, now)
		if problem != "" {
			t.Errorf("%s: %s", e.Course, problem)
		}
		if e.Hours != "" && e.PlannedHours != "" {
			t.Errorf("%s: carga e carga prevista ao mesmo tempo; fica só uma", e.Course)
			continue
		}
		switch state {
		case periodInvalid:
			// With the period wrong there is no telling which field is right.
		case periodFinished:
			if e.PlannedHours != "" {
				t.Errorf("%s: carga prevista num curso concluído (%q); troque pela carga do certificado, em hours", e.Course, e.Period)
			}
		case periodOpen:
			if e.Hours != "" {
				t.Errorf(`%s: carga %q, mas o período %q não é de curso concluído ("Mês AAAA - Mês AAAA", já terminado). `+
					"Se terminou, corrija o período; se não, a carga vai em plannedHours", e.Course, e.Hours, e.Period)
			}
		}
	}
}

// A program whose grade is listed as a track can't add up to more than the
// workload on its card: the certificate's once it is finished, the planned one
// before that. Every course not done yet will take at least an hour, so the
// done ones have to leave room for them. Once every course is done with its
// workload declared, the sum has to match the certificate exactly: the
// postgraduate in software engineering adds up to its 540h. Card and track are
// matched by name.
func TestTrackFitsCertificate(t *testing.T) {
	c := load(t)
	tracks := map[string]Track{}
	for _, inst := range c.Institutions {
		for _, track := range inst.Tracks {
			tracks[track.Name] = track
		}
	}
	for _, e := range c.Education {
		track, ok := tracks[e.Course]
		limit, which := e.Hours, "do certificado"
		if limit == "" {
			limit, which = e.PlannedHours, "prevista"
		}
		if !ok || limit == "" {
			continue
		}

		// A done course without a declared workload is neither pending nor
		// countable: its hours are unknown, so it only rules out the exact sum.
		sum, pending, unknown := 0, 0, 0
		for _, course := range track.Courses {
			switch {
			case course.Status != CourseDone:
				pending++
			case course.Hours == "":
				unknown++
			default:
				sum += hoursOf(course.Hours)
			}
		}

		total := hoursOf(limit)
		switch {
		case sum+pending > total && pending > 0:
			t.Errorf("%s: os cursos concluídos somam %dh e ainda faltam %d; não cabe na carga %s (%s)",
				e.Course, sum, pending, which, limit)
		case sum > total:
			t.Errorf("%s: os cursos concluídos somam %dh, mais que a carga %s (%s)", e.Course, sum, which, limit)
		case e.Hours != "" && pending == 0 && unknown == 0 && sum != total:
			t.Errorf("%s: os cursos da trilha somam %dh, mas a carga do certificado é %s", e.Course, sum, e.Hours)
		}
	}
}

// The frontend keys its lists by these names, so a repeated one breaks the
// rendering. A repeated course is also two public entries for one certificate.
// Names that differ only in spacing or case count as the same one.
func TestUniqueNames(t *testing.T) {
	c := load(t)
	unique := func(kind string) func(string) {
		seen := map[string]bool{}
		return func(name string) {
			key := strings.ToLower(strings.Join(strings.Fields(name), " "))
			switch {
			case key == "":
				t.Errorf("%s sem nome", kind)
			case name != strings.TrimSpace(name):
				t.Errorf("%s %q com espaço no começo ou no fim", kind, name)
			case seen[key]:
				t.Errorf("%s repetido: %q", kind, name)
			}
			seen[key] = true
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
