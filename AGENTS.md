<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.


## testing
-before testing read api and existing code.
-unit test are without database/server integration test point which parts are true and which part are mocks
-use isolated test data dont touch production users and database.
-exucated the test and report true command,result and uncovered scenarios
<!-- END:nextjs-agent-rules -->

## Agent workflow
- za sekoja zadaca so menuva aplikaciski kod koristi posebni agenti:
- Roles: developer -> tester -> reviewer.
-Cekaj prethodniot agent da zavrshi pred sledniot.
-Testerot gi pisuva i izvrshuva testovite
-Reviewerot nezavisno go proveruva kodot i testovite
-Za prasanja i objasnuvanja ne startuvaj agenti.
-Merge i deploy gi pravi korisnikot.
