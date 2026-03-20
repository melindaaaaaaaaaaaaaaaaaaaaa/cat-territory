function runSimulation() {

    let numCats = document.getElementById("numCats").value;
    let houseSize = document.getElementById("houseSize").value;
    let litterBoxes = document.getElementById("litterBoxes").value;
    let feedingStations = document.getElementById("feedingStations").value;

    // Dummy results (mockup)
    let conflictProb = Math.random().toFixed(2);
    let stressLevel = (Math.random() * 10).toFixed(2);

    document.getElementById("outputText").value =
        "Conflict Probability: " + conflictProb +
        "\nStress Level: " + stressLevel +
        "\n(Mockup only)";

    // Canvas visualization
    let canvas = document.getElementById("outputCanvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numCats; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            20,
            0,
            2 * Math.PI
        );
        ctx.stroke();
    }
}
