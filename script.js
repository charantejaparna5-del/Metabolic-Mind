// ==========================================
// METABOLIC MIND
// Research Radar + Learning Quiz
// ==========================================


// ---------- RESEARCH SEARCH & FILTERS ----------

const searchInput = document.getElementById("researchSearch");

const researchCards = [
    ...document.querySelectorAll(".research-card")
];

const filterButtons = [
    ...document.querySelectorAll(".filter-chip")
];

const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

let activeFilter = "all";


function filterResearch() {

    const query = searchInput.value.trim().toLowerCase();

    let visibleCount = 0;

    researchCards.forEach((card) => {

        const topic = card.dataset.topic;

        const topicMatches =
            activeFilter === "all" ||
            topic === activeFilter;

        const searchableText = (
            card.innerText + " " +
            (card.dataset.search || "")
        ).toLowerCase();

        const searchMatches =
            searchableText.includes(query);

        const shouldShow =
            topicMatches && searchMatches;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }

    });

    resultCount.textContent =
        `${String(visibleCount).padStart(2, "0")} RESOURCES`;

    emptyState.hidden = visibleCount !== 0;
}


if (searchInput) {
    searchInput.addEventListener("input", filterResearch);
}


filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        activeFilter = button.dataset.filter;

        filterButtons.forEach((item) => {

            const isActive = item === button;

            item.classList.toggle("active", isActive);

            item.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        });

        filterResearch();

    });

});


// ---------- MOBILE NAVIGATION ----------

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.textContent = isOpen ? "×" : "☰";

    });


    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.textContent = "☰";

        });

    });

}


// ---------- QUIZ QUESTIONS ----------

const questions = [

    {
        title: "What would you most like to understand?",
        help: "Choose the topic that feels most useful to you.",
        answers: [
            {
                label: "How metabolism and blood sugar work",
                value: "basics"
            },
            {
                label: "Food, nutrition and everyday eating",
                value: "nutrition"
            },
            {
                label: "Movement, strength and energy",
                value: "movement"
            },
            {
                label: "Sleep, stress and daily habits",
                value: "sleep"
            }
        ]
    },

    {
        title: "What kind of information helps you learn?",
        help: "Pick the format you would most like to explore.",
        answers: [
            {
                label: "A beginner-friendly explanation",
                value: "basics"
            },
            {
                label: "Practical nutrition guidance",
                value: "nutrition"
            },
            {
                label: "Scientific studies and evidence",
                value: "research"
            },
            {
                label: "Everyday habits and routines",
                value: "sleep"
            }
        ]
    },

    {
        title: "Which area would you like to explore first?",
        help: "Choose your current learning interest.",
        answers: [
            {
                label: "Insulin and glucose",
                value: "basics"
            },
            {
                label: "Balanced eating patterns",
                value: "nutrition"
            },
            {
                label: "Physical activity and fitness",
                value: "movement"
            },
            {
                label: "Sleep and recovery",
                value: "sleep"
            }
        ]
    },

    {
        title: "How do you prefer to get started?",
        help: "Choose an approach that feels manageable.",
        answers: [
            {
                label: "Learn one simple concept",
                value: "basics"
            },
            {
                label: "Read a practical overview",
                value: "nutrition"
            },
            {
                label: "Compare research sources",
                value: "research"
            },
            {
                label: "Explore one habit at a time",
                value: "sleep"
            }
        ]
    },

    {
        title: "What would make learning useful for you?",
        help: "Select the outcome you hope to get from this experience.",
        answers: [
            {
                label: "Understand health terms and measurements",
                value: "basics"
            },
            {
                label: "Ask informed questions about food",
                value: "nutrition"
            },
            {
                label: "Learn how to read research",
                value: "research"
            },
            {
                label: "Understand everyday health habits",
                value: "sleep"
            }
        ]
    }

];


// ---------- LEARNING RECOMMENDATIONS ----------

const recommendations = {

    basics: {
        title: "Metabolic Basics",

        description:
            "Start with how the body uses glucose, what insulin does, and why metabolic health involves more than one measurement.",

        links: [
            {
                label: "NIDDK: Insulin Resistance",
                url: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance"
            }
        ]
    },

    nutrition: {
        title: "Nutrition Without the Noise",

        description:
            "Explore balanced-diet guidance from a public-health source and use it as a foundation for further learning.",

        links: [
            {
                label: "WHO: Healthy Diet",
                url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet"
            }
        ]
    },

    movement: {
        title: "Movement in Everyday Life",

        description:
            "Explore public-health physical-activity guidance and consider which forms of movement are practical for you.",

        links: [
            {
                label: "WHO: Physical Activity",
                url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity"
            }
        ]
    },

    sleep: {
        title: "Sleep and Daily Habits",

        description:
            "Learn basic sleep-health principles and explore habits that can support a consistent sleep routine.",

        links: [
            {
                label: "CDC: Sleep Information",
                url: "https://www.cdc.gov/sleep/"
            }
        ]
    },

    research: {
        title: "Learn to Read Research",

        description:
            "Practise checking who was studied, what was measured, and what limitations the researchers describe.",

        links: [
            {
                label: "PubMed: Search Research",
                url: "https://pubmed.ncbi.nlm.nih.gov/"
            }
        ]
    }

};


