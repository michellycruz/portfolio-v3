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
	return c, nil
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
