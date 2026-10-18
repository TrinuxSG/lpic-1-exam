(function () {
  "use strict";

  // ---------- Static metadata ----------
  var EXAMS = {
    "101": {
      key: "EXAM_101",
      code: "101-500",
      title: "Exam 101",
      groups: {
        "101": "System Architecture",
        "102": "Linux Installation and Package Management",
        "103": "GNU and Unix Commands",
        "104": "Devices, Linux Filesystems, FHS"
      }
    },
    "102": {
      key: "EXAM_102",
      code: "102-500",
      title: "Exam 102",
      groups: {
        "105": "Shells and Shell Scripting",
        "106": "User Interfaces and Desktops",
        "107": "Administrative Tasks",
        "108": "Essential System Services",
        "109": "Networking Fundamentals",
        "110": "Security"
      }
    }
  };
  var EXAM_LENGTH = 60;
  var PASS_PCT = 65; // LPI scores 200-800 with 500 to pass; ~65% raw is a common rule of thumb.
  var LETTERS = "ABCDEFGHIJ";

  var app = document.getElementById("app");
  var state = null; // current attempt
  var setupExam = null; // exam id while on setup screen

  // ---------- Storage (best effort) ----------
  var store = {
    get: function (k) {
      try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ }
    },
    del: function (k) {
      try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
    }
  };
  function attemptKey(id) { return "lpic1.attempt." + id; }
  function bestKey(id) { return "lpic1.best." + id; }

  // ---------- Theme ----------
  (function initTheme() {
    var saved = store.get("lpic1.theme");
    if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
    document.getElementById("themeBtn").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      if (!cur) cur = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      store.set("lpic1.theme", next);
    });
  })();

  document.getElementById("homeBtn").addEventListener("click", function () {
    state = null;
    setupExam = null;
    renderHome();
  });

  // ---------- Helpers ----------
  function data(id) { return window[EXAMS[id].key] || null; }

  function questionMap(id) {
    var d = data(id), m = {};
    if (d) d.questions.forEach(function (q) { m[q.id] = q; });
    return m;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Escape, then turn `inline code` into <code>.
  function rich(s) {
    return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function groupOf(topic) { return String(topic).split(".")[0]; }

  function topicName(id, topic) {
    var d = data(id);
    return (d && d.topics && d.topics[topic]) || "";
  }

  function normalize(s) {
    return String(s).trim().replace(/\s+/g, " ").replace(/;$/, "").trim();
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    var s = a.slice().sort().join(","), t = b.slice().sort().join(",");
    return s === t;
  }

  // Options that start with a capital letter read as prose; everything else as a command/path.
  function isProse(t) { return /^[A-Z][a-z]/.test(t); }

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }

  // ---------- Attempt lifecycle ----------
  function newAttempt(id, qids) {
    var qmap = questionMap(id);
    state = {
      exam: id,
      idx: 0,
      startedAt: Date.now(),
      finished: false,
      items: qids.map(function (qid) {
        var q = qmap[qid];
        var order = q.options ? shuffle(q.options.map(function (_, i) { return i; })) : null;
        return { qid: qid, order: order, sel: [], resp: null };
      })
    };
    save();
    renderQuiz();
  }

  function save() {
    if (!state) return;
    if (state.finished) store.del(attemptKey(state.exam));
    else store.set(attemptKey(state.exam), state);
  }

  function loadSaved(id) {
    var s = store.get(attemptKey(id));
    if (!s || !s.items || !s.items.length) return null;
    var qmap = questionMap(id);
    var valid = s.items.every(function (it) { return qmap[it.qid]; });
    return valid ? s : null;
  }

  function answeredCount(s) { return s.items.filter(function (i) { return i.resp; }).length; }
  function correctCount(s) { return s.items.filter(function (i) { return i.resp && i.resp.ok; }).length; }

  // ---------- Home ----------
  function renderHome() {
    window.scrollTo(0, 0);
    var html = '<div class="stack">' +
      '<div><h1>Choose your exam</h1>' +
      '<p class="lead">LPIC-1 has two exams. Pick one to practice. You get instant feedback, and every wrong option tells you why it is wrong.</p></div>' +
      '<div class="exam-grid">';
    Object.keys(EXAMS).forEach(function (id) {
      var meta = EXAMS[id], d = data(id);
      var count = d ? d.questions.length : 0;
      var best = store.get(bestKey(id));
      var saved = d ? loadSaved(id) : null;
      html += '<section class="card exam-card">' +
        '<div class="code-tag">LPIC-1 · ' + esc(meta.code) + '</div>' +
        '<h2>' + esc(meta.title) + '</h2>' +
        '<ul>' + Object.keys(meta.groups).map(function (g) {
          return '<li><b>' + g + '</b> ' + esc(meta.groups[g]) + '</li>';
        }).join("") + '</ul>' +
        '<div class="stats">' + (d ? count + ' questions in pool' : 'Question file missing (data/exam' + id + '.js)') + '</div>' +
        (best ? '<div class="best">Best score: <b>' + best.pct + '%</b> <span class="muted">(' + best.correct + '/' + best.total + ')</span></div>' : '') +
        '<div class="actions">' +
        '<button class="btn primary" data-start="' + id + '"' + (d ? '' : ' disabled') + '>Start ' + esc(meta.title) + '</button>' +
        (saved ? '<button class="btn" data-resume="' + id + '">Resume (' + answeredCount(saved) + '/' + saved.items.length + ')</button>' : '') +
        '</div></section>';
    });
    html += '</div></div>';
    app.innerHTML = html;

    app.querySelectorAll("[data-start]").forEach(function (b) {
      b.addEventListener("click", function () { renderSetup(b.getAttribute("data-start")); });
    });
    app.querySelectorAll("[data-resume]").forEach(function (b) {
      b.addEventListener("click", function () {
        state = loadSaved(b.getAttribute("data-resume"));
        if (state) renderQuiz(); else renderHome();
      });
    });
  }

  // ---------- Setup ----------
  function renderSetup(id) {
    window.scrollTo(0, 0);
    setupExam = id;
    var meta = EXAMS[id], d = data(id);
    var counts = {};
    d.questions.forEach(function (q) { counts[q.topic] = (counts[q.topic] || 0) + 1; });
    var topics = Object.keys(counts).sort(function (a, b) {
      var pa = a.split(".").map(Number), pb = b.split(".").map(Number);
      return pa[0] - pb[0] || pa[1] - pb[1];
    });

    var topicHtml = "", lastGroup = null;
    topics.forEach(function (t) {
      var g = groupOf(t);
      if (g !== lastGroup) {
        topicHtml += '<div class="topic-group">' + g + ' · ' + esc(meta.groups[g] || "") + '</div>';
        lastGroup = g;
      }
      topicHtml += '<label><input type="checkbox" name="topic" value="' + esc(t) + '" checked>' +
        '<span><span class="tcode">' + esc(t) + '</span> ' + esc(topicName(id, t)) +
        ' <span class="muted">(' + counts[t] + ')</span></span></label>';
    });

    app.innerHTML =
      '<div class="stack">' +
      '<div><div class="code-tag tag">LPIC-1 · ' + esc(meta.code) + '</div><h1>' + esc(meta.title) + ' setup</h1>' +
      '<p class="lead">No time limit. Answer at your own pace; your progress is saved in this browser.</p></div>' +
      '<form class="card setup" id="setupForm">' +
      '<fieldset><legend>How many questions?</legend><div class="seg">' +
      '<label><input type="radio" name="size" value="exam" checked><span>Exam length (' + EXAM_LENGTH + ', random)</span></label>' +
      '<label><input type="radio" name="size" value="all"><span>All (<span id="allCount">' + d.questions.length + '</span>, shuffled)</span></label>' +
      '</div></fieldset>' +
      '<fieldset><legend>Topics</legend>' +
      '<div class="row small" style="margin-bottom:10px"><button type="button" class="btn ghost" id="allTopics">Select all</button>' +
      '<button type="button" class="btn ghost" id="noTopics">Clear</button></div>' +
      '<div class="topic-list">' + topicHtml + '</div></fieldset>' +
      '<div class="row"><button type="button" class="btn ghost" id="backBtn">← Back</button><span class="spacer"></span>' +
      '<span class="muted small" id="selInfo"></span>' +
      '<button type="submit" class="btn primary" id="goBtn">Start</button></div>' +
      '</form></div>';

    var form = document.getElementById("setupForm");
    function selected() {
      return Array.prototype.slice.call(form.querySelectorAll('input[name="topic"]:checked')).map(function (i) { return i.value; });
    }
    function pool() {
      var sel = selected();
      return d.questions.filter(function (q) { return sel.indexOf(q.topic) !== -1; });
    }
    function update() {
      var p = pool().length;
      var size = form.querySelector('input[name="size"]:checked').value;
      var n = size === "all" ? p : Math.min(EXAM_LENGTH, p);
      document.getElementById("allCount").textContent = p;
      document.getElementById("selInfo").textContent = n + " question" + (n === 1 ? "" : "s");
      document.getElementById("goBtn").disabled = n === 0;
    }
    form.addEventListener("change", update);
    document.getElementById("allTopics").addEventListener("click", function () {
      form.querySelectorAll('input[name="topic"]').forEach(function (i) { i.checked = true; }); update();
    });
    document.getElementById("noTopics").addEventListener("click", function () {
      form.querySelectorAll('input[name="topic"]').forEach(function (i) { i.checked = false; }); update();
    });
    document.getElementById("backBtn").addEventListener("click", renderHome);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var p = shuffle(pool());
      var size = form.querySelector('input[name="size"]:checked').value;
      if (size !== "all") p = p.slice(0, EXAM_LENGTH);
      if (!p.length) return;
      setupExam = null;
      newAttempt(id, p.map(function (q) { return q.id; }));
    });
    update();
  }

  // ---------- Quiz ----------
  function renderQuiz() {
    var s = state, meta = EXAMS[s.exam];
    var qmap = questionMap(s.exam);
    var it = s.items[s.idx], q = qmap[it.qid];
    var answered = answeredCount(s), correct = correctCount(s);
    var locked = !!it.resp;
    var typeLabel = q.type === "multi" ? "Choose " + q.answer.length : q.type === "fill" ? "Fill in the blank" : "Single answer";

    var dots = s.items.map(function (x, i) {
      var cls = "dot" + (x.resp ? (x.resp.ok ? " ok" : " bad") : "") + (i === s.idx ? " cur" : "");
      return '<button class="' + cls + '" data-jump="' + i + '" title="Question ' + (i + 1) + '">' + (i + 1) + '</button>';
    }).join("");

    var html =
      '<div class="quiz-head"><span class="count">Question ' + (s.idx + 1) + ' / ' + s.items.length + '</span>' +
      '<span class="score">' + correct + ' correct · ' + (answered - correct) + ' wrong · ' + (s.items.length - answered) + ' left</span>' +
      '<span class="spacer"></span><span class="muted small">' + esc(meta.code) + '</span></div>' +
      '<div class="progress"><div style="width:' + pct(answered, s.items.length) + '%"></div></div>' +
      '<div class="dots">' + dots + '</div>' +
      '<article class="card">' +
      '<div class="row"><span class="tag">' + esc(q.topic) + ' ' + esc(topicName(s.exam, q.topic)) + '</span>' +
      '<span class="tag type">' + typeLabel + '</span></div>' +
      '<div class="question">' + rich(q.q) + '</div>' +
      (q.code ? '<pre class="code">' + esc(q.code) + '</pre>' : '');

    if (q.type === "fill") {
      var cls = locked ? (it.resp.ok ? "ok" : "bad") : "";
      html += '<div class="fill-wrap"><input id="fillInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
        'placeholder="Type your answer…" class="' + cls + '" value="' + esc(locked ? it.resp.text : (it.draft || "")) + '"' + (locked ? ' readonly' : '') + '>' +
        (locked ? '' : '<button class="btn primary" id="checkBtn">Check</button>') + '</div>';
    } else {
      html += '<div class="options">';
      it.order.forEach(function (orig, pos) {
        var o = q.options[orig];
        var isAns = q.answer.indexOf(orig) !== -1;
        var picked = (locked ? it.resp.picked : it.sel).indexOf(orig) !== -1;
        var c = "option" + (q.type === "multi" ? " multi" : "");
        var why = "";
        if (locked) {
          c += " locked";
          if (isAns && picked) { c += " correct"; why = label("Correct", o.why); }
          else if (isAns && !picked) { c += " missed"; why = label(q.type === "multi" ? "You missed this one" : "Correct answer", o.why); }
          else if (picked) { c += " wrong"; why = label("Why it's wrong", o.why); }
          else { c += " dim"; why = label("Why not", o.why); }
        } else if (picked) c += " selected";
        html += '<button class="' + c + '" data-opt="' + orig + '"' + (locked ? ' tabindex="-1"' : '') + '>' +
          '<span class="key">' + LETTERS[pos] + '</span>' +
          '<span class="body"><span class="text' + (isProse(o.t) ? ' prose' : '') + '">' + rich(o.t) + '</span>' + why + '</span></button>';
      });
      html += '</div>';
      if (!locked && q.type === "multi") {
        html += '<div class="nav"><button class="btn primary" id="checkBtn"' + (it.sel.length === q.answer.length ? '' : ' disabled') + '>Check answer</button>' +
          '<span class="muted small" style="align-self:center">' + it.sel.length + ' of ' + q.answer.length + ' selected</span></div>';
      }
    }

    if (locked) {
      var ok = it.resp.ok;
      html += '<div class="verdict ' + (ok ? 'ok' : 'bad') + '"><div class="title">' + (ok ? '✓ Correct' : '✗ Not quite') + '</div>';
      if (q.type === "fill" && !ok) {
        html += '<p>Accepted answer' + (q.accept.length > 1 ? 's' : '') + ': ' +
          q.accept.map(function (a) { return '<code>' + esc(a) + '</code>'; }).join(", ") + '</p>';
      }
      if (q.explain) html += '<p>' + rich(q.explain) + '</p>';
      html += '</div>';
    }

    html += '</article>' +
      '<div class="nav"><button class="btn" id="prevBtn"' + (s.idx === 0 ? ' disabled' : '') + '>← Previous</button>' +
      '<span class="spacer"></span>' +
      (answered === s.items.length
        ? '<button class="btn primary" id="finishBtn">See results</button>'
        : '<button class="btn" id="finishBtn">Finish now</button>' +
          '<button class="btn primary" id="nextBtn"' + (s.idx === s.items.length - 1 ? ' disabled' : '') + '>' + (locked ? 'Next →' : 'Skip →') + '</button>') +
      '</div>' +
      '<div class="hint">Keys: <kbd>A</kbd>–<kbd>E</kbd> or <kbd>1</kbd>–<kbd>5</kbd> select · <kbd>Enter</kbd> check / next · <kbd>←</kbd> <kbd>→</kbd> navigate</div>';

    app.innerHTML = html;
    bindQuiz(q, it);
  }

  function label(name, text) {
    return text ? '<div class="why"><span class="label">' + name + ':</span>' + rich(text) + '</div>' : "";
  }

  function bindQuiz(q, it) {
    app.querySelectorAll("[data-jump]").forEach(function (b) {
      b.addEventListener("click", function () { go(Number(b.getAttribute("data-jump"))); });
    });
    app.querySelectorAll("[data-opt]").forEach(function (b) {
      b.addEventListener("click", function () { pick(Number(b.getAttribute("data-opt"))); });
    });
    var check = document.getElementById("checkBtn");
    if (check) check.addEventListener("click", submit);
    var input = document.getElementById("fillInput");
    if (input && !it.resp) {
      input.addEventListener("input", function () { it.draft = input.value; });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); submit(); }
      });
      input.focus();
    }
    var prev = document.getElementById("prevBtn");
    if (prev) prev.addEventListener("click", function () { go(state.idx - 1); });
    var next = document.getElementById("nextBtn");
    if (next) next.addEventListener("click", function () { go(state.idx + 1); });
    document.getElementById("finishBtn").addEventListener("click", function () {
      var left = state.items.length - answeredCount(state);
      if (left && !confirm(left + " question(s) unanswered. They will count as wrong. Finish anyway?")) return;
      finish();
    });
  }

  function current() {
    var it = state.items[state.idx];
    return { it: it, q: questionMap(state.exam)[it.qid] };
  }

  function go(i) {
    if (i < 0 || i >= state.items.length) return;
    state.idx = i;
    save();
    renderQuiz();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pick(orig) {
    var c = current(), it = c.it, q = c.q;
    if (it.resp) return;
    if (q.type === "single") {
      it.sel = [orig];
      submit();
      return;
    }
    var at = it.sel.indexOf(orig);
    if (at !== -1) it.sel.splice(at, 1);
    else if (it.sel.length < q.answer.length) it.sel.push(orig);
    else { it.sel.shift(); it.sel.push(orig); }
    save();
    renderQuiz();
  }

  function submit() {
    var c = current(), it = c.it, q = c.q;
    if (it.resp) return;
    if (q.type === "fill") {
      var input = document.getElementById("fillInput");
      var text = input ? input.value : (it.draft || "");
      if (!normalize(text)) { if (input) input.focus(); return; }
      var ok = q.accept.some(function (a) { return normalize(a) === normalize(text); });
      it.resp = { text: text, ok: ok };
      delete it.draft;
    } else {
      if (q.type === "multi" && it.sel.length !== q.answer.length) return;
      it.resp = { picked: it.sel.slice(), ok: sameSet(it.sel, q.answer) };
    }
    save();
    renderQuiz();
  }

  document.addEventListener("keydown", function (e) {
    if (!state || state.finished || setupExam) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    var c = current();
    if (e.key === "ArrowLeft") { go(state.idx - 1); return; }
    if (e.key === "ArrowRight") { go(state.idx + 1); return; }
    if (e.key === "Enter") {
      if (tag === "BUTTON") return; // let the focused button handle it
      e.preventDefault();
      if (!c.it.resp && c.q.type !== "single") submit();
      else if (c.it.resp) {
        if (answeredCount(state) === state.items.length) finish();
        else go(nextUnanswered());
      }
      return;
    }
    if (c.q.type === "fill" || c.it.resp) return;
    var k = e.key.toUpperCase(), pos = -1;
    if (/^[1-9]$/.test(k)) pos = Number(k) - 1;
    else if (LETTERS.indexOf(k) !== -1 && k.length === 1) pos = LETTERS.indexOf(k);
    if (pos >= 0 && pos < c.it.order.length) { e.preventDefault(); pick(c.it.order[pos]); }
  });

  function nextUnanswered() {
    var n = state.items.length;
    for (var k = 1; k <= n; k++) {
      var i = (state.idx + k) % n;
      if (!state.items[i].resp) return i;
    }
    return state.idx;
  }

  // ---------- Results ----------
  function finish() {
    state.finished = true;
    var total = state.items.length, correct = correctCount(state);
    var p = pct(correct, total);
    var best = store.get(bestKey(state.exam));
    if (total >= 20 && (!best || p > best.pct)) store.set(bestKey(state.exam), { pct: p, correct: correct, total: total, at: Date.now() });
    save();
    renderResults();
  }

  function renderResults() {
    window.scrollTo(0, 0);
    var s = state, meta = EXAMS[s.exam], qmap = questionMap(s.exam);
    var total = s.items.length, correct = correctCount(s), p = pct(correct, total);
    var passed = p >= PASS_PCT;

    var byGroup = {};
    s.items.forEach(function (it) {
      var g = groupOf(qmap[it.qid].topic);
      byGroup[g] = byGroup[g] || { n: 0, ok: 0 };
      byGroup[g].n++;
      if (it.resp && it.resp.ok) byGroup[g].ok++;
    });
    var bars = Object.keys(byGroup).sort().map(function (g) {
      var b = byGroup[g], v = pct(b.ok, b.n);
      var color = v >= PASS_PCT ? "var(--ok)" : v >= 40 ? "var(--warn)" : "var(--bad)";
      return '<div class="bar-row"><div class="name"><span class="tcode">' + g + '</span>' + esc(meta.groups[g] || "") + '</div>' +
        '<div class="val">' + b.ok + '/' + b.n + ' · ' + v + '%</div>' +
        '<div class="track"><div class="fillbar" style="width:' + v + '%;background:' + color + '"></div></div></div>';
    }).join("");

    var wrong = s.items.filter(function (it) { return !it.resp || !it.resp.ok; });
    var review = wrong.map(function (it) {
      var q = qmap[it.qid], yours, right;
      if (q.type === "fill") {
        yours = it.resp ? esc(it.resp.text) : "";
        right = q.accept.map(esc).join("  |  ");
      } else {
        yours = it.resp ? it.resp.picked.map(function (i) { return esc(q.options[i].t); }).join("  +  ") : "";
        right = q.answer.map(function (i) { return esc(q.options[i].t); }).join("  +  ");
      }
      var whys = "";
      if (it.resp && q.type !== "fill") {
        whys = it.resp.picked.filter(function (i) { return q.answer.indexOf(i) === -1; }).map(function (i) {
          return '<div class="ans muted">↳ <b>' + esc(q.options[i].t) + '</b>: ' + rich(q.options[i].why) + '</div>';
        }).join("");
      }
      return '<div class="review-item"><span class="tag">' + esc(q.topic) + '</span>' +
        '<div class="q">' + rich(q.q) + '</div>' +
        (q.code ? '<pre class="code">' + esc(q.code) + '</pre>' : '') +
        '<div class="ans">Your answer: ' + (yours ? '<b>' + yours + '</b>' : '<span class="muted">skipped</span>') + '</div>' +
        whys +
        '<div class="ans">Correct: <b>' + right + '</b></div>' +
        (q.explain ? '<div class="ans muted">' + rich(q.explain) + '</div>' : '') + '</div>';
    }).join("");

    app.innerHTML =
      '<div class="stack">' +
      '<section class="card result-hero">' +
      '<div class="muted">' + esc(meta.title) + ' · ' + esc(meta.code) + '</div>' +
      '<div class="big ' + (passed ? 'pass' : 'fail') + '">' + p + '%</div>' +
      '<div>' + correct + ' of ' + total + ' correct · ' + (passed ? '<b class="pass">Likely pass</b>' : '<b class="fail">Below pass mark</b>') + '</div>' +
      '<div class="muted small">Pass mark shown is approximate (~' + PASS_PCT + '%). The real exam uses a scaled 200–800 score with 500 to pass.</div>' +
      '<div class="row actions">' +
      (wrong.length ? '<button class="btn primary" id="retryWrong">Retry ' + wrong.length + ' wrong</button>' : '') +
      '<button class="btn" id="newAttempt">New attempt</button>' +
      '<button class="btn ghost" id="reviewAll">Review all answers</button>' +
      '<button class="btn ghost" id="toHome">Choose exam</button></div>' +
      '</section>' +
      '<section class="card"><h2>By topic</h2><div class="bars">' + bars + '</div></section>' +
      (wrong.length ? '<section class="card"><h2>Missed questions (' + wrong.length + ')</h2>' + review + '</section>' : '') +
      '</div>';

    var rw = document.getElementById("retryWrong");
    if (rw) rw.addEventListener("click", function () { newAttempt(s.exam, shuffle(wrong.map(function (it) { return it.qid; }))); });
    document.getElementById("newAttempt").addEventListener("click", function () { var id = s.exam; state = null; renderSetup(id); });
    document.getElementById("toHome").addEventListener("click", function () { state = null; renderHome(); });
    document.getElementById("reviewAll").addEventListener("click", function () {
      // Re-open the finished attempt read-only at question 1 for browsing.
      s.finished = false;
      s.idx = 0;
      renderQuiz();
    });
  }

  // ---------- Boot ----------
  renderHome();
})();
