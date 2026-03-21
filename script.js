let cats = [];
let relations = [];
let colors = ["red","blue","yellow","green","orange","purple"];

// STEP 1
function generateCatForms() {
    let count = document.getElementById("catCount").value;
    let container = document.getElementById("step2");
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
        container.innerHTML += `
            <h3>Kucing ${i+1}</h3>
            <select id="type${i}" onchange="toggleParams(${i})">
                <option value="new">New Cat</option>
                <option value="old">Existing Cat</option>
            </select>

            <div id="param${i}">
                Dominance <input type="number" id="dom${i}" min="0" max="10"><br>
                Stress <input type="number" id="stress${i}" min="0" max="10"><br>
                Tolerance <input type="number" id="tol${i}" min="0" max="10"><br>
            </div>
        `;
    }

    container.innerHTML += `<button onclick="saveCats(${count})">Next</button>`;
}

// toggle parameter
function toggleParams(i) {
    let type = document.getElementById(`type${i}`).value;
    let div = document.getElementById(`param${i}`);

    div.style.display = (type === "old") ? "none" : "block";
}

// STEP 2
function saveCats(count) {
    cats = [];

    for (let i = 0; i < count; i++) {
        cats.push({
            id: i,
            type: document.getElementById(`type${i}`).value,
            dominance: +document.getElementById(`dom${i}`).value || 5,
            stress: +document.getElementById(`stress${i}`).value || 5,
            tolerance: +document.getElementById(`tol${i}`).value || 5,
            color: colors[i % colors.length],
            path: [],
            conflict: 0
        });
    }

    generateRelations(count);
}

// STEP 3 (RELASI)
function generateRelations(count) {
    let container = document.getElementById("step2");
    container.innerHTML += "<h2>Relasi Kucing Lama</h2>";

    let oldCats = cats.filter(c => c.type === "old");

    if (oldCats.length < 2) {
        container.innerHTML += "<p>Tidak perlu isi relasi</p>";
        container.innerHTML += `<button onclick="showStep3()">Next</button>`;
        return;
    }

    for (let i = 0; i < oldCats.length; i++) {
        for (let j = i+1; j < oldCats.length; j++) {
            let c1 = oldCats[i];
            let c2 = oldCats[j];

            container.innerHTML += `
                Kucing ${c1.id+1} & ${c2.id+1}:
                <select id="rel${c1.id}_${c2.id}">
                    <option value="friend">Best Friends</option>
                    <option value="roommate">Roommates</option>
                    <option value="enemy">Tidak Cocok</option>
                </select><br>
            `;
        }
    }

    container.innerHTML += `<button onclick="saveRelations(${count})">Next</button>`;
}

function saveRelations(count) {
    relations = [];

    let oldCats = cats.filter(c => c.type === "old");

    for (let i = 0; i < oldCats.length; i++) {
        for (let j = i+1; j < oldCats.length; j++) {
            let c1 = oldCats[i];
            let c2 = oldCats[j];

            relations.push({
                i: c1.id,
                j: c2.id,
                type: document.getElementById(`rel${c1.id}_${c2.id}`).value
            });
        }
    }

    showStep3();
}

function showStep3() {
    document.getElementById("step3").style.display = "block";
}

// SIMULASI
function startSimulation() {
    let houseSize = document.getElementById("houseSize").value;
    if (!houseSize) return alert("Isi luas rumah!");

    let scale = Math.sqrt(houseSize);
    let canvasSize = Math.min(600, scale * 20);

    let canvas = document.getElementById("mapCanvas");
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvasSize,canvasSize);

    cats.forEach(cat => {
        let x = Math.random()*canvasSize;
        let y = Math.random()*canvasSize;

        cat.path = [];

        for (let t = 0; t < 100; t++) {
            let step = 10 + cat.stress * 2;

            x += (Math.random()-0.5)*step;
            y += (Math.random()-0.5)*step;

            x = Math.max(0, Math.min(canvasSize,x));
            y = Math.max(0, Math.min(canvasSize,y));

            cat.path.push({x,y});
        }

        ctx.beginPath();
        ctx.strokeStyle = cat.color;

        cat.path.forEach((p,i)=>{
            if(i===0) ctx.moveTo(p.x,p.y);
            else ctx.lineTo(p.x,p.y);
        });

        ctx.stroke();
    });

    detectConflict(ctx, canvasSize);
    showOutput(houseSize);
}

// KONFLIK
function detectConflict(ctx, size) {
    cats.forEach(c => c.conflict = 0);

    relations.forEach(rel => {
        let c1 = cats[rel.i];
        let c2 = cats[rel.j];

        for (let t = 0; t < c1.path.length; t++) {
            let p1 = c1.path[t];
            let p2 = c2.path[t];

            let dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            let threshold = size * 0.03;

            if (dist < threshold) {
                let weight = 1;
                if (rel.type === "enemy") weight = 3;
                if (rel.type === "friend") weight = 0.5;

                c1.conflict += weight;
                c2.conflict += weight;

                ctx.fillStyle = "black";
                ctx.fillText("!", p1.x, p1.y);
            }
        }
    });
}

// OUTPUT
function showOutput(houseSize) {
    let out = "";

    cats.forEach(cat => {
        let density = cats.length / houseSize;
        let prob = (cat.conflict * density).toFixed(2);

        out += `Kucing ${cat.id+1}: Conflict Probability = ${prob}<br>`;
    });

    let n = cats.length;

    out += `<br>Rekomendasi:<br>`;
    out += `🍽️ Tempat makan minimal: ${n+1}<br>`;
    out += `🚽 Litter box minimal: ${n+1}<br>`;

    document.getElementById("output").innerHTML = out;
}
