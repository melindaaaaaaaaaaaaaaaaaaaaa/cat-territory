let cats = [];
let resources = [];

// warna random
function getRandomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

// tambah kucing
function addCat() {
    let name = document.getElementById("catName").value;
    if (!name) return alert("Isi nama dulu!");

    cats.push({
        name: name,
        color: getRandomColor(),
        path: []
    });

    document.getElementById("catName").value = "";
    alert("Kucing ditambahkan!");
}

// tambah resource
function addResource(type) {
    resources.push({
        type: type,
        x: Math.random() * 480,
        y: Math.random() * 480
    });

    drawMap();
}

// gambar map
function drawMap() {
    let canvas = document.getElementById("mapCanvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 500, 500);

    resources.forEach(r => {
        ctx.fillStyle = (r.type === "food") ? "green" : "brown";
        ctx.fillRect(r.x, r.y, 12, 12);
    });
}

// simulasi
function runSimulation() {
    if (cats.length === 0) return alert("Tambahin kucing dulu!");

    let canvas = document.getElementById("mapCanvas");
    let ctx = canvas.getContext("2d");

    drawMap();

    cats.forEach(cat => {
        cat.path = [];

        for (let i = 0; i < 50; i++) {
            cat.path.push({
                x: Math.random() * 500,
                y: Math.random() * 500
            });
        }

        ctx.beginPath();
        ctx.strokeStyle = cat.color;
        ctx.lineWidth = 2;

        cat.path.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });

        ctx.stroke();
    });

    detectConflict();
    checkResources();
}

// deteksi konflik
function detectConflict() {
    let conflictCount = 0;

    for (let i = 0; i < cats.length; i++) {
        for (let j = i+1; j < cats.length; j++) {
            let c1 = cats[i];
            let c2 = cats[j];

            for (let k = 0; k < c1.path.length; k++) {
                let p1 = c1.path[k];
                let p2 = c2.path[k];

                let dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

                if (dist < 15) {
                    conflictCount++;
                }
            }
        }
    }

    if (conflictCount > 0) {
        document.getElementById("output").innerHTML =
            "⚠️ Conflict detected! (" + conflictCount + " encounters)";
    } else {
        document.getElementById("output").innerHTML =
            "✅ No conflict detected";
    }
}

// cek resource
function checkResources() {
    let foodCount = resources.filter(r => r.type === "food").length;
    let litterCount = resources.filter(r => r.type === "litter").length;

    let rec = "";

    if (foodCount < cats.length + 1) {
        rec += "🍽️ Tambah tempat makan!<br>";
    }

    if (litterCount < cats.length + 1) {
        rec += "🚽 Tambah litter box!<br>";
    }

    if (rec !== "") {
        document.getElementById("output").innerHTML += "<br>" + rec;
    }
}

// clear
function clearAll() {
    cats = [];
    resources = [];

    let canvas = document.getElementById("mapCanvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 500, 500);

    document.getElementById("output").innerHTML = "";
}
