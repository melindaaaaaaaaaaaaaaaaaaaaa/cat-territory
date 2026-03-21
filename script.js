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
            <div class="cat-block">
                <h3>Kucing ${i+1}</h3>

                <select id="type${i}" onchange="updateAllForms(${count})">
                    <option value="new">New Cat</option>
                    <option value="old">Existing Cat</option>
                </select>

                <div id="dynamic${i}"></div>
            </div>
        `;
    }

    container.innerHTML += `<button onclick="saveCats(${count})">Next</button>`;

    updateAllForms(count);
}

// 🔥 RENDER SEMUA (INI KUNCI FIX)
function updateAllForms(total) {
    for (let i = 0; i < total; i++) {
        let typeEl = document.getElementById(`type${i}`);
        if (!typeEl) continue;

        if (typeEl.value === "new") {
            renderNewCat(i);
        } else {
            renderExistingCat(i, total);
        }
    }
}

// NEW CAT
function renderNewCat(i) {
    document.getElementById(`dynamic${i}`).innerHTML = `
        Dominance <input type="number" id="dom${i}" min="0" max="10"><br>
        Stress <input type="number" id="stress${i}" min="0" max="10"><br>
        Tolerance <input type="number" id="tol${i}" min="0" max="10"><br>
    `;
}

// EXISTING CAT (SUPER STRICT)
function renderExistingCat(i, total) {
    let html = `<p>Hubungan dengan kucing lain:</p>`;

    for (let j = 0; j < total; j++) {
        if (j === i) continue;

        let otherTypeEl = document.getElementById(`type${j}`);

        // ❗ FIX: skip kalau element ga ada ATAU bukan existing
        if (!otherTypeEl || otherTypeEl.value !== "old") continue;

        html += `
            Kucing ${i+1} & ${j+1}:
            <select id="rel_${i}_${j}">
                <option value="friend">Best Friends</option>
                <option value="roommate">Roommates</option>
                <option value="enemy">Tidak Cocok</option>
            </select><br>
        `;
    }

    if (html === `<p>Hubungan dengan kucing lain:</p>`) {
        html += `<p>(Tidak ada kucing existing lain)</p>`;
    }

    document.getElementById(`dynamic${i}`).innerHTML = html;
}

// SAVE
function saveCats(count) {
    cats = [];
    relations = [];

    for (let i = 0; i < count; i++) {
        let type = document.getElementById(`type${i}`).value;

        let cat = {
            id: i,
            type: type,
            color: colors[i % colors.length],
            path: [],
            conflict: 0,
            dominance: 5,
            stress: 5,
            tolerance: 5
        };

        if (type === "new") {
            cat.dominance = +document.getElementById(`dom${i}`).value || 5;
            cat.stress = +document.getElementById(`stress${i}`).value || 5;
            cat.tolerance = +document.getElementById(`tol${i}`).value || 5;
        }

        cats.push(cat);

        if (type === "old") {
            for (let j = 0; j < count; j++) {
                if (j === i) continue;

                let otherType = document.getElementById(`type${j}`).value;

                if (otherType === "old") {
                    let relEl = document.getElementById(`rel_${i}_${j}`);
                    if (relEl) {
                        relations.push({
                            i: i,
                            j: j,
                            type: relEl.value
                        });
                    }
                }
            }
        }
    }

    document.getElementById("step3").style.display = "block";
}

// SIMULASI (tetap sama)
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