// ---------- QUIZ STATE ----------

const selectedAnswers = Array(questions.length).fill(null);

let currentQuestion = 0;


const questionTitle = document.getElementById("questionTitle");
const questionHelp = document.getElementById("questionHelp");
const answerList = document.getElementById("answerList");

const quizStepLabel = document.getElementById("quizStepLabel");
const quizStepCount = document.getElementById("quizStepCount");

const progressBar = document.getElementById("progressBar");

const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");

const quizPanel = document.getElementById("quizPanel");
const resultsPanel = document.getElementById("resultsPanel");


// ---------- DISPLAY QUESTION ----------

function renderQuestion() {

    const question = questions[currentQuestion];

    questionTitle.textContent = question.title;
    questionHelp.textContent = question.help;

    // Display question number.
    quizStepLabel.textContent =
        `QUESTION ${String(currentQuestion + 1).padStart(2, "0")}`;

    // Add a separator between the question label and counter.
    quizStepCount.textContent =
        `· ${currentQuestion + 1} OF ${questions.length}`;

    // Update progress.
    progressBar.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    // Update Back button.
    backButton.disabled = currentQuestion === 0;

    // Enable Continue only after an answer is selected.
    nextButton.disabled =
        selectedAnswers[currentQuestion] === null;

    // Update the final button label.
    nextButton.textContent =
        currentQuestion === questions.length - 1
            ? "See my learning path →"
            : "Continue →";

    // Remove previous answers.
    answerList.replaceChildren();


    // Create answer buttons.
    question.answers.forEach((answer, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-option";

        const isSelected =
            selectedAnswers[currentQuestion] === answer.value;

        if (isSelected) {
            button.classList.add("selected");
        }

        button.setAttribute(
            "aria-pressed",
            String(isSelected)
        );


        // Answer letter.
        const marker = document.createElement("span");

        marker.className = "answer-marker";
        marker.textContent = String.fromCharCode(65 + index);


        // Answer text.
        const label = document.createElement("span");

        label.className = "answer-text";
        label.textContent = answer.label;


        button.append(marker, label);


        // Save selected answer.
        button.addEventListener("click", () => {

            selectedAnswers[currentQuestion] = answer.value;

            renderQuestion();

        });


        answerList.appendChild(button);

    });

}


// ---------- BACK BUTTON ----------

backButton.addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();

    }

});


// ---------- CONTINUE BUTTON ----------

nextButton.addEventListener("click", () => {

    // Do not continue without selecting an answer.
    if (selectedAnswers[currentQuestion] === null) {
        return;
    }

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        renderQuestion();

    } else {

        showResults();

    }

});


// ---------- DISPLAY RESULTS ----------

function showResults() {

    const scores = {};

    // Count selected topics.
    selectedAnswers.forEach((answer) => {

        if (answer) {

            scores[answer] = (scores[answer] || 0) + 1;

        }

    });


    // Rank topics by the number of selections.
    const rankedTopics = Object.entries(scores)
        .sort((a, b) => b[1] - a[1]);


    const primaryTopic = rankedTopics[0]?.[0] || "basics";

    const secondaryTopic =
        rankedTopics.find(([topic]) => topic !== primaryTopic)?.[0]
        || "research";


    const resultTitle = document.getElementById("resultTitle");

    const resultSummary = document.getElementById("resultSummary");

    const recommendationList =
        document.getElementById("recommendationList");


    // Show primary recommendation.
    resultTitle.textContent =
        recommendations[primaryTopic].title;

    resultSummary.textContent =
        "Based on your answers, here are two educational topics to explore. Learn at your own pace and follow the original sources for more information.";


    // Clear old recommendations.
    recommendationList.replaceChildren();


    // Display two learning recommendations.
    [primaryTopic, secondaryTopic].forEach((topic, index) => {

        const recommendation = recommendations[topic];

        const card = document.createElement("article");

        card.className = "recommendation-card";


        // Recommendation heading.
        const heading = document.createElement("h3");

        heading.textContent =
            `${String(index + 1).padStart(2, "0")} · ${recommendation.title}`;


        // Recommendation description.
        const description = document.createElement("p");

        description.textContent = recommendation.description;


        card.append(heading, description);


        // Add trusted learning resources.
        recommendation.links.forEach((link) => {

            const anchor = document.createElement("a");

            anchor.href = link.url;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";

            anchor.textContent = `${link.label} ↗`;

            card.appendChild(anchor);

        });


        recommendationList.appendChild(card);

    });


    // Complete progress bar.
    progressBar.style.width = "100%";

    // Show recommendations instead of quiz.
    quizPanel.hidden = true;
    resultsPanel.hidden = false;

}


// ---------- RETAKE QUIZ ----------

document.getElementById("restartButton").addEventListener("click", () => {

    // Clear previous answers.
    selectedAnswers.fill(null);

    // Return to first question.
    currentQuestion = 0;

    // Show quiz again.
    resultsPanel.hidden = true;
    quizPanel.hidden = false;

    renderQuestion();

});


// ---------- INITIALISE WEBSITE ----------

renderQuestion();

filterResearch();