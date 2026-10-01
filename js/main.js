// ---- Quiz data / state ----

var ARCHETYPES = {
    architect: {
        icon: "📐",
        name: "The Architect",
        blurb: "You plan before you build. Structure, scalability and a clean diagram matter more to you than being first to ship.",
        details: "You see a codebase as a <strong>system</strong>, not a pile of files. Before anyone opens an editor, you're already asking how the pieces fit, where it will <strong>break at scale</strong>, and what the next developer will need. Teammates trust you because your projects rarely turn into a rewrite.",
        strength: "Long-term thinking. Your designs <strong>age well</strong> and make everyone else faster.",
        blindspot: "<strong>Over-planning.</strong> Sometimes a rough prototype teaches you more than a third diagram.",
        tip: "Time-box the design phase, and ship a <strong>thin vertical slice</strong> early to test your assumptions."
    },
    firefighter: {
        icon: "🚒",
        name: "The Firefighter",
        blurb: "You thrive in chaos. Production down at 2am is where you actually feel useful.",
        details: "When everything is on fire, you get <strong>calm and fast</strong>. You read logs like a story, you know where the bodies are buried, and you can fix the unfixable under pressure. Your team sleeps better knowing you're <strong>on call</strong>.",
        strength: "Speed and composure under pressure. You find the <strong>real problem</strong> while others are still panicking.",
        blindspot: "Fixes can become <strong>patches on patches</strong>, and calm periods can feel strangely boring.",
        tip: "After every fire, schedule a <strong>proper fix</strong> and a short post-mortem so the same blaze doesn't return."
    },
    tinkerer: {
        icon: "🧪",
        name: "The Tinkerer",
        blurb: "You learn by breaking things. Four side projects open right now, and that's exactly how you like it.",
        details: "Curiosity is your engine. You pick up <strong>new tools</strong> the day they launch, learn by taking things apart, and bring fresh ideas nobody else thought to try. Your <strong>breadth of knowledge</strong> often saves the team when a weird problem shows up.",
        strength: "Fast learning and creative problem solving. You connect ideas across <strong>different technologies</strong>.",
        blindspot: "<strong>Unfinished projects.</strong> The shiny new thing can pull you away at the 80% mark.",
        tip: "Pick <strong>one project</strong> and take it all the way to done. Finishing is a skill, and it's worth practicing."
    },
    perfectionist: {
        icon: "💎",
        name: "The Perfectionist",
        blurb: "You've rewritten that function six times. It's still not quite right, and you're fine waiting for the seventh.",
        details: "You care about <strong>craft</strong>. Naming, tests, edge cases and clean abstractions all matter to you, and your code reviews catch what others miss. Code you touch tends to be <strong>readable, tested and reliable</strong>.",
        strength: "Quality and attention to detail. Your work <strong>rarely needs a second pass</strong> from anyone else.",
        blindspot: "<strong>Endless polishing.</strong> Good enough on time can beat perfect too late.",
        tip: "Define <strong>'done'</strong> before you start, and let yourself ship once it's met."
    },
    pragmatist: {
        icon: "⚡",
        name: "The Pragmatist",
        blurb: "If it works and it's Friday, it ships. Elegant can wait until someone complains.",
        details: "You focus on <strong>outcomes</strong>. You know the best code is the code that solves the user's problem today, so you cut scope, reuse what exists and <strong>ship early</strong>. You turn ideas into real, working products faster than anyone.",
        strength: "Momentum and focus. You always know <strong>what matters</strong> and what can wait.",
        blindspot: "<strong>Technical debt</strong> quietly piles up when 'temporary' solutions become permanent.",
        tip: "Keep a short <strong>'fix later' list</strong> and actually revisit it after each release."
    }
};

var QUESTION_ORDER = ["q1", "q2", "q3", "q4", "q5"];

var scores = {};

function resetScores() {
    scores = { architect: 0, firefighter: 0, tinkerer: 0, perfectionist: 0, pragmatist: 0 };
}
resetScores();

function recordAnswer(archetype) {
    if (scores.hasOwnProperty(archetype)) {
        scores[archetype]++;
    }
}

function computeResult() {
    var winner = "architect"; 
    var best = -1;
    var order = ["architect", "firefighter", "tinkerer", "perfectionist", "pragmatist"];
    for (var i = 0; i < order.length; i++) {
        var key = order[i];
        if (scores[key] > best) {
            best = scores[key];
            winner = key;
        }
    }
    return winner;
}

// ---- Progress bar ----

function renderProgress($section, questionId) {
    var idx = QUESTION_ORDER.indexOf(questionId) + 1;
    var total = QUESTION_ORDER.length;
    var pct = Math.round((idx / total) * 100);
    var $bar = $section.find(".progress");
    $bar.find(".progress-label").text("Q" + (idx < 10 ? "0" + idx : idx) + " / " + (total < 10 ? "0" + total : total));
    $bar.find(".progress-fill").css("width", pct + "%");
}

// ---- App wiring ----

var app = $.spapp({
    defaultView: "#intro",
    templateDir: "./views/"
});

QUESTION_ORDER.forEach(function (qid, i) {
    app.route({
        view: qid,
        onCreate: function () {
            var $section = $("#" + qid);
            renderProgress($section, qid);

            $section.on("click", ".answer-btn", function () {
                var archetype = $(this).data("archetype");
                recordAnswer(archetype);

                var next = (i + 1 < QUESTION_ORDER.length) ? QUESTION_ORDER[i + 1] : "result";
                window.location.hash = "#" + next;
            });
        }
    });
});

app.route({
    view: "intro",
    onCreate: function () {
        resetScores();
        $("#intro").on("click", ".start-btn", function () {
            window.location.hash = "#" + QUESTION_ORDER[0];
        });
    }
});

app.route({
    view: "result",
    onCreate: function () {
        var $section = $("#result");

        $section.on("click", ".retake-btn", function () {
            resetScores();
            $section.removeClass("is-revealed");
            window.location.hash = "#intro";
        });

        $section.on("click", ".share-btn", function () {
            downloadResultCard(computeResult());
        });
    },
    onReady: function () {
        var key = computeResult();
        var data = ARCHETYPES[key];
        var $section = $("#result");
        $section.find(".result-icon").text(data.icon);
        $section.find(".result-name").text(data.name);
        $section.find(".result-blurb").text(data.blurb);
        $section.find(".result-details").html(data.details);
        $section.find(".result-strength").html(data.strength);
        $section.find(".result-blindspot").html(data.blindspot);
        $section.find(".result-tip").html(data.tip);
        $section.addClass("is-revealed");
    }
});

app.run();

// ---- Share-as-jpg ----

function downloadResultCard(key) {
    var data = ARCHETYPES[key];
    var w = 1000, h = 1250;

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext("2d");

    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#1c1f24");
    grad.addColorStop(1, "#0a0b0d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#2a2e34";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    ctx.fillStyle = "#868d94";
    ctx.font = "28px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillText("WhichDevAreYou", 80, 140);
    ctx.font = "100px sans-serif";
    ctx.fillText(data.icon, w - 200, 160);

    ctx.strokeStyle = "#5b8fb0";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 170);
    ctx.lineTo(200, 170);
    ctx.stroke();

    ctx.fillStyle = "#eceef0";
    ctx.font = "bold 64px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    wrapText(ctx, data.name, 80, 340, w - 160, 72);

    ctx.fillStyle = "#b7bdc3";
    ctx.font = "32px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    wrapText(ctx, data.blurb, 80, 480, w - 160, 44);

    var link = document.createElement("a");
    link.download = "which-dev-are-you.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var line = "";
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        var metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}