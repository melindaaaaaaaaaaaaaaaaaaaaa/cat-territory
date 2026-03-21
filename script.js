let cats = [];
let relations = [];
let colors = ["red","blue","yellow","green","orange","purple"];

// STEP 1 → generate form kucing
function generateCatForms() {
    let count = document.getElementById("catCount").value;
    let container = document.getElementById("step2");

    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
        container.innerHTML += `
            <h3>Kucing ${i+1}</h3>
            <select id="type${i}">
                <option value="new">New Cat</option>
                <option value="old">Existing Cat</option>
            </select><br>

            Dominance <input type="number" id="dom${i}" min="0" max="10"><br>
            Stress <input type="number" id="stress${i}" min="0" max="10"><br>
            Tolerance <input type="number" id="tol${i}" min="0" max="10"><br>
        `;
    }

    container.innerHTML += `<button onclick="saveCats(${count})">Next</button>`;
}

// STEP 2 → simpan data kucing
function saveCats(count) {
    cats = [];

    for (let i = 0; i < count; i++) {
        cats.push({
            id: i,
            type: document.getElementById(`type${i}`).value,
            dominance: +document.getElementById(`dom${i}`).value,
            stress: +document.getElementById(`stress${i}`).value,
            tolerance: +document.getElementById(`tol${i}`).value,
            color: colors[i],
            path: [],
            conflict: 0
        });
    }

    generateRelations(count);
}

// STEP 3 → relasi antar kucing
function generateRelations(count) {
    let container = document.getElementById("step2");
    container.innerHTML += "<h2>Relasi Antar Kucing</h2>";

    for (let i = 0; i < count; i++) {
        for (let j = i+1; j < count; j++) {
            container.innerHTML += `
                Kucing ${i+1} & ${j+1}:
                <select id="rel${i}_${j}">
                    <option value="friend">Best Friends</option>
                    <option value="roommate">Roommates</option>
                    <option value="enemy">Tidak Cocok</option>
                </select><br>
            `;
        }
    }

    container.innerHTML += `<button onclick="saveRelations(${count})">Next</button>`;
}

// simpan relasi
function saveRelations(count) {
    relations = [];

    for (let i = 0; i < count; i++) {
        for (let j = i+1; j < count; j++) {
            relations.push({
                i, j,
                type: document.getElementById(`rel${i}_${j}`).value
            });
        }
    }

    document.getElementById("step3").style.display = "block";
}

// SIMULASI
function startSimulation() {
    let canvas = document.getElementById("mapCanvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0,0,500,500);

    // random walk
    cats.forEach(cat => {
        let x = Math.random()*500;
        let y = Math.random()*500;

        cat.path = [];

        for (let t = 0; t < 100; t++) {
            x += (Math.random()-0.5)*20;
            y += (Math.random()-0.5)*20;

            x = Math.max(0, Math.min(500,x));
            y = Math.max(0, Math.min(500,y));

            cat.path.push({x,y});
        }

        // draw path
        ctx.beginPath();
        ctx.strokeStyle = cat.color;

        cat.path.forEach((p,i)=>{
            if(i===0) ctx.moveTo(p.x,p.y);
            else ctx.lineTo(p.x,p.y);
        });

        ctx.stroke();
    });

    detectConflict(ctx);
    showOutput();
}

// DETEKSI KONFLIK
function detectConflict(ctx) {
    for (let c of cats) c.conflict = 0;

    relations.forEach(rel => {
        let c1 = cats[rel.i];
        let c2 = cats[rel.j];

        for (let t = 0; t < c1.path.length; t++) {
            let p1 = c1.path[t];
            let p2 = c2.path[t];

            let dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

            if (dist < 15) {
                let weight = 1;

                if (rel.type === "enemy") weight = 3;
                if (rel.type === "friend") weight = 0.5;

                c1.conflict += weight;
                c2.conflict += weight;

                // tanda !
                ctx.fillStyle = "black";
                ctx.fillText("!", p1.x, p1.y);
            }
        }
    });
}

// OUTPUT
function showOutput() {
    let out = "";

    // conflict probability
    cats.forEach(cat => {
        let prob = (cat.conflict / 100).toFixed(2);
        out += `Kucing ${cat.id+1}: Conflict Probability = ${prob}<br>`;
    });

    // rekomendasi resource
    let n = cats.length;
    out += `<br>Rekomendasi:<br>`;
    out += `🍽️ Tempat makan minimal: ${n+1}<br>`;
    out += `🚽 Litter box minimal: ${n+1}<br>`;

    document.getElementById("output").innerHTML = out;
}