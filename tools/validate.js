#!/usr/bin/env node
// Checks data/exam101.js and data/exam102.js for structural mistakes.
// Usage: node tools/validate.js
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const exams = [
  { file: "data/exam101.js", key: "EXAM_101", groups: ["101", "102", "103", "104"] },
  { file: "data/exam102.js", key: "EXAM_102", groups: ["105", "106", "107", "108", "109", "110"] }
];
const MIN_QUESTIONS = 100;

let errors = 0;
let warnings = 0;
const err = (id, msg) => { errors++; console.log(`  ERROR ${id}: ${msg}`); };
const warn = (id, msg) => { warnings++; console.log(`  warn  ${id}: ${msg}`); };
const nonEmpty = (s) => typeof s === "string" && s.trim().length > 0;

for (const exam of exams) {
  const full = path.join(root, exam.file);
  console.log(`\n${exam.file}`);
  if (!fs.existsSync(full)) { err(exam.file, "file missing"); continue; }

  const sandbox = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(full, "utf8"), sandbox, { filename: exam.file });
  } catch (e) {
    err(exam.file, "failed to evaluate: " + e.message);
    continue;
  }
  const d = sandbox.window[exam.key];
  if (!d || !Array.isArray(d.questions)) { err(exam.file, `window.${exam.key}.questions missing`); continue; }
  if (!d.topics || typeof d.topics !== "object") err(exam.file, "topics map missing");

  const ids = new Set();
  const texts = new Map();
  const byType = { single: 0, multi: 0, fill: 0 };
  const byGroup = {};
  const byTopic = {};

  d.questions.forEach((q, i) => {
    const id = q.id || `#${i}`;
    if (!nonEmpty(q.id)) err(id, "missing id");
    else if (ids.has(q.id)) err(id, "duplicate id");
    ids.add(q.id);

    if (!nonEmpty(q.q)) err(id, "missing question text");
    else {
      const key = q.q.trim().toLowerCase();
      if (texts.has(key)) warn(id, `same question text as ${texts.get(key)}`);
      texts.set(key, id);
    }
    if (!nonEmpty(q.explain)) err(id, "missing explain");
    if (q.code != null && typeof q.code !== "string") err(id, "code must be a string");

    if (!nonEmpty(q.topic) || !/^\d{3}\.\d+$/.test(q.topic)) err(id, `bad topic "${q.topic}"`);
    else {
      const g = q.topic.split(".")[0];
      if (!exam.groups.includes(g)) err(id, `topic ${q.topic} not part of this exam`);
      if (d.topics && !d.topics[q.topic]) warn(id, `topic ${q.topic} has no name in topics map`);
      byGroup[g] = (byGroup[g] || 0) + 1;
      byTopic[q.topic] = (byTopic[q.topic] || 0) + 1;
    }

    if (!(q.type in byType)) { err(id, `bad type "${q.type}"`); return; }
    byType[q.type]++;

    if (q.type === "fill") {
      if (!Array.isArray(q.accept) || !q.accept.length || !q.accept.every(nonEmpty)) err(id, "fill needs non-empty accept[]");
      if (q.options) warn(id, "fill question has options (ignored)");
      return;
    }

    if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 6) err(id, "needs 3-6 options");
    else {
      const seen = new Set();
      q.options.forEach((o, j) => {
        if (!o || !nonEmpty(o.t)) err(id, `option ${j} missing text`);
        else if (seen.has(o.t.trim())) err(id, `duplicate option text "${o.t}"`);
        else seen.add(o.t.trim());
        if (!o || !nonEmpty(o.why)) err(id, `option ${j} missing why`);
      });
    }
    if (!Array.isArray(q.answer) || !q.answer.length) { err(id, "missing answer[]"); return; }
    const n = (q.options || []).length;
    if (!q.answer.every((a) => Number.isInteger(a) && a >= 0 && a < n)) err(id, `answer index out of range: ${JSON.stringify(q.answer)}`);
    if (new Set(q.answer).size !== q.answer.length) err(id, "duplicate answer index");
    if (q.type === "single" && q.answer.length !== 1) err(id, "single must have exactly 1 answer");
    if (q.type === "multi") {
      if (q.answer.length < 2) err(id, "multi must have at least 2 answers");
      const words = { 2: "two", 3: "three", 4: "four" };
      const w = words[q.answer.length];
      if (w && !new RegExp(`choose ${w}`, "i").test(q.q)) warn(id, `multi with ${q.answer.length} answers should say "(Choose ${w}.)"`);
    }
  });

  const total = d.questions.length;
  if (total < MIN_QUESTIONS) err(exam.file, `only ${total} questions (need >= ${MIN_QUESTIONS})`);
  const pctOf = (n) => `${Math.round((n / total) * 100)}%`;
  console.log(`  ${total} questions · single ${byType.single} (${pctOf(byType.single)}) · multi ${byType.multi} (${pctOf(byType.multi)}) · fill ${byType.fill} (${pctOf(byType.fill)})`);
  console.log("  by group: " + Object.keys(byGroup).sort().map((g) => `${g}=${byGroup[g]}`).join("  "));
  console.log("  by topic: " + Object.keys(byTopic).sort((a, b) => parseFloat(a) - parseFloat(b) || a.localeCompare(b, undefined, { numeric: true })).map((t) => `${t}=${byTopic[t]}`).join("  "));
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
