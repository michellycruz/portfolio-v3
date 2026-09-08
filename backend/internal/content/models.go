package content

// SocialLink represents a link to an external social/profile page.
type SocialLink struct {
	Name string `json:"name"`
	URL  string `json:"url"`
	Icon string `json:"icon"`
}

// BehaviorTrait is one axis of the behavioural profile assessment, shown as a
// bar chart in the hero. Percent is 0-100.
type BehaviorTrait struct {
	Label   string `json:"label"`
	Percent int    `json:"percent"`
}

// Profile holds the top-level personal/summary information.
type Profile struct {
	Name          string       `json:"name"`
	Role          string       `json:"role"`
	Location      string       `json:"location"`
	Summary       []string     `json:"summary"`
	ProfileBadge  string          `json:"profileBadge"`
	Behavior      []BehaviorTrait `json:"behavior"`
	PhotoURL      string       `json:"photoUrl"`
	ResumeURL     string       `json:"resumeUrl"`
	Social        []SocialLink `json:"social"`
}

// Experience describes one professional role.
type Experience struct {
	Company string   `json:"company"`
	Role    string   `json:"role"`
	Period  string   `json:"period"`
	Bullets []string `json:"bullets"`
	Results string   `json:"results,omitempty"`
}

// Education describes one academic entry. Hours is the total workload stated on
// the completion certificate, so it is only set for finished courses.
type Education struct {
	Course      string `json:"course"`
	Institution string `json:"institution"`
	Period      string `json:"period"`
	Hours       string `json:"hours,omitempty"`
}

// Course is a single completed course, backed by a certificate. Area is the
// competency group it counts towards in the formation chart — tagged per course
// because institutions mix areas, so the chart stays correct when courses are
// added without touching any aggregate.
type Course struct {
	Title string `json:"title"`
	Date  string `json:"date,omitempty"`
	Hours string `json:"hours,omitempty"`
	Area  string `json:"area"`
}

// Track is a multi-course program (a DIO "formação"). Status says whether the
// track itself is finished — its Courses are the ones already certified, so a
// track can be in progress while holding completed courses. Planned marks a
// track whose enrolment is done but whose classes have not started: it is
// listed, but never counted as study already done.
type Track struct {
	Name    string   `json:"name"`
	Status  string   `json:"status"`
	Planned bool     `json:"planned,omitempty"`
	Courses []Course `json:"courses"`
}

// Institution groups everything studied at one place. Tracks is for schools
// that bundle courses into programs; Courses holds standalone ones.
type Institution struct {
	Name    string   `json:"name"`
	Tracks  []Track  `json:"tracks,omitempty"`
	Courses []Course `json:"courses,omitempty"`
}

// InfraSkill is a support/infrastructure area: what the area is, plus the
// concrete tasks carried out in it. The tasks used to be a flat list on Content,
// which left them orphaned from the area they belong to.
type InfraSkill struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Highlights  []string `json:"highlights"`
}

// SkillCategory groups a set of tool/tech icons under a title.
type SkillCategory struct {
	Title  string   `json:"title"`
	Skills []string `json:"skills"`
}

// Project is a portfolio project card.
type Project struct {
	Title       string   `json:"title"`
	Year        string   `json:"year"`
	Description string   `json:"description"`
	Tech        []string `json:"tech"`
	ImageURL    string   `json:"imageUrl"`
	LinkURL     string   `json:"linkUrl"`
	// RepoURL fica vazio quando o repositorio e privado: a UI troca o atalho
	// para o codigo pelo selo de projeto interno.
	RepoURL string `json:"repoUrl"`
	Private bool   `json:"private"`
}

// Content aggregates the entire portfolio payload served to the frontend.
type Content struct {
	Profile        Profile         `json:"profile"`
	Experience     []Experience    `json:"experience"`
	Education      []Education     `json:"education"`
	Institutions   []Institution   `json:"institutions"`
	InfraSkills    []InfraSkill    `json:"infraSkills"`
	SkillCategories []SkillCategory `json:"skillCategories"`
	Projects       []Project       `json:"projects"`
}
