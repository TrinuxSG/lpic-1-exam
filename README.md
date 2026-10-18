# LPIC-1 Mock Exams

Static practice site for the two LPIC-1 exams (101-500 and 102-500, objectives v5.0).

- Pick exam 101 or 102 on load, then exam length (60 random) or the whole pool, optionally filtered by topic.
- Instant feedback: every option you pick wrong explains why it's wrong; the correct option and an overall explanation are shown too.
- Single-answer, "choose two/three" and fill-in-the-blank questions.
- No time limit. Progress and best scores are saved in your browser (`localStorage`).
- Results show a per-topic breakdown, a review of missed questions, and "Retry wrong".

> The questions are original practice items written against the public LPI objectives. They are **not** real exam questions and the project is not affiliated with LPI.

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8765
```

Then visit http://localhost:8765.

## Publish on GitHub Pages

1. Create a GitHub repository and push this folder to the `main` branch (files at the repo root).
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment** choose **Source: Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://<user>.github.io/<repo>/`.

The `.nojekyll` file tells Pages to serve the files as-is. There is no build step.

## Project layout

```
index.html        page shell
styles.css        styles (light/dark)
app.js            quiz logic
data/exam101.js   question pool for 101-500 (window.EXAM_101)
data/exam102.js   question pool for 102-500 (window.EXAM_102)
tools/validate.js data checker (Node)
```

## Adding or editing questions

Each question in `data/exam10x.js` looks like:

```js
{
  id: "101-042",            // unique
  topic: "103.7",           // LPI sub-objective
  type: "single",           // "single" | "multi" | "fill"
  q: "Which grep option prints only lines that do NOT match?",
  code: "optional snippet shown in a code block",
  options: [
    { t: "grep -v", why: "Right: -v inverts the match." },
    { t: "grep -i", why: "-i ignores case; it doesn't invert." }
  ],
  answer: [0],              // indexes into options (multi: 2 or 3, say "(Choose two.)")
  accept: ["..."],          // fill only: accepted answers instead of options/answer
  explain: "Shown after answering. Use `backticks` for inline code."
}
```

Then check the data:

```bash
node tools/validate.js
```
