# Character Collection Grid + Dropdown Plan

## Approved Plan
- Hide ALL details (grouped sections + raw data) behind **one dropdown** starting **closed**.
- Summary text: "View character details".
- Keep preview/actions/name/meta **always visible**.
- Maintain existing responsive grid layout.

## Steps
- [x] 1. Update characters.js: Wrap details + raw data in `<details>` (no `open`), `<summary>View character details</summary>`, then details + raw.
- [x] 2. Update styles.css: Style `.character-details details`, `summary` (button-like, match theme), smooth height transition.
- [ ] 3. Test: Refresh /characters.html, verify collapsed by default, toggle works, grid intact.
- [ ] 4. attempt_completion

Current: Done ✅
