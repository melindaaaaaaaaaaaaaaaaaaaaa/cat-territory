// Pastikan HTML sudah kebaca
document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("runBtn");

    button.addEventListener("click", runSimulation);

});

function runSimulation() {

    let numCats = document.getElementById("numCats").value;

    if (!numCats) {
        alert("Please enter number of cats!");
        return;
    }

    let output = document.getElementById("outputText");

    // Dummy simulation (mockup)
    let conflictProb = Math.random().toFixed(2);
    let stressLevel = (Math.random() * 10).toFixed(2);

    output.value =
        "Conflict Probability: " + conflictProb +
        "\nStress Level: " + stressLevel +
        "\n(Mockup result)";

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
