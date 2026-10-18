(() => {
  "use strict";

  // ============================================
  // METABOLIC MIND — STEER HACKATHON
  // Educational quiz, not a medical assessment.
  // ============================================

  const STEER_URL = "https://steerclub.com/";

  const SOURCES = {
    extension: {
      title: "STEP 1 trial extension — weight regain",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9542252/",
      detail:
        "Follow-up study of participants who stopped semaglutide and structured lifestyle intervention."
    },

    body: {
      title: "STEP 1 body-composition analysis",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8089287/",
      detail:
        "Exploratory body-composition analysis using DEXA in a subset of trial participants."
    },

    sideEffects: {
      title: "Understanding side effects of GLP-1 medicines",
      url:
        "https://lifestylemedicine.org/wp-content/uploads/2026/07/Patient-Handout-Understanding-Side-Effects-of-GLP-1-Medicines.pdf",
      detail:
        "Patient education handout. Discuss individual symptoms and medication risks with a healthcare professional."
    },

    eligibility: {
      title: "STEP 1 trial publication",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8089287/",
      detail:
        "The STEP 1 study investigated semaglutide in adults with overweight or obesity without diabetes."
    }
  };

  // ============================================
  // QUIZ QUESTIONS
  // ============================================

  const FACTS = [
    {
      id: "eligibility",

      category: "ELIGIBILITY",

      statement:
        "GLP-1 medicines are only for people who have diabetes.",

      answer: "Myth",

      short: "Diabetes isn't the only possible reason",

      explanation:
        "Some GLP-1 medicines are also prescribed for chronic weight management in eligible people without diabetes. Eligibility depends on the particular medicine, its approved use, medical history and a clinician's assessment. The STEP 1 trial studied semaglutide in adults with overweight or obesity who did not have diabetes.",

      takeaway:
        "A doctor should determine whether a particular treatment is appropriate for you.",

      doctorQuestions: [
        "Am I eligible for a weight-management treatment based on my medical history?",
        "What benefits and risks would this treatment have for me?",
        "Are there other treatment options I should consider?"
      ],

      sources: ["eligibility"]
    },

    {
      id: "sideEffects",

      category: "SIDE EFFECTS",

      statement:
        "Digestive side effects can happen with GLP-1 medicines and may improve over time.",

      answer: "Fact",

      short: "Digestive side effects can occur",

      explanation:
        "Nausea, vomiting, diarrhoea and constipation are among the possible gastrointestinal side effects of some GLP-1 medicines. Symptoms may improve over time, but this is not guaranteed. Side effects, precautions and serious risks differ by medicine. Never change your dose or stop treatment without appropriate medical guidance.",

      takeaway:
        "Ask your clinician what to expect, which symptoms need urgent attention, and whom to contact if symptoms persist.",

      doctorQuestions: [
        "Which side effects are common with the specific medicine being considered?",
        "Which symptoms mean I should contact a clinician urgently?",
        "How should side effects be managed safely?"
      ],

      sources: ["sideEffects"]
    },

    {
      id: "muscle",

      category: "BODY COMPOSITION",

      statement:
        "When people lose weight using these medicines, they lose fat but never lose lean body mass.",

      answer: "Myth",

      short: "Lean body mass can also decrease",

      explanation:
        "In an exploratory DEXA analysis of a subset of STEP 1 participants receiving semaglutide, total fat mass decreased and lean body mass also decreased. Lean body mass is not the same as skeletal muscle alone. The findings do not predict exactly what will happen to every individual.",

      takeaway:
        "Discuss nutrition, adequate protein intake and suitable resistance exercise with your healthcare professional.",

      doctorQuestions: [
        "How can I monitor changes in body composition during weight loss?",
        "What nutrition and protein targets are suitable for me?",
        "Would resistance training be appropriate for my circumstances?"
      ],

      sources: ["body"]
    },

    {
      id: "regain",

      category: "LONG-TERM RESULTS",

      statement:
        "Once weight is lost, it will always stay off after stopping the medicine.",

      answer: "Myth",

      short: "Weight regain can happen",

      explanation:
        "In the STEP 1 extension, participants regained approximately two-thirds of their previous weight loss during the year after semaglutide and the structured lifestyle intervention were discontinued. This was a particular study population and follow-up period, not a prediction for every person.",

      takeaway:
        "Before starting treatment, discuss long-term management, follow-up and what the plan might be if treatment changes.",

      doctorQuestions: [
        "What is the long-term plan if I start this treatment?",
        "What should I expect if treatment is stopped or changed?",
        "How will we maintain progress and monitor my health over time?"
      ],

      sources: ["extension"]
    }
  ];

  // ============================================
  // PERSONALIZATION OPTIONS
  // ============================================

  const DOUBTS = [
    {
      id: "safety",
      label: "Safety and side effects",
      description: "I want to understand the risks.",
      factId: "sideEffects"
    },
    {
      id: "muscle",
      label: "Muscle loss",
      description: "I am concerned about losing muscle.",
      factId: "muscle"
    },
    {
      id: "regain",
      label: "Weight regain",
      description: "I want to understand long-term results.",
      factId: "regain"
    },
    {
      id: "eligibility",
      label: "Eligibility",
      description: "I want to know who these medicines are for.",
      factId: "eligibility"
    },
    {
      id: "personal",
      label: "I have several questions",
      description: "Help me prepare for a doctor conversation.",
      factId: "eligibility"
    }
  ];

  const ROUTINES = [
    {
      id: "desk",
      label: "Mostly sitting or studying",
      description: "Long hours at a desk."
    },
    {
      id: "home",
      label: "Mostly home-cooked meals",
      description: "Meals such as rice, roti, dal and vegetables."
    },
    {
      id: "shift",
      label: "Irregular hours",
      description: "Shifts, travel or changing routines."
    },
    {
      id: "social",
      label: "Family meals and social events",
      description: "My routine changes during gatherings."
    }
  ];

  // ============================================
  // DOM REFERENCES
  // ============================================

  const game = document.querySelector(".game");
  const stage = document.getElementById("stage");
  const progress = document.getElementById("progress");
  const progressLabel = document.getElementById("progressLabel");
  const progressBar = document.getElementById("progressBar");

  if (!game || !stage) {
    console.error(
      "Metabolic Mind: Required .game and #stage elements were not found."
    );
    return;
  }

  const TOTAL_STEPS = 6;

  const state = {
    view: "intro",
    index: 0,
    doubt: null,
    routine: null,
    guesses: {}
  };

  const factById = Object.fromEntries(
    FACTS.map((fact) => [fact.id, fact])
  );

  // ============================================
  // SAFE DOM HELPERS
  // ============================================

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      element.textContent = text;
    }

    return element;
  }

  function createButton(text, action, className = "btn btn-primary") {
    const button = createElement("button", className, text);

    button.type = "button";
    button.dataset.action = action;

    return button;
  }

  function createLink(text, url) {
    const link = createElement("a", "", text);

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    return link;
  }

  function createParagraph(text, className = "") {
    return createElement("p", className, text);
  }

  function focusElement(element) {
    if (!element) return;

    requestAnimationFrame(() => {
      element.focus({ preventScroll: true });
    });
  }

  function mount(content, focusSelector = "h2") {
    stage.replaceChildren(content);

    if (focusSelector) {
      focusElement(stage.querySelector(focusSelector));
    }
  }

  // ============================================
  // VIEW AND PROGRESS
  // ============================================

  function setView(view) {
  state.view = view;
  game.dataset.view = view;

  if (progress) {
    progress.hidden = view !== "quiz";
  }

  if (view !== "quiz") {
    return;
  }

  const stepNumber = state.index + 1;

  if (progressLabel) {
    progressLabel.textContent =
      `Step ${stepNumber} of ${TOTAL_STEPS}`;
  }

  if (progressBar) {
    const percentage = (stepNumber / TOTAL_STEPS) * 100;

    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute("aria-valuenow", stepNumber);
  }
}
  // ============================================
  // INTRO
  // ============================================

  function showIntro() {
    setView("intro");

    const intro = createElement("section", "step intro");

    const kicker = createElement(
      "p",
      "kicker",
      "A 60-second myth-or-fact game"
    );

    const heading = createElement(
      "h1",
      "",
      "GLP-1: What's fact, and what's fiction?"
    );

    heading.tabIndex = -1;

    const lede = createParagraph(
      "Muscle loss? Side effects? Weight regain? Test what you know in four quick questions. Get research-based explanations and questions to discuss with your doctor.",
      "lede"
    );

    const start = createButton(
      "Test my knowledge →",
      "start",
      "btn btn-primary btn-large"
    );

    const chips = createElement("ul", "chips");

    [
      "4 quick questions",
      "No login required",
      "Sources included"
    ].forEach((label) => {
      chips.append(createElement("li", "", label));
    });

    const aside = createElement(
      "p",
      "aside",
      "Curiosity first. Evidence before assumptions."
    );

    intro.append(kicker, heading, lede, start, chips, aside);

    mount(intro, "h1");
  }

  // ============================================
  // STEP 1: CHOOSE YOUR MAIN QUESTION
  // ============================================

  function renderDoubtStep() {
    setView("quiz");

    const section = createElement("section", "step");

    const kicker = createElement(
      "p",
      "kicker",
      "FIRST, LET'S START WITH YOU"
    );

    const heading = createElement(
      "h2",
      "",
      "What are you most curious about?"
    );

    heading.tabIndex = -1;

    const help = createParagraph(
      "Choose the topic you'd most like to understand."
    );

    const form = createElement("div", "options");

    DOUBTS.forEach((doubt) => {
      const label = createElement("label", "option");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "doubt";
      input.value = doubt.id;
      input.checked = state.doubt === doubt.id;

      const textWrap = createElement("span", "");

      textWrap.append(
        createElement("span", "option-title", doubt.label),
        createElement("span", "option-sub", doubt.description)
      );

      label.append(input, textWrap);

      if (input.checked) {
        label.classList.add("is-checked");
      }

      form.append(label);
    });

    const nav = createElement("div", "nav");

    const next = createButton("Continue →", "next");
    next.disabled = !state.doubt;

    nav.append(next);

    section.append(kicker, heading, help, form, nav);

    mount(section, "h2");
  }

  // ============================================
  // STEP 2: CHOOSE YOUR ROUTINE
  // ============================================

  function renderRoutineStep() {
    setView("quiz");

    const section = createElement("section", "step");

    const kicker = createElement(
      "p",
      "kicker",
      "YOUR EVERYDAY ROUTINE"
    );

    const heading = createElement(
      "h2",
      "",
      "What does a typical day look like?"
    );

    heading.tabIndex = -1;

    const help = createParagraph(
      "This helps tailor the questions you can take to your doctor."
    );

    const form = createElement("div", "options");

    ROUTINES.forEach((routine) => {
      const label = createElement("label", "option");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "routine";
      input.value = routine.id;
      input.checked = state.routine === routine.id;

      const textWrap = createElement("span", "");

      textWrap.append(
        createElement("span", "option-title", routine.label),
        createElement("span", "option-sub", routine.description)
      );

      label.append(input, textWrap);

      if (input.checked) {
        label.classList.add("is-checked");
      }

      form.append(label);
    });

    const nav = createElement("div", "nav");

    nav.append(
      createButton("← Back", "back", "btn btn-ghost"),
      createButton("Start the quiz →", "next")
    );

    section.append(kicker, heading, help, form, nav);

    mount(section, "h2");
  }

  // ============================================
  // ORDER QUESTIONS BY USER'S MAIN CONCERN
  // ============================================

  function getOrderedFacts() {
    const selectedDoubt = DOUBTS.find(
      (item) => item.id === state.doubt
    );

    if (!selectedDoubt) {
      return [...FACTS];
    }

    const priority = factById[selectedDoubt.factId];

    return [
      priority,
      ...FACTS.filter((fact) => fact.id !== selectedDoubt.factId)
    ];
  }

  function getFactForStep() {
    const ordered = getOrderedFacts();

    // Step indexes 2, 3, 4 and 5 correspond to the four facts.
    return ordered[state.index - 2];
  }

  // ============================================
  // SOURCE LINKS
  // ============================================

  function createSources(sourceIds) {
    const wrapper = createElement("div", "source-list");

    wrapper.append(
      createElement("p", "source-line", "Research and further reading:")
    );

    const list = createElement("ul", "source-links");

    sourceIds.forEach((sourceId) => {
      const source = SOURCES[sourceId];

      if (!source) return;

      const item = createElement("li", "");

      item.append(createLink(source.title, source.url));

      if (source.detail) {
        item.append(
          createParagraph(source.detail, "source-line")
        );
      }

      list.append(item);
    });

    wrapper.append(list);

    return wrapper;
  }

  // ============================================
  // STEP 3–6: MYTH OR FACT
  // ============================================

  function renderFactStep() {
    setView("quiz");

    const fact = getFactForStep();

    if (!fact) {
      renderResults();
      return;
    }

    const section = createElement("section", "step");

    const kicker = createElement(
      "p",
      "kicker",
      `QUESTION ${state.index - 1} OF 4 · ${fact.category}`
    );

    const heading = createElement(
      "h2",
      "",
      "Myth or fact?"
    );

    heading.tabIndex = -1;

    const statement = createElement(
      "p",
      "statement",
      `“${fact.statement}”`
    );

    const verdicts = createElement("div", "verdicts");

    const mythButton = createButton(
      "Myth",
      "guess",
      "btn btn-verdict"
    );

    mythButton.dataset.answer = "Myth";

    const factButton = createButton(
      "Fact",
      "guess",
      "btn btn-verdict"
    );

    factButton.dataset.answer = "Fact";

    verdicts.append(mythButton, factButton);

    const nav = createElement("div", "nav");

    const back = createButton(
      "← Back",
      "back",
      "btn btn-ghost"
    );

    nav.append(back);

    section.append(kicker, heading, statement, verdicts);

    const previousGuess = state.guesses[fact.id];

    if (previousGuess) {
      revealAnswer(section, fact, previousGuess);
    } else {
      const hint = createParagraph(
        "Choose an answer to reveal the explanation and sources.",
        "help"
      );

      section.append(hint);
    }

    const next = createButton(
      state.index === TOTAL_STEPS - 1
        ? "See my results →"
        : "Next question →",
      "next"
    );

    next.disabled = !previousGuess;

    nav.append(next);

    section.append(nav);

    mount(section, "h2");

    // Restore selected answer styling after returning to a question.
    if (previousGuess) {
      const chosen = stage.querySelector(
        `[data-answer="${previousGuess}"]`
      );

      if (chosen) {
        chosen.classList.add("is-chosen");
      }
    }
  }

  // ============================================
  // ANSWER EXPLANATION
  // ============================================

  function revealAnswer(section, fact, guess) {
    const reveal = createElement("div", "reveal");

    reveal.setAttribute("aria-live", "polite");
    reveal.tabIndex = -1;

    const correct = guess === fact.answer;

    const verdict = createElement(
      "p",
      "reveal-verdict",
      correct
        ? "✓ You got it!"
        : "Here's the evidence."
    );

    const answer = createParagraph(
      `Answer: ${fact.answer}`
    );

    const explanation = createParagraph(fact.explanation);

    const takeaway = createParagraph(
      fact.takeaway,
      "steer-line"
    );

    reveal.append(
      verdict,
      answer,
      explanation,
      takeaway,
      createSources(fact.sources)
    );

    section.append(reveal);

    return reveal;
  }

  // ============================================
  // RESULT HELPERS
  // ============================================

  function calculateScore() {
    return FACTS.reduce((score, fact) => {
      return score + (
        state.guesses[fact.id] === fact.answer ? 1 : 0
      );
    }, 0);
  }

  function getScoreMessage(score) {
    if (score === 4) {
      return {
        title: "4 out of 4 — excellent!",
        message:
          "You identified all four answers. Keep checking evidence and remember that individual treatment decisions belong with a qualified clinician."
      };
    }

    if (score === 3) {
      return {
        title: "3 out of 4 — great work!",
        message:
          "You understood most of these claims. Review the remaining explanation to strengthen your understanding."
      };
    }

    if (score === 2) {
      return {
        title: "2 out of 4 — a good start",
        message:
          "Health claims can be confusing. Read the explanations and sources to learn more about the topics you missed."
      };
    }

    return {
      title: `${score} out of 4 — let's learn together`,
      message:
        "There is a lot of conflicting information about these medicines. Explore each explanation and use the doctor questions to guide a conversation with a healthcare professional."
    };
  }

  function getSelectedDoubt() {
    return DOUBTS.find((item) => item.id === state.doubt)
      || DOUBTS[DOUBTS.length - 1];
  }

  function getSelectedRoutine() {
    return ROUTINES.find((item) => item.id === state.routine)
      || ROUTINES[0];
  }

  function getDoctorQuestions() {
    const selectedDoubt = getSelectedDoubt();
    const selectedRoutine = getSelectedRoutine();

    const mainFact = factById[selectedDoubt.factId];

    const questions = [...mainFact.doctorQuestions];

    if (selectedRoutine.id === "desk") {
      questions.push(
        "What physical activity goals would be realistic for my daily routine?"
      );
    } else if (selectedRoutine.id === "home") {
      questions.push(
        "How can I build a balanced meal plan that fits my food preferences?"
      );
    } else if (selectedRoutine.id === "shift") {
      questions.push(
        "How can I plan meals, sleep and medication routines around changing hours?"
      );
    } else if (selectedRoutine.id === "social") {
      questions.push(
        "How can I manage my routine during social events without an all-or-nothing approach?"
      );
    }

    return questions;
  }

  // ============================================
  // SUMMARY FOR COPYING
  // ============================================

  function buildSummary() {
    const selectedDoubt = getSelectedDoubt();
    const selectedRoutine = getSelectedRoutine();
    const score = calculateScore();

    const lines = [
      "METABOLIC MIND — QUIZ SUMMARY",
      "",
      `Score: ${score}/4`,
      `Main concern: ${selectedDoubt.label}`,
      `Routine: ${selectedRoutine.label}`,
      "",
      "QUESTIONS TO DISCUSS WITH A HEALTHCARE PROFESSIONAL:"
    ];

    getDoctorQuestions().forEach((question, index) => {
      lines.push(`${index + 1}. ${question}`);
    });

    lines.push(
      "",
      "This is an educational quiz, not a diagnosis or treatment recommendation.",
      "Source: Metabolic Mind"
    );

    return lines.join("\n");
  }

  // ============================================
  // RESULTS SCREEN
  // ============================================

  function renderResults() {
    setView("results");

    const section = createElement("section", "step results");

    const kicker = createElement(
      "p",
      "kicker",
      "YOUR RESULTS"
    );

    const heading = createElement(
      "h2",
      "",
      "Knowledge grows one question at a time."
    );

    heading.tabIndex = -1;

    const score = calculateScore();
    const scoreMessage = getScoreMessage(score);

    const scoreCard = createElement("div", "answer-card");

    scoreCard.append(
      createElement("p", "kicker", "YOUR QUIZ SCORE"),
      createElement("h3", "", scoreMessage.title),
      createParagraph(scoreMessage.message),
      createParagraph(
        "This score reflects your answers to these four questions only. It does not assess your health or determine whether a medicine is suitable for you.",
        "guess-note"
      )
    );

    // Personalized topic.
    const doubt = getSelectedDoubt();
    const routine = getSelectedRoutine();

    const personalized = createElement(
      "div",
      "answer-card"
    );

    personalized.append(
      createElement("h3", "", "Your focus"),
      createParagraph(
        `You chose: ${doubt.label}.`
      ),
      createParagraph(
        `Your selected routine: ${routine.label}.`
      ),
      createParagraph(
        "Use these selections to help prepare for a conversation with a healthcare professional. They do not determine your eligibility for treatment."
      )
    );

    // Review all answers.
    const factsSection = createElement("section", "facts");

    factsSection.append(
      createElement("h3", "", "Review all four claims")
    );

    const ordered = getOrderedFacts();

    ordered.forEach((fact) => {
      const details = document.createElement("details");

      const summary = createElement(
        "summary",
        "",
        `${state.guesses[fact.id] === fact.answer ? "✓" : "↗"} ${fact.category}: ${fact.answer}`
      );

      const body = createElement("div", "fact-body");

      body.append(
        createElement("p", "option-title", fact.statement),
        createParagraph(`Your answer: ${state.guesses[fact.id]}`),
        createParagraph(`Evidence-based answer: ${fact.answer}`),
        createParagraph(fact.explanation),
        createParagraph(fact.takeaway, "steer-line"),
        createSources(fact.sources)
      );

      details.append(summary, body);

      // Open the claims the user answered incorrectly.
      if (state.guesses[fact.id] !== fact.answer) {
        details.open = true;
      }

      factsSection.append(details);
    });

    // Doctor questions.
    const questionSection = createElement(
      "section",
      "answer-card"
    );

    questionSection.append(
      createElement("h3", "", "Questions to take to your doctor"),
      createParagraph(
        "These are conversation starters, not personalized medical advice."
      )
    );

    const questionList = createElement("ol", "questions");

    getDoctorQuestions().forEach((question) => {
      questionList.append(
        createElement("li", "", question)
      );
    });

    questionSection.append(questionList);

    const copyButton = createButton(
      "Copy my summary",
      "copy",
      "btn btn-primary"
    );

    const copyStatus = createElement(
      "p",
      "copy-status",
      ""
    );

    copyStatus.id = "copyStatus";
    copyStatus.setAttribute("role", "status");
    copyStatus.setAttribute("aria-live", "polite");

    const summaryText = document.createElement("textarea");

    summaryText.id = "summaryText";
    summaryText.readOnly = true;
    summaryText.hidden = true;
    summaryText.setAttribute(
      "aria-label",
      "Quiz summary for copying"
    );

    questionSection.append(
      copyButton,
      copyStatus,
      summaryText
    );

    // Handoff section.
    const handoff = createElement("section", "handoff");

    handoff.append(
      createElement("p", "kicker", "YOUR NEXT STEP"),
      createElement("h3", "", "Take your questions to a healthcare professional"),
      createParagraph(
        "Use what you learned to have an informed conversation. A qualified clinician can help you understand appropriate options, benefits, risks and alternatives."
      )
    );

    const actions = createElement("div", "handoff-actions");

    const steerLink = createElement(
      "a",
      "btn btn-light",
      "Visit Steer →"
    );

    steerLink.href = STEER_URL;
    steerLink.target = "_blank";
    steerLink.rel = "noopener noreferrer";

    const restart = createButton(
      "Play again",
      "restart",
      "btn btn-outline-light"
    );

    actions.append(steerLink, restart);

    handoff.append(actions);

    const disclaimer = createParagraph(
      "Educational information only. This quiz does not diagnose a condition, establish treatment eligibility or replace medical advice. Medication approvals and recommendations differ by product and country."
    );

    disclaimer.className = "guess-note";

    section.append(
      kicker,
      heading,
      scoreCard,
      personalized,
      factsSection,
      questionSection,
      handoff,
      disclaimer
    );

    mount(section, "h2");
  }

  // ============================================
  // NAVIGATION
  // ============================================

  function renderCurrentStep() {
    if (state.index === 0) {
      renderDoubtStep();
    } else if (state.index === 1) {
      renderRoutineStep();
    } else if (state.index >= 2 && state.index < TOTAL_STEPS) {
      renderFactStep();
    } else {
      renderResults();
    }
  }

  function startQuiz() {
    state.index = 0;
    state.doubt = null;
    state.routine = null;
    state.guesses = {};

    renderCurrentStep();
  }

  function goBack() {
    if (state.view !== "quiz") return;

    if (state.index === 0) {
      showIntro();
      return;
    }

    state.index -= 1;

    renderCurrentStep();
  }

  function goNext() {
    if (state.view !== "quiz") return;

    if (state.index === 0 && !state.doubt) {
      const heading = stage.querySelector("h2");
      if (heading) {
        heading.textContent =
          "Choose a topic before continuing.";
        focusElement(heading);
      }
      return;
    }

    if (state.index === 1 && !state.routine) {
      const heading = stage.querySelector("h2");
      if (heading) {
        heading.textContent =
          "Choose the routine that best describes your day.";
        focusElement(heading);
      }
      return;
    }

    if (state.index >= 2) {
      const fact = getFactForStep();

      if (!fact || !state.guesses[fact.id]) {
        const hint = stage.querySelector(".help");

        if (hint) {
          hint.textContent =
            "Choose Myth or Fact before moving to the next question.";
        }

        return;
      }
    }

    if (state.index < TOTAL_STEPS - 1) {
      state.index += 1;
      renderCurrentStep();
    } else {
      renderResults();
    }
  }

  // ============================================
  // ANSWER SELECTION
  // ============================================

  function chooseAnswer(answer) {
    const fact = getFactForStep();

    if (!fact || !["Myth", "Fact"].includes(answer)) {
      return;
    }

    // Save or update the answer.
    state.guesses[fact.id] = answer;

    renderFactStep();
  }

  // ============================================
  // COPY SUMMARY
  // ============================================

  async function copySummary() {
    const summary = buildSummary();

    const status = document.getElementById("copyStatus");
    const textarea = document.getElementById("summaryText");

    try {
      await navigator.clipboard.writeText(summary);

      if (status) {
        status.textContent =
          "Summary copied. You can paste it into your notes.";
      }

      return;
    } catch (error) {
      // Clipboard API may be unavailable on some browsers.
    }

    if (textarea) {
      textarea.hidden = false;
      textarea.value = summary;
      textarea.focus();
      textarea.select();

      let copied = false;

      try {
        copied = document.execCommand("copy");
      } catch (error) {
        copied = false;
      }

      if (status) {
        status.textContent = copied
          ? "Summary copied."
          : "Select the text above and copy it manually.";
      }
    }
  }

  // ============================================
  // EVENT DELEGATION
  // ============================================

  stage.addEventListener("change", (event) => {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    if (input.name === "doubt") {
      state.doubt = input.value;

      stage.querySelectorAll('input[name="doubt"]').forEach((item) => {
        item.closest(".option")?.classList.toggle(
          "is-checked",
          item.checked
        );
      });

      const next = stage.querySelector('[data-action="next"]');

      if (next) {
        next.disabled = !state.doubt;
      }
    }

    if (input.name === "routine") {
      state.routine = input.value;

      stage.querySelectorAll('input[name="routine"]').forEach((item) => {
        item.closest(".option")?.classList.toggle(
          "is-checked",
          item.checked
        );
      });
    }
  });

  stage.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");

    if (!button || !stage.contains(button)) {
      return;
    }

    const action = button.dataset.action;

    switch (action) {
      case "start":
        startQuiz();
        break;

      case "back":
        goBack();
        break;

      case "next":
        goNext();
        break;

      case "guess":
        chooseAnswer(button.dataset.answer);
        break;

      case "restart":
        showIntro();
        break;

      case "copy":
        await copySummary();
        break;

      default:
        break;
    }
  });

  // ============================================
  // START
  // ============================================

  showIntro();

  // Optional test access for automated checks.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      FACTS,
      DOUBTS,
      ROUTINES,
      calculateScore,
      buildSummary,
      getScoreMessage
    };
  }
})();
