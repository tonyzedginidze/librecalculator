# Lesson videos: house style

Every calculator video is a short lesson, as if a good teacher explained the concept to someone meeting it for the first time. The viewer should understand why, be able to do it by hand, and know the traps. Mechanics (files, build, formats) are in [videos.md](videos.md); this file is the teaching and visual standard. Every video follows it so the set feels like one course.

## 1. Plan before building

Each video starts as `videos/<id>/plan.md`, written and reviewed before any scene is drawn. A plan is accepted when a reviewer can answer yes to every check in section 7. Plans are not shipped (the whole `videos/` folder is git-ignored); they exist so narration, pictures and numbers are decided together.

```
# <id> lesson plan
Audience: who is watching and what they already know
Big idea: one sentence the viewer should leave with
Misconception to defuse: the wrong belief most people hold
Numbers: every number used, where it comes from (lesson example / engine run / arithmetic)
Scene | Job | Narration beats | Picture (what appears, in what order) | Cue markers
```

## 2. The arc (every video, 6 to 9 scenes)

Length follows the lesson, not a clock: take the time the concept needs to be understood, and no more. Most land around 2 to 4 minutes; never cut an explanation, a step of the example or a self-check to save time, and never pad.

| # | Scene id | Job |
|---|---|---|
| 1 | `hook` | A situation the viewer recognises, then the question, then the name of the concept. No formula yet. |
| 2 | `meaning` | What the quantity means, shown as a picture, before any symbols. Defuse the misconception here. |
| 3 | `rule` | The formula, built piece by piece from the picture: why we divide, why we multiply, what each part is called and measured in. |
| 4 | `example` | Worked example, slow, one step at a time; the picture changes with each step. Prefer the lesson's own example. |
| 5 | `variation` | A second case that differs in kind: working backwards, an edge case, a different unit, a negative or zero, a trap. Never the same example with new numbers. |
| 6 | `mistake` | Two or three common mistakes, each with the reason it goes wrong and a quick self-check (estimate, units, sense check). |
| 7 | `summary` | One or two sentences to remember, and when to reach for the calculator. |

A calculator with several operations gets one teaching scene per operation, each with its own why, between `rule` and `mistake`. Scene ids stay stable so chapters read the same across videos.

## 2b. Story

Correct and clear is the floor; the bar is a lesson people would choose to watch.
- **Hook with a real curiosity gap** in the first ten seconds: a surprising fact, a puzzle or a wrong-looking answer that comes from this calculator's own verified numbers (a fifty percent loss is not undone by a fifty percent gain; a leap-day birthday; why a two-by-four is not two by four). State the question, do not answer it yet.
- **One payoff moment** per lesson, named in the plan (`Payoff:`), where the idea clicks; the scenes before it build towards it and the picture makes it visible.
- **One thread**: a single situation or object carried through the lesson, and the summary closes the loop by answering the hook's question.
- **No stock phrases.** Do not open every hook with "Imagine", do not repeat "Pause and check" or "Reach for the calculator" in every video; vary how self-checks and endings are phrased so the set never sounds templated. Mention the calculator at most once, naturally.

## 3. Narration voice

- A teacher talking to one learner: warm, direct, concrete. "Imagine...", "Notice that...", "Why does this work? Because...", "Pause and check:".
- Short sentences, one idea each. Roughly 130 words per minute, so a scene of 20 seconds is about 45 words.
- Explain what a formula means; never read it symbol by symbol.
- Numbers and units are spelled as words in the script ("two point five square metres").
- No marketing phrases, filler or "in this video". Finance and health videos keep one educational-estimate sentence, taken from the lesson.
- Every claim agrees with the calculator's lesson page and engine (limits, rounding, assumptions).

## 4. Numbers

Facts come from `packages/content/src/<id>`, `packages/calculators/src/<id>` (engine, tests, metadata) and the topic text in `packages/i18n/src/topics/<id>.ts`. A video may use a better teaching example than the lesson's own, but every number shown or spoken must be produced by running the real engine or be plain arithmetic on verified numbers. List them in the plan's `Numbers` line. Never invent data.

## 5. Visual vocabulary

One language across all videos (chalk theme):

| Colour | Meaning |
|---|---|
| blue | known inputs, the thing we start with |
| orange | the unknown or the quantity being asked for |
| green | the result, a correct check, a part that belongs |
| red | a mistake, a wrong value, a crossed-out idea |
| purple | a side note, a second quantity, an assumption |
| accent (yellow) | the answer or the single takeaway; used once per scene at most |
| muted | labels and units |

Pictures show the idea with the scene's own numbers; text is only labels. Prefer: a bar or strip for amounts, a grid of cells for counts and areas, a pie for shares, a number line for position and change, a scale or gauge with a sliding marker for ranges, a line chart for change over time, icons (lucide) for real-world objects. Build the picture in the order the narration explains it, on `[#markers]`; never show the finished picture first. Use `s.annotate` (circle or underline) once per scene on the thing to remember. Crossed-out ideas use a red cross.

Layout: one shared `kit(s)` per scene (videos/_shared/layout.js). Content must fit 16:9 and 9:16; in 9:16 stay above `s.safe.bottom`, use the whole usable height, and keep text at or above 36 px.

## 6. Build and verify

`bun scripts/build-videos.ts <id> --lang en`, one id at a time (a build uses every core). Fix every `ERROR`. Extract a frame a second or two after each scene's cue in both formats, make a contact sheet and look at it: no overlap, no clipping, no empty scene. Run `bunx biome check --write` on `scenes.js`, then rebuild so the shipped file matches the final source. Upload with `bun run upload:videos <id>`.

## 7. Review checklist

1. Could a beginner follow it without already knowing the formula?
2. Does the `meaning` scene explain what the quantity is before any symbols?
3. Is the misconception named and defused?
4. Does each formula part get its plain-language name and unit?
5. Is the example slow enough, with the picture changing at every step?
6. Does the variation differ in kind from the example?
7. Does each mistake come with its reason and a self-check?
8. Is every number traceable to the lesson, the engine or arithmetic on those?
9. Does it agree with the lesson page (limits, rounding, disclaimers)?
10. Is every picture built in step with the narration, using the colour meanings above?
11. Do both formats pass the frame check?
12. Is every scene needed and complete (nothing cut short, nothing padded), and does every scene have a chapter title?
