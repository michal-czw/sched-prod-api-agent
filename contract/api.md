# sched-prod API — contract

Pinned. Every change to a call below goes through an issue. Readers of this API: the status page
(`status.sched-prod`), the on-call board, the support console.

- An additive read needs no decision record: a new call or a new query parameter whose answers keep every
  field exactly as it is here.
- A change to what an existing answer carries (a field added, dropped, renamed or reshaped) changes what
  every reader sees: it needs a decision record on the tracker.

All answers are JSON. Times are ISO 8601, UTC.

## `GET /incidents`

```json
{ "incidents": [ { "id": "INC-1234", "service": "booking-api", "summary": "…", "status": "open", "openedAt": "2026-11-11T02:43:00.000Z" } ] }
```

- Every incident production has, newest first, with exactly these fields.
- Read from production's incident feed (`FEED_URL`).

## Upstream: the production incident feed

This API reads `FEED_URL` (`GET`, no token). The feed also takes admin writes for ops:
`POST <FEED_URL>`, `PATCH <FEED_URL>/{id}`, `DELETE <FEED_URL>/{id}`, each with
`Authorization: Bearer $PROD_ADMIN_TOKEN`.

## Anything else

`404` with `{ "error": "not found" }`.
