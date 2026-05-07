# TODO

## Work In Progress

- [High] [feat/filter] Prototype two-point difficulty range slider.
  - Keep the existing start/end difficulty selects.
  - Add two range inputs as visual controls.
  - Synchronize range inputs and selects in both directions.
  - Keep filtering based on `난이도순서값`.
  - Improve layout after search/filter separation.

## Cleanup

- [High] [refactor/css] Clean up duplicated list-view CSS in `style.css`.
- [High] [refactor/css] Remove unused or outdated CSS rules.
- [High] [refactor/css] Keep only one final version of each major list-view selector.

---

## Next Work

- [High] [feat/ui] Separate search bar and detailed filters.
  - Keep the top area focused on quick actions.
    - Search input, Filter toggle button, Sort select, Reset button, etc.

- [High] [feat/filter] Move detailed filters into a collapsible filter panel.

- [High] [style/filter] Rework filter layout after panel separation.
  - Do not solve the current cramped layout by patching many small CSS rules.
  - First separate the structure, then adjust spacing.
  - Make the difficulty slider readable on desktop.
  - Make filters stack naturally on smaller screens.

- [Medium] [feat/filter] Add difficulty scale markers to the range slider.
  - Show Bronze-Ruby level positions visually.
  - Add tick marks and badge images.

- [High] [feat/search] Add `한줄설명` to the search target.
  - Include one-line descriptions in the search string.

- [Medium] [feat/filter] Replace difficulty range selects with a two-point slider.
  - Show the difficulty scale from Bronze V to Ruby I using badge images.

- [Medium] [feat/detail] Add a read-only topic detail panel.
  - Show number, difficulty, title, category, description, status, learning date, link, memo, and next review date.

- [Medium] [feat/filter] Add conversation link filter.
  - Options: All, Has Link, No Link.

- [Medium] [feat/filter] Change category filter to multi-select.
  - Keep category order based on `대분류번호`.

- [Medium] [feat/ui] Move detailed filters into a collapsible filter panel.
  - Keep the top toolbar simpler.

- [Low] [feat/view] Save selected view mode with `localStorage`.
  - Keep the selected view mode on the next visit.

- [Low] [feat/sort] Add more sorting options.
  - Examples: not done first, link exists first, category + difficulty, category + number.

- [Low] [feat/stats] Add category progress summary.
  - Example: `7: 데이터 유효성 검사 10 / 17 완료`.

- [Low] [style/list] Make completed topics visually distinct.
  - Use a subtle background, not strikethrough.

- [Low] [feat/search] Highlight matching search words.
  - HTML escaping must remain safe.

---

## Later Work

- [Later] [feat/sheets] Add Google Sheets write-back feature.
  - Edit status, learning date, conversation link, memo, and next review date from the site.

- [Later] [feat/api] Add Apps Script Web App.
  - Use it as a bridge between GitHub Pages and Google Sheets.

- [Later] [feat/auth] Consider simple save-password protection.
  - Do not store secret keys directly in frontend JavaScript.

---

## Done

### 2026-05-04

- [feat/site] Build the static Excel Roadmap dashboard.
- [feat/data] Connect the site to a published Google Sheets CSV URL.
- [feat/data] Add CSV loading, parsing, error handling, and load status display.
- [refactor/data] Normalize topic data for number, category, difficulty, status, title, and search.
- [feat/stats] Add summary cards for total, done, in progress, and not started counts.
- [feat/stats] Add overall completion rate and progress bar.
- [feat/sort] Add sorting by number, difficulty, category, status, and recent learning date.
- [feat/search] Add topic search.
- [feat/filter] Add category filter.
- [feat/filter] Add reset button for search and filters.
- [feat/link] Add conversation link display.
- [feat/link] Add disabled link state for topics without conversation links.
- [feat/badge] Add difficulty badge images using `img/1.svg` through `img/30.svg`.

### 2026-05-05

- [feat/view] Add list view and set list view as the default view.
- [style/list] Make list view compact like an Excel table or file explorer.
- [feat/filter] Sort category options by `대분류번호`.
- [feat/filter] Use `대분류표시` for display and raw category value for filtering.
- [feat/filter] Add start/end difficulty range filters.
- [fix/filter] Fix initial difficulty range to start from the lowest level and end at the highest level.
- [fix/filter] Add difficulty range correction when the start level exceeds the end level.
- [ci] Add GitHub Actions validation for JavaScript, HTML, and CSS syntax.

### 2026-05-06

- [feat/filter] Add multiple status checkboxes.
- [feat/filter] Add status presets: `전체`, `미완료만`, `완료만`, `진행중`.
- [fix/filter] Show no topics when no status checkbox is selected.