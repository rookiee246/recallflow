# RecallFlow import format: recallflow-import-v2

One JSON object. `entries` is a list; each entry is one topic (or subtopic) you studied.
Only `topic` is required. Everything else may be left out or empty.

| Field | Type | Meaning |
|---|---|---|
| `format` | text | `"recallflow-import-v2"` |
| `entries[].subject` | text | Physics, Chemistry, Mathematics (or any other subject). Missing = "Other" |
| `entries[].chapter` | text | Chapter name, shown with the topic |
| `entries[].topic` | text, **required** | Topic name. Same subject + same name = same topic (matching ignores capitals, punctuation and spacing) |
| `entries[].subtopic` | text | Optional. Stored as "Topic — Subtopic" |
| `entries[].studyDate` | `YYYY-MM-DD` | Date studied. Missing = today. For a new topic the first revision is due on this date |
| `entries[].importance` | `high` / `normal` / `low` | Default `normal` |
| `entries[].coverage` | object | `studied`, `understood`, `practised`, `needsWork`: text each. Saved as a dated study session |
| `entries[].keyPoints` | list of text | One idea per item |
| `entries[].details` | text | Longer explanation (use `\n` for new lines) |
| `entries[].formulas` | list of `{formula, meaning}` | Formula and what it means |
| `entries[].derivations` | list of text | |
| `entries[].examples` | list of text | |
| `entries[].commonMistakes` | list of text | |
| `entries[].connections` | list of text | |
| `entries[].questions` | list of `{question, answer}` | `answer` may be `""` |
| `entries[].notes` | text | The student's own remarks |

## How importing behaves
- **New topic**: created; revision schedule starts (Day 1, 2, 4, 7, 14, 21, 28 …).
- **Existing topic** (same subject and name): new items are *added*. Nothing already saved is removed or replaced. The revision schedule and your recall history are not touched.
- **Similar but not identical names** (for example "Coulomb's law" and "Coulombs law of force"): the preview asks whether it is the same topic.
- The same topic twice in one package is combined. Bad dates, missing subjects and similar are reported as notes. Missing topic names, wrong types and broken JSON block the import with a message.
- Several fenced code blocks pasted at once (Part 1 of 2, Part 2 of 2) are imported together.

A working example is in `sample-import.json`.
