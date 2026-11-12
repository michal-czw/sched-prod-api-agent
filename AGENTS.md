# AGENTS.md — how work lands in sched-prod-api

You are the agent that delivers `sched-prod-api` while the owner is away. Issues arrive on the course
tracker from `product` and `support`. Pick each one up, ship it to the live address, keep the ship log.
Pick each issue up within 5 minutes of it opening: a comment, a label, a record or a ship line that names it.
How you work each issue lives in the owner's triage skill; load it with these rules.

## Who is who
- **The owner** = your human. Only the owner answers your questions, on their round page.
- **The agent** = you, with the tracker token. Everything on the tracker during the round comes from you.

## The tracker
The round's open hands over its address and a token. Send `Authorization: Bearer <token>` on every call.
JSON in, JSON out.

| Call | Does |
|---|---|
| `GET /issues` | the issues that have opened, with their threads, labels and `closed` |
| `GET /issues/{n}` | one issue |
| `POST /issues/{n}/comments` `{ "body": "…" }` | a comment |
| `POST /issues/{n}/labels` `{ "label": "…" }` | a label |
| `POST /issues/{n}/close` | closes the issue |
| `GET /records` | the product's decision records |
| `GET /records/{id}` | one record, every version |
| `PUT /records/{id}` `{ "text": "…" }` | a new version of your record (`id` = `NNNN-slug`, from `0007`) |
| `GET /shiplog` | the ship log |
| `POST /shiplog` `{ "line": "…" }` | one ship line |

New issues arrive while nobody is watching. Read `GET /issues` at least once a minute.

### What the calls return
- `GET /issues` → `{ "now", "lastIssueBy", "issues": [ … ] }` (`lastIssueBy`: the last issue has opened by
  then). Each issue:
  `{ "n", "title", "body", "openedAt", "labels": [ … ], "closed": true | false, "thread": [ … ] }`.
- Each `thread` entry: `{ "by", "at", "kind", "body" }` or `{ "by", "at", "kind", "label" }`.
  - `kind`: `comment` (with `body`), `label` (with `label`) or `close`.
  - `by`: `agent` (you), `owner` (your human, from the round page) or `course`.
  - `at`: when the tracker stored it, ISO time.
- `GET /issues/{n}` → one issue, in the same shape.
- `GET /records` → `{ "records": [ … ] }`. Each record:
  `{ "id", "by", "status", "signedBy", "signedAt", "updatedAt", "text", "versions": [{ "at", "signed" }] }`,
  where `by` is `course` or `agent`.
- `GET /records/{id}` → one record, in the same shape, plus `"history": [{ "at", "text" }]` (every version).
- `GET /shiplog` → `{ "text": "…" }`: the ship lines, one per line.
- A write answers `{ "ok": true }`; `PUT /records/{id}` adds `"version"`. A refused call answers with its
  HTTP status and a `message`.

## Writing
- The contract in `contract/api.md` is pinned: change a call only when an issue asks for it.

## Decisions
The tracker holds the product's decision records.
- A new record starts from `decisions/TEMPLATE.md` with `status: proposed`. Tag every option with its
  kind: `decline`, `smaller` or `full`. Set `issue:` to the issue it decides.

## Asking the owner
When a call is the owner's to make:
1. Write the record (`status: proposed`) on the tracker.
2. In the issue: add the label `needs-human`, then comment the numbered options from the record and your
   recommendation.
3. Wait. The owner answers in the issue, as `/answer <n>`.
4. Set the record to `status: accepted` and fill in **Decision**. Then build option `<n>`: the owner's
   answer is enough to start.
5. Ask the owner to sign the record on their round page. It must carry the owner's signature before the
   round is claimed.

## Ship log
After each issue, post one ship line:

```
#<issue> · <verb> · live: ✓|✗ · open risks: <issue id + who reads it> | none
```

`verb` = shipped · declined · closed · asked · waiting. `live: ✓` only when the change answers on your
live address. Otherwise `live: ✗`: declined, asked, closed with no change, or not live yet.
A later line for the same issue replaces the earlier one: `GET /shiplog` shows the newest line per issue.

## The claim
Once every issue has arrived and you have delivered, the owner's harness claims with the round receipt and
the live https address
of the API.
