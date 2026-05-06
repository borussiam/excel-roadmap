# TODO

## Done

### 2026-05-04
- [x] [feat/site] Build the static Excel Roadmap dashboard.
- [x] [feat/data] Connect the site to a published Google Sheets CSV URL.
- [x] [feat/data] Add CSV loading, parsing, error handling, and load status display.
- [x] [refactor/data] Normalize topic data for number, category, difficulty, status, title, and search.
- [x] [feat/stats] Add summary cards for total, done, in progress, and not started counts.
- [x] [feat/stats] Add overall completion rate and progress bar.
- [x] [feat/sort] Add sorting by number, difficulty, category, status, and recent learning date.
- [x] [feat/search] Add topic search.
- [x] [feat/filter] Add category filter.
- [x] [feat/filter] Add reset button for search and filters.
- [x] [feat/link] Add conversation link display.
- [x] [feat/link] Add disabled link state for topics without conversation links.
- [x] [feat/badge] Add difficulty badge images using `img/1.svg` through `img/30.svg`.

### 2026-05-05
- [x] [feat/view] Add list view and set list view as the default view.
- [x] [style/list] Make list view compact like an Excel table or file explorer.
- [x] [feat/filter] Sort category options by `대분류번호`.
- [x] [feat/filter] Use `대분류표시` for display and raw category value for filtering.
- [x] [feat/filter] Add start/end difficulty range filters.
- [x] [fix/filter] Fix initial difficulty range to start from the lowest level and end at the highest level.
- [x] [fix/filter] Add difficulty range correction when the start level exceeds the end level.
- [x] [feat/list] Show `한줄설명` as browser hover text in list view.
- [x] [ci] Add GitHub Actions validation: Check JavaScript, HTML, and CSS syntax on push.

### 2026-05-06
- [x] [feat/filter] Add multiple status checkboxes.
- [x] [feat/filter] Add status presets: `전체`, `미완료만`, `완료만`, `진행중`.
- [x] [fix/filter] Show no topics when no status checkbox is selected.

---

## Current Cleanup

- [ ] [High] [refactor/css] Clean up duplicated list-view CSS in `style.css`.
- [ ] [High] [refactor/css] Remove unused or outdated CSS rules.
- [ ] [High] [refactor/css] Keep only one final version of each major list-view selector.

---

## Next Work

- [ ] [High] [feat/search] Add `한줄설명` to the search target.
  - Current search does not include one-line descriptions.

- [ ] [Medium] [feat/ui] Improve one-line description display.
  - Current version uses a simple browser tooltip.
  - A click-based detail panel may work better on mobile.

- [ ] [Medium] [feat/detail] Add a read-only topic detail panel.
  - Show number, difficulty, title, category, one-line description, status, learning date, link, memo, and next review date.

- [ ] [Medium] [feat/filter] Add conversation link filter.
  - Options: All, Has Link, No Link.

- [ ] [Medium] [feat/filter] Change category filter to multi-select.
  - Keep category order based on `대분류번호`.

- [ ] [Medium] [feat/ui] Move detailed filters into a collapsible filter panel.
  - Keep the top toolbar simpler.

- [ ] [Low] [feat/view] Save selected view mode with `localStorage`.
  - If card view is selected, keep card view on the next visit.

- [ ] [Low] [feat/sort] Add more sorting options.
  - Examples: not done first, link exists first, category + difficulty, category + number.

- [ ] [Low] [feat/stats] Add category progress summary.
  - Example: `7: Data Validation 10 / 17 done`.

- [ ] [Low] [style/list] Make completed topics visually distinct.
  - Use a subtle background, not strikethrough.

- [ ] [Low] [feat/search] Highlight matching search words.
  - HTML escaping must remain safe.

---

## Later Work

- [ ] [Later] [feat/sheets] Add Google Sheets write-back feature.
  - Edit status, learning date, conversation link, memo, and next review date from the site.

- [ ] [Later] [feat/api] Add Apps Script Web App.
  - Use it as a bridge between GitHub Pages and Google Sheets.

- [ ] [Later] [feat/auth] Consider simple save-password protection.
  - Do not store secret keys directly in frontend JavaScript.