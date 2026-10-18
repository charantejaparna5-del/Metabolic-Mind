/* ==========================================================
   Metabolic Mind: myth-or-fact game
   Vanilla JS, no dependencies, no data leaves the page.
   Flow: intro -> worry -> routine -> 4 myth-or-fact cards -> readout + handoff
   ========================================================== */
(function () {
  "use strict";

  var STEER_URL = "https://steerclub.com/";

  /* ---------- Sources (each claim below is checked against these) ---------- */
  var SOURCES = {
    extension: {
      label: "Weight regain after withdrawal: the STEP 1 trial extension (Wilding et al., Diabetes, Obesity and Metabolism, 2022)",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9542252/"
    },
    body: {
      label: "STEP 1 body-composition (DEXA) analysis, an exploratory analysis",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8089287"
    },
    sideEffects: {
      label: "Understanding side effects of GLP-1 medicines (patient handout, lifestylemedicine.org)",
      url: "https://lifestylemedicine.org/wp-content/uploads/2026/07/Patient-Handout-Understanding-Side-Effects-of-GLP-1-Medicines.pdf"
    },
    asia: {
      label: "STAT News opinion essay (Kantipuly and Singer), 17 March 2026: BMI and South Asian bodies",
      url: "https://www.statnews.com/2026/03/17/generic-semaglutide-india-bmi-obesity-definition/"
    }
  };

  /* ---------- The four claims ---------- */
  var FACTS = [
    {
      id: "eligibility",
      statement: "GLP-1 medicines are only for people with diabetes.",
      answer: "myth",
      short: "No. The trial we cite enrolled adults without diabetes. A doctor decides if it fits you.",
      explain: "The large STEP 1 trial tested one in adults without diabetes who had a BMI of 30 or more, or 27 or more with a weight-related condition. Whether a medicine suits you is a doctor's call, made from your labs and history. For South Asian bodies, health risk can also show up at lower BMIs, so doctors look at more than one number.",
      steerLine: "At Steer, it starts with tests. Then a doctor decides if the programme fits, only when it's clinically right.",
      sources: [SOURCES.extension, SOURCES.asia]
    },
    {
      id: "sideeffects",
      statement: "Most side effects are in the stomach, and often ease as your body adjusts.",
      answer: "fact",
      short: "It can cause side effects, mostly digestive. A doctor screens you first and starts low.",
      explain: "Nausea, loose motions, constipation and bloating are the common ones, especially at the start or when the dose goes up. That's why providers start low and increase slowly. Less common problems exist too, and symptoms that don't settle need a call to your care team.",
      steerLine: "Safety first: screening and blood tests come before any medicine.",
      sources: [SOURCES.sideEffects]
    },
    {
      id: "muscle",
      statement: "On these medicines you lose only fat, never any lean mass.",
      answer: "myth",
      short: "Some lean mass is lost along with fat, so it's worth measuring and protecting.",
      explain: "In one trial's DEXA sub-study, total lean body mass fell by about 9.7%. Fat mass fell too, by more, so lean mass made up a bigger share of body weight afterwards (up about 3 percentage points). It's an exploratory analysis, but it shows that some lean mass does go.",
      steerLine: "That's why members get a DEXA scan, and the plan is built to protect muscle.",
      sources: [SOURCES.body]
    },
    {
      id: "regain",
      statement: "Once the weight is off, it stays off by itself.",
      answer: "myth",
      short: "Weight often returns after the medicine stops, so the plan after matters as much as the plan during.",
      explain: "In the STEP 1 follow-up, people who stopped the medicine and the lifestyle programme regained about two-thirds of the weight they'd lost within a year, with no active lifestyle support in that year. The authors describe obesity as chronic, which fits how common regain is. It's biology pushing back, not a willpower failing.",
      steerLine: "A planned exit: habits that last after the medicine stops.",
      sources: [SOURCES.extension]
    }
  ];

  var FACTS_BY_ID = {};
  FACTS.forEach(function (f) { FACTS_BY_ID[f.id] = f; });

  /* ---------- Worries and routines ---------- */
  var DOUBTS = {
    safety: {
      label: "Is it safe?", sub: "Side effects, and what a doctor checks first", factId: "sideeffects",
      doctorQs: [
        "Which side effects should I expect first, and which ones mean I should call you?",
        "Which tests do I need before starting anything?"
      ]
    },
    muscle: {
      label: "Will I lose muscle?", sub: "Strength, energy and body composition", factId: "muscle",
      doctorQs: [
        "How will you track my muscle and body composition during the programme?",
        "What should my meals and movement look like to protect muscle?"
      ]
    },
    regain: {
      label: "Will the weight come back?", sub: "Life after the medicine", factId: "regain",
      doctorQs: [
        "What is the plan for after the medicine stops?",
        "How will we spot early if weight starts creeping back?"
      ]
    },
    eligibility: {
      label: "Is it only for diabetics?", sub: "Who these medicines are for", factId: "eligibility",
      doctorQs: [
        "Do my numbers and history make me a candidate?",
        "Do you use different cut-offs for South Asian bodies?"
      ]
    },
    personal: {
      label: "Is it even for me?", sub: "I'm not sure it fits my life", factId: "eligibility",
      short: "A quiz can't tell you that. A doctor looks at your labs, history and goals, and will say so if it isn't right for you.",
      doctorQs: [
        "What would you check first to see if this fits me?",
        "What are my options if this isn't right for me?"
      ]
    }
  };

  var ROUTINES = {
    desk: {
      label: "Desk job, long hours", sub: "Chai at the desk, lunch on the move",
      doctorQ: "How should I plan meals and movement around long desk hours?"
    },
    home: {
      label: "Home and family meals", sub: "Roti, rice and dal are the staples",
      doctorQ: "How do we build the plan around the roti, rice and dal we already cook at home?"
    },
    shift: {
      label: "Shifts, travel or eating out", sub: "My routine keeps changing",
      doctorQ: "How does the plan work when my shifts, travel or eating out keep changing?"
    },
    social: {
      label: "Weddings and family dinners", sub: "A busy social calendar",
      doctorQ: "How do I handle weddings and family dinners without feeling like I'm on a diet?"
    }
  };

  /* ---------- Pure logic (unit-testable) ---------- */
  function factOrder(doubtKey) {
    var first = DOUBTS[doubtKey] ? DOUBTS[doubtKey].factId : FACTS[0].id;
    var rest = FACTS.filter(function (f) { return f.id !== first; });
    return [FACTS_BY_ID[first]].concat(rest);
  }

  function scoreGuesses(guesses) {
    return FACTS.reduce(function (n, f) { return n + (guesses[f.id] === f.answer ? 1 : 0); }, 0);
  }

  function orderedFacts(guesses) {
    var rows = FACTS.map(function (f) {
      return { fact: f, guess: guesses[f.id] || null, correct: guesses[f.id] === f.answer };
    });
    // Facts the person missed come first. Array order is stable otherwise.
    return rows.slice().sort(function (a, b) { return Number(a.correct) - Number(b.correct); });
  }

  function doctorQuestions(doubtKey, routineKey) {
    var d = DOUBTS[doubtKey], r = ROUTINES[routineKey];
    if (!d || !r) return [];
    return [d.doctorQs[0], d.doctorQs[1], r.doctorQ];
  }

  function buildHandoffUrl(doubtKey, routineKey, score) {
    var url = new URL(STEER_URL);
    url.searchParams.set("utm_source", "metabolic-mind");
    url.searchParams.set("utm_medium", "quiz");
    url.searchParams.set("utm_campaign", "myth-or-fact");
    url.searchParams.set("utm_content", "worry-" + doubtKey + "_routine-" + routineKey + "_score-" + score);
    return url.toString();
  }

  function buildSummary(state) {
    var d = DOUBTS[state.doubt], r = ROUTINES[state.routine];
    if (!d || !r) return "";
    var score = scoreGuesses(state.guesses);
    var qs = doctorQuestions(state.doubt, state.routine).map(function (q, i) { return (i + 1) + ". " + q; });
    return [
      "My Metabolic Mind summary",
      "Loudest worry: " + d.label,
      "My week: " + r.label,
      "Myth-or-fact: " + score + " of " + FACTS.length,
      "",
      "Questions I want to ask a doctor:"
    ].concat(qs).concat(["", "From steerclub.com. Educational only, not medical advice."]).join("\n");
  }

  var api = {
    FACTS: FACTS, DOUBTS: DOUBTS, ROUTINES: ROUTINES,
    factOrder: factOrder, scoreGuesses: scoreGuesses, orderedFacts: orderedFacts,
    doctorQuestions: doctorQuestions, buildHandoffUrl: buildHandoffUrl, buildSummary: buildSummary
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  /* ---------- DOM helpers ---------- */
  function h(tag, props) {
    var el = document.createElement(tag);
    var p = props || {};
    Object.keys(p).forEach(function (k) {
      var v = p[k];
      if (v === false || v === null || v === undefined) return;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k === "checked" || k === "disabled" || k === "hidden") el[k] = !!v;
      else el.setAttribute(k, v === true ? "" : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var kids = [].concat(arguments[i]);
      for (var j = 0; j < kids.length; j++) {
        var c = kids[j];
        if (c === null || c === undefined || c === false) continue;
        el.append(c.nodeType ? c : document.createTextNode(String(c)));
      }
    }
    return el;
  }

  function sourceLinks(sources) {
    var out = [];
    sources.forEach(function (s, i) {
      if (i > 0) out.push("; ");
      out.push(h("a", { href: s.url, target: "_blank", rel: "noopener noreferrer" }, s.label));
    });
    return out;
  }

  /* ---------- State ---------- */
  var TOTAL_STEPS = 6; // worry, routine, 4 claims
  var state = { view: "intro", index: 0, doubt: null, routine: null, guesses: {} };

  var game, stage, progress, progressBar, progressLabel, introHTML;

  function currentOrder() { return factOrder(state.doubt); }

  /* ---------- Mounting ---------- */
  function setView(view) {
    state.view = view;
    game.setAttribute("data-view", view);
    var inQuiz = view === "quiz";
    progress.hidden = !inQuiz;
    if (inQuiz) {
      var n = state.index + 1;
      progressLabel.textContent = "Step " + n + " of " + TOTAL_STEPS;
      progressBar.style.width = Math.round((n / TOTAL_STEPS) * 100) + "%";
      progress.querySelector("[role=progressbar]").setAttribute("aria-valuenow", String(n));
    }
  }

  function mount(node, focusSelector) {
    stage.replaceChildren(node);
    if (stage.scrollIntoView) stage.scrollIntoView({ block: "start" });
    var target = node.querySelector(focusSelector || "[data-focus]");
    if (target) target.focus({ preventScroll: true });
  }

  /* ---------- Screens ---------- */
  function showIntro(focus) {
    state.index = 0;
    stage.innerHTML = introHTML; // our own static markup, captured at start-up
    setView("intro");
    if (focus) {
      var t = stage.querySelector("[data-focus], h1");
      if (t) t.focus({ preventScroll: true });
    }
  }

  function renderStep() {
    setView("quiz");
    if (state.index === 0) return mount(choiceStep("doubt"));
    if (state.index === 1) return mount(choiceStep("routine"));
    return mount(mythStep(currentOrder()[state.index - 2]));
  }

  function choiceStep(kind) {
    var isDoubt = kind === "doubt";
    var data = isDoubt ? DOUBTS : ROUTINES;
    var selected = isDoubt ? state.doubt : state.routine;
    var title = isDoubt ? "Which worry is loudest in your head?" : "What does a normal week look like?";
    var help = isDoubt
      ? "The one you'd ask a friend about over chai. Pick one."
      : "No right answer. This only helps tailor the questions you'll take to a doctor.";

    var options = Object.keys(data).map(function (key) {
      var item = data[key];
      var input = h("input", { type: "radio", name: kind, value: key, checked: selected === key });
      return h("label", { class: "option" + (selected === key ? " is-checked" : "") },
        input,
        h("span", {},
          h("span", { class: "option-title" }, item.label),
          h("span", { class: "option-sub" }, item.sub)));
    });

    return h("section", { class: "step", "aria-labelledby": "stepTitle" },
      h("p", { class: "kicker" }, "Step " + (state.index + 1) + " of " + TOTAL_STEPS),
      h("h2", { id: "stepTitle", tabindex: "-1", "data-focus": true }, title),
      h("p", { class: "help" }, help),
      h("fieldset", { class: "options" },
        h("legend", { class: "sr-only" }, title),
        options),
      h("div", { class: "nav" },
        h("button", { class: "btn btn-ghost", type: "button", "data-action": "back" }, "Back"),
        h("button", { class: "btn btn-primary", type: "button", "data-action": "next", disabled: !selected }, "Continue")));
  }

  function revealNode(fact, guess) {
    var correct = guess === fact.answer;
    var verdict = correct
      ? "You called it: it's a " + fact.answer + "."
      : "Plenty of people guess otherwise. It's a " + fact.answer + ".";
    return h("div", { class: "reveal", id: "reveal", tabindex: "-1" },
      h("p", { class: "reveal-verdict" }, verdict),
      h("p", {}, fact.explain),
      h("p", { class: "steer-line" }, fact.steerLine),
      h("p", { class: "source-line" }, "Source: ", sourceLinks(fact.sources)));
  }

  function mythStep(fact) {
    var n = state.index - 1; // 1..4
    var guess = state.guesses[fact.id] || null;
    var last = state.index === TOTAL_STEPS - 1;

    function verdictBtn(value, label) {
      return h("button", {
        class: "btn btn-verdict" + (guess === value ? " is-chosen" : ""),
        type: "button", "data-action": "guess", "data-guess": value,
        "aria-pressed": guess ? String(guess === value) : "false",
        disabled: !!guess
      }, label);
    }

    return h("section", { class: "step", "aria-labelledby": "stepTitle" },
      h("p", { class: "kicker" }, "Myth or fact? Claim " + n + " of " + FACTS.length),
      h("h2", { id: "stepTitle", class: "statement", tabindex: "-1", "data-focus": true }, "\u201C" + fact.statement + "\u201D"),
      h("div", { class: "verdicts", role: "group", "aria-labelledby": "stepTitle" },
        verdictBtn("myth", "Myth"), verdictBtn("fact", "Fact")),
      h("div", { id: "revealSlot" }, guess ? revealNode(fact, guess) : null),
      h("div", { class: "nav" },
        h("button", { class: "btn btn-ghost", type: "button", "data-action": "back" }, "Back"),
        h("button", { class: "btn btn-primary", type: "button", "data-action": "next", hidden: !guess },
          last ? "See my readout" : "Next claim")));
  }

  function renderResults() {
    var d = DOUBTS[state.doubt], r = ROUTINES[state.routine];
    if (!d || !r) return showIntro(true);
    setView("results");

    var score = scoreGuesses(state.guesses);
    var main = FACTS_BY_ID[d.factId];
    var rows = orderedFacts(state.guesses);
    var qs = doctorQuestions(state.doubt, state.routine);

    var factItems = rows.map(function (row) {
      var f = row.fact;
      var note = row.guess
        ? "You said " + row.guess + ". " + (row.correct ? "Right." : "Worth knowing.")
        : "";
      return h("details", { open: !row.correct },
        h("summary", {}, "\u201C" + f.statement + "\u201D"),
        h("div", { class: "fact-body" },
          h("p", { class: "guess-note" }, note + " It's a " + f.answer + "."),
          h("p", {}, f.explain),
          h("p", { class: "source-line" }, "Source: ", sourceLinks(f.sources))));
    });

    var node = h("section", { class: "step results", "aria-labelledby": "stepTitle" },
      h("div", {},
        h("p", { class: "kicker" }, "Your readout"),
        h("h2", { id: "stepTitle", tabindex: "-1", "data-focus": true },
          "You called ", h("em", {}, score + " of " + FACTS.length), ". Here's what to take with you.")),

      h("div", { class: "answer-card" },
        h("p", { class: "kicker" }, "Your loudest worry"),
        h("h3", {}, d.label),
        h("p", {}, d.short || main.short),
        h("p", { class: "steer-line" }, main.steerLine)),

      h("div", { class: "facts" },
        h("h3", {}, "All four claims, with sources"),
        factItems),

      h("div", {},
        h("h3", {}, "Three questions to take to a doctor"),
        h("p", { class: "help" }, "Built from your worry and your week."),
        h("ol", { class: "questions" }, qs.map(function (q) { return h("li", {}, q); }))),

      h("div", { class: "handoff on-maroon" },
        h("p", { class: "kicker" }, "Next step, only if you want it"),
        h("h3", {}, "Want a doctor to look at ", h("em", {}, "your"), " numbers?"),
        h("p", {}, "Steer starts with diagnostics, then a doctor decides if the programme fits you. If it isn't right for you, they'll say so."),
        h("p", { class: "aside" }, "No obligation. Ask away."),
        h("div", { class: "handoff-actions" },
          h("a", {
            class: "btn btn-light", id: "handoffLink", href: buildHandoffUrl(state.doubt, state.routine, score),
            target: "_blank", rel: "noopener noreferrer"
          }, "See if the programme fits you"),
          h("button", { class: "btn btn-outline-light", type: "button", "data-action": "copy" }, "Copy my summary")),
        h("p", { class: "copy-status", id: "copyStatus", role: "status" }),
        h("textarea", { id: "summaryText", readonly: true, hidden: true, "aria-label": "Your summary, ready to copy" })),

      h("div", { class: "replay" },
        h("button", { class: "btn btn-ghost", type: "button", "data-action": "restart" }, "Play again")));

    mount(node);
  }

  /* ---------- Events ---------- */
  function onClick(e) {
    var btn = e.target.closest("[data-action]");
    if (!btn || !stage.contains(btn) || btn.disabled) return;
    var action = btn.getAttribute("data-action");

    if (action === "start") { state.index = 0; renderStep(); }
    else if (action === "back") {
      if (state.index > 0) { state.index--; renderStep(); } else showIntro(true);
    }
    else if (action === "next") {
      if (state.index === 0 && !state.doubt) return;
      if (state.index === 1 && !state.routine) return;
      if (state.index >= 2 && !state.guesses[currentOrder()[state.index - 2].id]) return;
      if (state.index < TOTAL_STEPS - 1) { state.index++; renderStep(); } else renderResults();
    }
    else if (action === "guess") {
      var fact = currentOrder()[state.index - 2];
      if (!fact || state.guesses[fact.id]) return;
      state.guesses[fact.id] = btn.getAttribute("data-guess");
      // Re-render this card in its answered state, then move focus to the explanation.
      var node = mythStep(fact);
      stage.replaceChildren(node);
      var reveal = node.querySelector("#reveal");
      if (reveal) reveal.focus({ preventScroll: false });
    }
    else if (action === "restart") {
      state = { view: "intro", index: 0, doubt: null, routine: null, guesses: {} };
      showIntro(true);
    }
    else if (action === "copy") copySummary();
  }

  function onChange(e) {
    var input = e.target;
    if (!input || input.type !== "radio") return;
    if (input.name === "doubt") state.doubt = input.value;
    if (input.name === "routine") state.routine = input.value;
    var group = stage.querySelectorAll("input[name=" + input.name + "]");
    for (var i = 0; i < group.length; i++) {
      group[i].closest(".option").classList.toggle("is-checked", group[i].checked);
    }
    var next = stage.querySelector("[data-action=next]");
    if (next) next.disabled = false;
  }

  function copySummary() {
    var text = buildSummary(state);
    var status = document.getElementById("copyStatus");
    var box = document.getElementById("summaryText");

    function fallback() {
      box.hidden = false;
      box.value = text;
      box.focus();
      box.select();
      status.textContent = "Couldn't copy automatically. The text is selected, so copy it from here.";
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        status.textContent = "Copied. Paste it into WhatsApp or share it with your doctor.";
      }, fallback);
    } else {
      fallback();
    }
  }

  /* ---------- Start-up ---------- */
  function init() {
    game = document.getElementById("game");
    stage = document.getElementById("stage");
    progress = document.getElementById("progress");
    progressBar = document.getElementById("progressBar");
    progressLabel = document.getElementById("progressLabel");
    if (!game || !stage || !progress || !progressBar || !progressLabel) throw new Error("Game markup is missing");
    var intro = stage.querySelector(".intro");
    introHTML = intro ? intro.outerHTML : "";
    if (!introHTML) throw new Error("Intro markup is missing");
    stage.addEventListener("click", onClick);
    stage.addEventListener("change", onChange);
  }

  function start() {
    try {
      init();
    } catch (err) {
      var stageEl = document.getElementById("stage");
      if (stageEl) {
        stageEl.replaceChildren(h("div", { class: "noscript", role: "alert" },
          h("h2", {}, "Something went wrong"),
          h("p", {}, "The game didn't load. Please refresh the page and try again.")));
      }
      if (window.console) console.error(err);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
