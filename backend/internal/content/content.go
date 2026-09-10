package content

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
)

// portfolio.json is the single source of the site's content. The binary embeds
// it, so a deploy still ships one self-contained file, and the frontend imports
// the same file as its fallback — there is no second copy to drift.
//
//go:embed portfolio.json
var portfolioJSON []byte

var loaded = mustParse(portfolioJSON)

// Get returns the portfolio content. The value is shared by every request, so
// callers must treat it as read-only.
func Get() Content {
	return loaded
}

// parse decodes the content strictly: an unknown field is an error, not
// something silently dropped. A misspelled key would otherwise vanish on decode
// and change what the site counts without anyone noticing.
//
// encoding/json matches keys to fields ignoring case, so a key like
// "plannedhours" would still pass DisallowUnknownFields and reach the API, while
// the frontend, which imports the raw file, never sees it. So parse also checks
// that the file says exactly what the API will serve back.
func parse(data []byte) (Content, error) {
	dec := json.NewDecoder(bytes.NewReader(data))
	dec.DisallowUnknownFields()

	var c Content
	if err := dec.Decode(&c); err != nil {
		return Content{}, fmt.Errorf("portfolio.json: %w", err)
	}
	if err := dec.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		return Content{}, errors.New("portfolio.json: unexpected data after the top-level object")
	}
	if err := sameAsServed(data, c); err != nil {
		return Content{}, err
	}

	for i := range c.Institutions {
		for j := range c.Institutions[i].Tracks {
			track := &c.Institutions[i].Tracks[j]
			if track.Planned {
				return Content{}, fmt.Errorf("portfolio.json: track %q sets \"planned\", which is derived: give each course a status instead", track.Name)
			}
			track.Planned = everyCoursePlanned(track.Courses)
		}
	}
	return c, nil
}

// sameAsServed compares the file with the content re-encoded, both in a
// canonical form (sorted keys, no whitespace). They differ when a key is
// spelled with different case, a key is repeated, an optional field is left
// empty or a required one is missing (the frontend's types require it too).
// The error quotes the spot, since the file is hundreds of lines long.
func sameAsServed(data []byte, c Content) error {
	served, err := json.Marshal(c)
	if err != nil {
		return fmt.Errorf("portfolio.json: %w", err)
	}
	file, err := canonical(data)
	if err != nil {
		return fmt.Errorf("portfolio.json: %w", err)
	}
	if served, err = canonical(served); err != nil {
		return fmt.Errorf("portfolio.json: %w", err)
	}
	if bytes.Equal(file, served) {
		return nil
	}
	i := 0
	for i < len(file) && i < len(served) && file[i] == served[i] {
		i++
	}
	return fmt.Errorf("portfolio.json: the file differs from what the API serves (key with different case, repeated key, empty optional field or missing field?) near: %s",
		file[max(0, i-80):min(len(file), i+40)])
}

func canonical(data []byte) ([]byte, error) {
	var v any
	if err := json.Unmarshal(data, &v); err != nil {
		return nil, err
	}
	return json.Marshal(v)
}

func everyCoursePlanned(courses []Course) bool {
	for _, course := range courses {
		if course.Status != CoursePlanned {
			return false
		}
	}
	return len(courses) > 0
}

// mustParse stops the binary at startup if portfolio.json is broken, before it
// serves anything. The tests parse the same file, and CI runs them before
// building, so a broken file should never reach a release.
func mustParse(data []byte) Content {
	c, err := parse(data)
	if err != nil {
		panic(err)
	}
	return c
}
