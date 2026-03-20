// ================= GLOBAL DATA =================
let catsData = [];
let simulationResult = {};

// ================= EVENT LISTENER =================
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("btnGenerate").addEventListener("click", generateAgents);
    document.getElementById("btnSimulate").addEventListener("click", runSimulation);
    document.getElementById("btnVisualize").addEventListener("click", visualize);

});

// ================= STEP 1: GENERATE AGENTS =================
function generateAgents() {

    let numCats = parseInt(document.getElementById("numCats").value);
    let traitsText = document.getElementById("traits").value.trim();

    if (!numCats || traitsText === "") {
        alert("Please fill number of cats and traits!");
        return;
    }

    let lines = traitsText.split("\n");

    if (lines.length !== numCats) {
        alert("Jumlah baris traits harus sama dengan number of cats!");
        return;
    }

    catsData = [];

    for (let line of lines) {
        let parts = line.split(",");

        if (parts.length !== 3) {
            alert("Format harus: dominance, stress, tolerance");
            return;
        }

        let d = parseFloat(parts[0]);
        let s = parseFloat(parts[1]);
        let t = parseFloat(parts[2]);

        catsData.push({
            dominance: d,
            stress: s,
            tolerance: t
        });
    }

    alert("Agents generated successfully! 🐱");
}

// ================= STEP 2: RUN SIMULATION =================
function runSimulation() {

    if (catsData.length === 0) {
        alert("Generate agents first!");
        return;
    }

    let houseSize = parseFloat(document.getElementById("houseSize").value);
    let litterBoxes = parseInt(document.getElementById("litterBoxes").value);
    let feedingStations = parseInt(document.getElementById("feedingStations").value);

    if (!houseSize || !litterBoxes || !feedingStations) {
        alert("Please fill all environment parameters!");
        return;
    }

    // ===== SIMPLE MODEL (masih mockup tapi lebih realistis) =====

    let avgDominance = catsData.reduce((sum, c) => sum + c.dominance, 0) / catsData.length;
    let avgTolerance = catsData.reduce((sum, c) => sum + c.tolerance, 0) / catsData.length;

    let resourceFactor = (litterBoxes + feedingStations) / catsData.length;
    let spaceFactor = houseSize / (catsData.length * 20);

    let conflictProb =
        (avgDominance * (1 - avgTolerance)) *
        (1 / (resourceFactor + spaceFactor));

    // clamp biar antara 0–1
    conflictProb = Math.min(Math.max(conflictProb, 0), 1);

    let stressLevel = (conflictProb * 10).toFixed(2);

    simulationResult = {
        conflict: conflictProb.toFixed(2),
        stress: stressLevel
    };

    document.getElementById("outputText").value =
        "Conflict Probability: " + simulationResult.conflict +
        "\nStress Level: " + simulationResult.stress +
        "\n(Improved mockup model)";

}

// ================= STEP 3: VISUALIZATION =================
function visualize() {

    if (catsData.length === 0) {
        alert("Generate agents first!");
        return;
    }

    let canvas = document.getElementById("outputCanvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    catsData.forEach(cat => {

        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;

        let radius = 10 + cat.dominance * 20;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();

    });
}
