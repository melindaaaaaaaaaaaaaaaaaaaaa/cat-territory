let cats = [];

document.getElementById("generateInputs").onclick = function () {

    let num = document.getElementById("numCats").value;
    let container = document.getElementById("catInputs");

    container.innerHTML = "";

    for (let i = 0; i < num; i++) {
        container.innerHTML += `
        <div>
            <h4>Cat ${i+1}</h4>
            <input placeholder="Dominance (0-1)" id="d${i}">
            <input placeholder="Stress (0-1)" id="s${i}">
            <input placeholder="Tolerance (0-1)" id="t${i}">
        </div>`;
    }
};

document.getElementById("btnRun").onclick = function () {

    let num = document.getElementById("numCats").value;
    let house = document.getElementById("houseSize").value;
    let litter = document.getElementById("litterBoxes").value;
    let feed = document.getElementById("feedingStations").value;

    cats = [];

    for (let i = 0; i < num; i++) {
        cats.push({
            d: parseFloat(document.getElementById("d"+i).value),
            s: parseFloat(document.getElementById("s"+i).value),
            t: parseFloat(document.getElementById("t"+i).value)
        });
    }

    // ===== MODEL =====
    let avgD = cats.reduce((a,c)=>a+c.d,0)/num;
    let avgT = cats.reduce((a,c)=>a+c.t,0)/num;

    let resourceFactor = (parseInt(litter)+parseInt(feed))/num;
    let spaceFactor = house/(num*20);

    let conflict = (avgD*(1-avgT))/(resourceFactor+spaceFactor);
    conflict = Math.min(Math.max(conflict,0),1);

    let stress = (conflict*10).toFixed(2);

    let social = conflict < 0.3 ? "Friendly 😇" :
                 conflict < 0.6 ? "Roommates 😐" :
                 "Conflict 😾";

    let resourceStatus = (litter >= num+1 && feed >= num+1)
        ? "Adequate"
        : "Insufficient";

    // ===== OUTPUT =====
    document.getElementById("outputText").value =
        "Conflict: "+conflict.toFixed(2)+
        "\nStress: "+stress+
        "\nSocial: "+social+
        "\nResource: "+resourceStatus;

    drawCanvas(conflict);
};

function drawCanvas(conflict) {

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0,0,canvas.width,canvas.height);

    let positions = [];

    cats.forEach((cat,i)=>{
        let x = Math.random()*400+50;
        let y = Math.random()*250+50;
        let r = 20 + cat.d*20;

        positions.push({x,y,r});

        ctx.globalAlpha = 0.4;
        ctx.fillStyle = getColor(i);
        ctx.beginPath();
        ctx.arc(x,y,r,0,2*Math.PI);
        ctx.fill();
    });

    // ===== DETECT OVERLAP =====
    for(let i=0;i<positions.length;i++){
        for(let j=i+1;j<positions.length;j++){

            let dx = positions[i].x - positions[j].x;
            let dy = positions[i].y - positions[j].y;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if(dist < positions[i].r + positions[j].r){

                ctx.globalAlpha = 1;
                ctx.fillStyle = "red";
                ctx.font = "20px Arial";
                ctx.fillText("!", (positions[i].x+positions[j].x)/2,
                                   (positions[i].y+positions[j].y)/2);
            }
        }
    }
}

function getColor(i){
    let colors = ["red","blue","green","orange","purple","brown"];
    return colors[i % colors.length];
}

document.getElementById("btnClear").onclick = function(){

    document.getElementById("numCats").value = "";
    document.getElementById("catInputs").innerHTML = "";
    document.getElementById("houseSize").value = "";
    document.getElementById("litterBoxes").value = "";
    document.getElementById("feedingStations").value = "";
    document.getElementById("outputText").value = "";

    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0,0,500,350);
};
