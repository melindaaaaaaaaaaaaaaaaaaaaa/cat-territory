function step1() {
    alert("Loading historical data...");
}

function step2() {
    alert("Analyzing behavior patterns...");
}

function step3() {
    let sleep = document.getElementById("sleep").value;

    let result = "Behavior stability score: 80%\n";

    if (sleep > 18) {
        result += "⚠️ Anomaly detected: Too much sleep!";
    } else {
        result += "No anomaly detected.";
    }

    document.getElementById("outputText").value = result;

    // draw simple graph
    let canvas = document.getElementById("graphCanvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(100, 120);
    ctx.lineTo(200, 130);
    ctx.lineTo(300, 90);
    ctx.lineTo(400, 100);
    ctx.stroke();
}