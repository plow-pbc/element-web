# Review instructions — element-web

## Cause-first bug fixes

Fix at the cause; never with a workaround that leaves the cause in place. A guard or check at the boundary where the cause lives is a cause-level fix. If a fix adds a maintained path or net complexity, explain why removing the cause directly is insufficient. No stopgaps: they promote brittle, confusing, unreliable code. Ship the fix at the cause. Required rollout sequencing (staged removals, compatibility windows) and authorized incident containment, labeled with when it's removed, are not stopgaps. When the bug comes from a duplicated source or identity, remove the duplicate rather than bridging the two. Limits a REVIEW.md already records as accepted stay out of review unless the diff widens them.

Repo-specific reviewer policy. The universal review policy is prepended by the
reviewer and is not restated here.

## What this repo is

The web client served by Swarm and shared by its browser and native shells.
This fork is user-facing and should stay narrow enough to follow upstream.

**Sibling repos:** `plow-pbc/swarm`, `plow-pbc/swarm-ios`,
`plow-pbc/swarm-android`, and `plow-pbc/plow-swarm-tauri`.

## Review bar

- **Simple, maintainable, extensible code wins.** Push back on speculative
  abstractions, fallbacks, configuration nobody asked for, and guards for
  states the client cannot produce.
- **Brittleness costs more than compute.** Flag piles of regex and hand-rolled
  parsing that are hard to iterate on. Prefer a clear model call for semantic
  work or a maintained standard parser for structured input.
- **Kitchen and Swarm stay loosely coupled.** Kitchen is a general-purpose
  agent harness, and Swarm must work with any client. They meet through open
  standards such as A2A and AI Catalog, never shared code or a private API.
