// ---- Quiz data / state ----

var ARCHETYPES = {
    architect: {
        name: "The Architect",
        blurb: "You plan before you build. Structure, scalability and a clean diagram matter more to you than being first to ship."
    },
    firefighter: {
        name: "The Firefighter",
        blurb: "You thrive in chaos. Production down at 2am is where you actually feel useful."
    },
    tinkerer: {
        name: "The Tinkerer",
        blurb: "You learn by breaking things. Four side projects open right now, and that's exactly how you like it."
    },
    perfectionist: {
        name: "The Perfectionist",
        blurb: "You've rewritten that function six times. It's still not quite right, and you're fine waiting for the seventh."
    },
    pragmatist: {
        name: "The Pragmatist",
        blurb: "If it works and it's Friday, it ships. Elegant can wait until someone complains."
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
        $section.find(".result-name").text(data.name);
        $section.find(".result-blurb").text(data.blurb);
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