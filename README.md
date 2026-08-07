# Lunchclub for BWK — Local MVP

This is a browser-only MVP built from the corrected functional specification. It is designed for local demos and pathway testing, not production use.

## Run locally

From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

No package install or build step is required.

## Demo accounts

Use these email addresses on the sign-up page or in Demo sign in:

- `anna.mueller@bwk-demo.de` — verified paying member (register first to create her profile)
- `lisa.test@bwk-demo.de` — approved one-time test member (register first)
- `admin@bwk-demo.de` — administrator
- Seeded matching members: `martina.hoffmann@bwk-demo.de`, `jan.becker@bwk-demo.de`, `mehmet.kaya@bwk-demo.de`, `sabine.wolff@bwk-demo.de`

There is no password in test mode.

## Included MVP pathways

- English / German interface toggle
- BWK-inspired visual design
- Static Home, How It Works, Membership, Privacy and Terms views
- Two-step mock email confirmation plus access check against a local verified list
- Paying member and one-time test-member modes
- Editable questionnaire
- Multiple goals
- Optional professional-profile URL and profile-image input
- Exact matching constraints for shared availability and group size
- Language compatibility filter
- Preference for younger/older pairing
- Background and goal scoring
- Repeated-match prevention
- Exclusion of inactive users and exhausted test users
- 2-person and 3-person matching logic
- Mock date options generated from shared availability
- Mock calendar confirmation
- Follow-up feedback simulation
- Permanent-in-demo one-use test-member record plus automatic deactivation after the first match
- Per-quarter frequency limits and a “Once, then pause” participation mode
- Admin dashboard with automatic matching, manual match creation/editing, approval/cancellation, member activation, demo access-list management, statistics and CSV export
- localStorage persistence

## Test-mode boundaries

This MVP intentionally does **not** send real email, create real calendar events, authenticate real BWK users, take payments, or write to a hosted database. Those production dependencies are documented in `INTEGRATIONS.md`.

## Data reset

Sign in as `admin@bwk-demo.de` and use **Reset demo data**. You can also clear this site’s localStorage and sessionStorage in the browser.

## Important security note

The current implementation is a static demo. Verification rules, data, admin checks and matching code run in the browser. They are visible to the user and must not be used as production security controls.
