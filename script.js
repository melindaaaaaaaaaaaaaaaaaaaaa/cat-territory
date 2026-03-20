function step1() {
    alert("Initializing cat agents with personality traits...");
}

function step2() {
    alert("Simulating interactions between cats...");
}

function step3() {
    let numCats = document.getElementById("numCats").value;

    let result = "Simulation Result:\n";
    result += "Conflict probability: Medium\n";
    result += "Average stress level: High\n";
    result += "Recommendation: Add more feeding stations\n";

    document.getElementById("outputText").value = result;

    // simple territory visualization
    let canvas = document.getElementById("mapCanvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw fake territories
    ctx.beginPath();
    ctx.arc(100, 120, 50, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(200, 100, 50, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(300, 140, 50, 0, 2 * Math.PI);
    ctx.stroke();
}
