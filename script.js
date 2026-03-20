// ================= EVENT LISTENER =================
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("btnRun").addEventListener("click", runSimulation);
    document.getElementById("btnClear").addEventListener("click", clearAll);

});

// ================= RUN SIMULATION =================
function runSimulation() {

    let numCats = parseInt(document.getElementById("numCats").value);
    let traitsText = document.getElementById("traits").value.trim();

    let houseSize = parseFloat(document.getElementById("houseSize").value);
    let litterBoxes = parseInt(document.getElementById("litterBoxes").value);
    let feedingStations = parseInt(document.getElementById("feedingStations").value);

    // ===== VALIDASI =====
    if (!numCats || traitsText === "" || !houseSize || !litterBoxes || !feedingStations) {
        alert("Please fill all inputs!");
        return;
    }

    let lines = traitsText.split("\n");

    if (lines.length !== numCats) {
        alert("Number of cats must match number of trait lines!");
        return;
    }

    // ===== PARSE DATA =====
    let catsData = [];

    for (let line of lines) {
        let parts = line.split(",");

        if (parts.length !== 3) {
            alert("Format must be: dominance, stress, tolerance");
            return;
        }

        let d = parseFloat(parts[0]);
        let s = parseFloat(parts[1]);
        let t = parseFloat(parts[2]);

        catsData.push({ dominance: d, stress: s, tolerance: t });
    }

    // ===== SIMPLE MODEL =====
    let avgDominance = catsData.reduce((sum, c) => sum + c.dominance, 0) / catsData.length;
    let avgTolerance = catsData.reduce((sum, c) => sum + c.tolerance, 0) / catsData.length;

    let resourceFactor = (litterBoxes + feedingStations) / catsData.length;
    let spaceFactor = houseSize / (catsData.length * 20);

    let conflictProb =
        (avgDominance * (1 - avgTolerance)) *
        (1 / (resourceFactor + spaceFactor));

    conflictProb = Math.min(Math.max(conflictProb, 0), 1);

    let stressLevel = (conflictProb * 10).toFixed(2);

    // ===== OUTPUT TEXT =====
    document.getElementById("outputText").value =
        "Conflict Probability: " + conflictProb.toFixed(2) +
        "\nStress Level: " + stressLevel;

    // ===== CANVAS =====
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

// ================= CLEAR ALL =================
function clearAll() {

    document.getElementById("numCats").value = "";
    document.getElementById("traits").value = "";
    document.getElementById("houseSize").value = "";
    document.getElementById("litterBoxes").value = "";
    document.getElementById("feedingStations").value = "";

    document.getElementById("outputText").value = "";

    let canvas = document.getElementById("outputCanvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

}
