// Data Storage
let cats = [];
let currentCatIndex = 0;
let animationInterval = null;
let currentHour = 0;
let animationActive = false;
let ctx, canvas, width, height;

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');

// Step 1: Jumlah Kucing
const catCountInput = document.getElementById('catCount');
const nextStep1Btn = document.getElementById('nextStep1');
const errorMessage = document.getElementById('errorMessage');

nextStep1Btn.addEventListener('click', () => {
    const count = parseInt(catCountInput.value);
    if (isNaN(count) || count < 1 || count > 10) {
        errorMessage.textContent = 'Masukkan jumlah kucing yang valid (1-10)';
        return;
    }
    
    errorMessage.textContent = '';
    initializeCats(count);
    showStep2();
});

function initializeCats(count) {
    cats = [];
    for (let i = 0; i < count; i++) {
        cats.push({
            id: i,
            name: `Kucing ${i + 1}`,
            status: 'new', // 'new' or 'old'
            traits: {
                dominance: 50,
                stress: 50,
                tolerance: 50
            },
            relationships: {},
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            position: { x: 0, y: 0 }
        });
    }
    
    // Initialize relationships for all cats
    for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
            cats[i].relationships[j] = 'roommates';
            cats[j].relationships[i] = 'roommates';
        }
    }
    
    document.getElementById('totalCats').textContent = count;
    currentCatIndex = 0;
    updateCatForm();
}

function updateCatForm() {
    const cat = cats[currentCatIndex];
    document.getElementById('catTitle').textContent = `Informasi Kucing #${currentCatIndex + 1}`;
    document.getElementById('currentCatIndex').textContent = currentCatIndex + 1;
    
    let html = `
        <div class="cat-info-form">
            <div class="form-group">
                <label>Nama Kucing</label>
                <input type="text" id="catName" value="${cat.name}" placeholder="Nama kucing">
            </div>
            <div class="form-group">
                <label>Status Kucing</label>
                <select id="catStatus">
                    <option value="new" ${cat.status === 'new' ? 'selected' : ''}>Kucing Baru</option>
                    <option value="old" ${cat.status === 'old' ? 'selected' : ''}>Kucing Lama</option>
                </select>
            </div>
    `;
    
    if (cat.status === 'new') {
        html += `
            <div class="form-group">
                <label>🦁 Tingkat Dominance (0-100)</label>
                <input type="range" id="dominance" min="0" max="100" value="${cat.traits.dominance}">
                <span id="dominanceValue">${cat.traits.dominance}</span>
            </div>
            <div class="form-group">
                <label>😰 Tingkat Stress (0-100)</label>
                <input type="range" id="stress" min="0" max="100" value="${cat.traits.stress}">
                <span id="stressValue">${cat.traits.stress}</span>
            </div>
            <div class="form-group">
                <label>🤝 Tingkat Tolerance (0-100)</label>
                <input type="range" id="tolerance" min="0" max="100" value="${cat.traits.tolerance}">
                <span id="toleranceValue">${cat.traits.tolerance}</span>
            </div>
        `;
    } else {
        // Relationship form for old cats
        const otherCats = cats.filter((_, idx) => idx !== currentCatIndex);
        if (otherCats.length > 0) {
            html += `<div class="relationship-group"><h4>Hubungan dengan kucing lain:</h4>`;
            otherCats.forEach(otherCat => {
                const currentRelation = cat.relationships[otherCat.id] || 'roommates';
                html += `
                    <div class="form-group">
                        <label>Hubungan dengan ${otherCat.name}</label>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="rel_${otherCat.id}" value="bestfriends" ${currentRelation === 'bestfriends' ? 'checked' : ''}>
                                Best Friends (tidur bareng, grooming, main bareng)
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="rel_${otherCat.id}" value="roommates" ${currentRelation === 'roommates' ? 'checked' : ''}>
                                Roommates (damai tapi tidak dekat)
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="rel_${otherCat.id}" value="conflict" ${currentRelation === 'conflict' ? 'checked' : ''}>
                                Tidak Cocok (hindari, bisa konflik)
                            </label>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        }
    }
    
    html += `</div>`;
    document.getElementById('catForm').innerHTML = html;
    
    // Add event listeners for sliders
    if (cat.status === 'new') {
        const dominanceSlider = document.getElementById('dominance');
        const stressSlider = document.getElementById('stress');
        const toleranceSlider = document.getElementById('tolerance');
        
        dominanceSlider.addEventListener('input', (e) => {
            document.getElementById('dominanceValue').textContent = e.target.value;
        });
        stressSlider.addEventListener('input', (e) => {
            document.getElementById('stressValue').textContent = e.target.value;
        });
        toleranceSlider.addEventListener('input', (e) => {
            document.getElementById('toleranceValue').textContent = e.target.value;
        });
    }
    
    // Update navigation buttons
    document.getElementById('prevCat').style.display = currentCatIndex === 0 ? 'none' : 'inline-block';
}

document.getElementById('prevCat').addEventListener('click', () => {
    saveCurrentCatData();
    currentCatIndex--;
    updateCatForm();
});

document.getElementById('nextCat').addEventListener('click', () => {
    saveCurrentCatData();
    if (currentCatIndex < cats.length - 1) {
        currentCatIndex++;
        updateCatForm();
    } else {
        showStep3();
    }
});

function saveCurrentCatData() {
    const cat = cats[currentCatIndex];
    const nameInput = document.getElementById('catName');
    if (nameInput) cat.name = nameInput.value;
    
    const statusSelect = document.getElementById('catStatus');
    if (statusSelect) cat.status = statusSelect.value;
    
    if (cat.status === 'new') {
        const dominance = document.getElementById('dominance');
        const stress = document.getElementById('stress');
        const tolerance = document.getElementById('tolerance');
        if (dominance) cat.traits.dominance = parseInt(dominance.value);
        if (stress) cat.traits.stress = parseInt(stress.value);
        if (tolerance) cat.traits.tolerance = parseInt(tolerance.value);
    } else {
        // Save relationships
        const otherCats = cats.filter((_, idx) => idx !== currentCatIndex);
        otherCats.forEach(otherCat => {
            const radioSelected = document.querySelector(`input[name="rel_${otherCat.id}"]:checked`);
            if (radioSelected) {
                cat.relationships[otherCat.id] = radioSelected.value;
                // Update reciprocal relationship
                cats[otherCat.id].relationships[currentCatIndex] = radioSelected.value;
            }
        });
    }
}

function showStep2() {
    step1.classList.remove('active');
    step2.classList.add('active');
}

function showStep3() {
    saveCurrentCatData();
    step2.classList.remove('active');
    step3.classList.add('active');
}

// Step 3: Luas Rumah
const calculateBtn = document.getElementById('calculateBtn');
const houseAreaInput = document.getElementById('houseArea');

calculateBtn.addEventListener('click', () => {
    const area = parseFloat(houseAreaInput.value);
    if (isNaN(area) || area < 10) {
        alert('Masukkan luas rumah yang valid (minimal 10 m²)');
        return;
    }
    
    generateRecommendations(area);
    visualizeMovement();
    step3.classList.remove('active');
    step4.classList.add('active');
});

function generateRecommendations(area) {
    const catCount = cats.length;
    const recommendedFoodBowls = Math.ceil(catCount + (catCount * 0.3));
    const recommendedLitterBoxes = Math.ceil(catCount + 1);
    
    let currentFoodBowls = 1;
    let currentLitterBoxes = 1;
    
    let html = '<ul>';
    if (currentFoodBowls < recommendedFoodBowls) {
        html += `<li>🍽️ Rekomendasi menambah ${recommendedFoodBowls - currentFoodBowls} tempat makan (total minimal ${recommendedFoodBowls})</li>`;
    } else {
        html += `<li>✅ Tempat makan sudah cukup</li>`;
    }
    
    if (currentLitterBoxes < recommendedLitterBoxes) {
        html += `<li>📦 Rekomendasi menambah ${recommendedLitterBoxes - currentLitterBoxes} kotak pasir (total minimal ${recommendedLitterBoxes})</li>`;
    } else {
        html += `<li>✅ Kotak pasir sudah cukup</li>`;
    }
    
    // Space recommendation
    const spacePerCat = area / catCount;
    if (spacePerCat < 15) {
        html += `<li>⚠️ Ruangan terbatas (${spacePerCat.toFixed(1)} m² per kucing), perlu pengaturan yang baik untuk mengurangi konflik</li>`;
    } else {
        html += `<li>✅ Ruangan cukup luas (${spacePerCat.toFixed(1)} m² per kucing)</li>`;
    }
    
    html += '</ul>';
    document.getElementById('recommendations').innerHTML = html;
    
    // Calculate conflict level
    calculateConflictLevel();
}

function calculateConflictLevel() {
    let totalConflict = 0;
    let relationshipCount = 0;
    
    for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
            const relation = cats[i].relationships[j] || 'roommates';
            let conflictScore = 0;
            
            if (relation === 'conflict') conflictScore = 80;
            else if (relation === 'roommates') conflictScore = 30;
            else if (relation === 'bestfriends') conflictScore = 10;
            
            // Add trait influence for new cats
            if (cats[i].status === 'new') {
                conflictScore += (cats[i].traits.dominance - 50) / 10;
                conflictScore += (100 - cats[i].traits.tolerance) / 10;
            }
            if (cats[j].status === 'new') {
                conflictScore += (cats[j].traits.dominance - 50) / 10;
                conflictScore += (100 - cats[j].traits.tolerance) / 10;
            }
            
            totalConflict += Math.min(100, Math.max(0, conflictScore));
            relationshipCount++;
        }
    }
    
    const conflictPercentage = relationshipCount > 0 ? totalConflict / relationshipCount : 0;
    const bar = document.getElementById('conflictBar');
    const percentage = document.getElementById('conflictPercentage');
    const status = document.getElementById('conflictStatus');
    
    bar.style.width = `${conflictPercentage}%`;
    percentage.textContent = `${Math.round(conflictPercentage)}%`;
    
    if (conflictPercentage < 30) {
        status.textContent = '😊 Kondisi harmonis! Kucing-kucing rukun satu sama lain.';
        bar.style.background = 'linear-gradient(90deg, #a8e6cf, #6bcb9a)';
    } else if (conflictPercentage < 60) {
        status.textContent = '😐 Ada beberapa ketegangan, perlu perhatian ekstra.';
        bar.style.background = 'linear-gradient(90deg, #ffd93d, #ffb347)';
    } else {
        status.textContent = '⚠️ Konflik tinggi! Perlu intervensi dan pengaturan teritori yang lebih baik.';
        bar.style.background = 'linear-gradient(90deg, #ffb3b3, #ff6b6b)';
    }
}

function visualizeMovement() {
    canvas = document.getElementById('catCanvas');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    
    // Assign random starting positions
    cats.forEach(cat => {
        cat.position = {
            x: Math.random() * (width - 100) + 50,
            y: Math.random() * (height - 100) + 50
        };
        cat.direction = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        cat.conflictCount = 0;
    });
    
    // Generate legend
    const legendDiv = document.getElementById('legend');
    legendDiv.innerHTML = cats.map(cat => `
        <div class="legend-item">
            <div class="legend-color" style="background: ${cat.color}"></div>
            <span>${cat.name}</span>
        </div>
    `).join('');
    
    drawCanvas();
}

function drawCanvas() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid (room)
    ctx.strokeStyle = '#ffccdd';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
    
    // Draw cats
    cats.forEach((cat, index) => {
        // Draw cat circle
        ctx.beginPath();
        ctx.arc(cat.position.x, cat.position.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = cat.color;
        ctx.fill();
        ctx.strokeStyle = '#5a3e4b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw cat face
        ctx.fillStyle = '#5a3e4b';
        ctx.beginPath();
        ctx.arc(cat.position.x - 8, cat.position.y - 5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cat.position.x + 8, cat.position.y - 5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ears
        ctx.beginPath();
        ctx.moveTo(cat.position.x - 15, cat.position.y - 20);
        ctx.lineTo(cat.position.x - 5, cat.position.y - 5);
        ctx.lineTo(cat.position.x - 25, cat.position.y - 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cat.position.x + 15, cat.position.y - 20);
        ctx.lineTo(cat.position.x + 5, cat.position.y - 5);
        ctx.lineTo(cat.position.x + 25, cat.position.y - 5);
        ctx.fill();
        
        // Draw name
        ctx.fillStyle = '#5a3e4b';
        ctx.font = '12px Quicksand';
        ctx.fillText(cat.name, cat.position.x - 15, cat.position.y - 25);
        
        // Draw conflict indicator
        if (cat.conflictCount > 0) {
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('!', cat.position.x + 15, cat.position.y - 15);
        }
    });
    
    // Draw connections for conflicts
    for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
            const distance = Math.hypot(cats[i].position.x - cats[j].position.x, 
                                       cats[i].position.y - cats[j].position.y);
            
            if (distance < 50) {
                const relation = cats[i].relationships[j] || 'roommates';
                if (relation === 'conflict') {
                    ctx.beginPath();
                    ctx.moveTo(cats[i].position.x, cats[i].position.y);
                    ctx.lineTo(cats[j].position.x, cats[j].position.y);
                    ctx.strokeStyle = '#ff6b6b';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    cats[i].conflictCount++;
                    cats[j].conflictCount++;
                } else if (relation === 'bestfriends') {
                    ctx.beginPath();
                    ctx.moveTo(cats[i].position.x, cats[i].position.y);
                    ctx.lineTo(cats[j].position.x, cats[j].position.y);
                    ctx.strokeStyle = '#a8e6cf';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Reset conflict count
    cats.forEach(cat => cat.conflictCount = 0);
}

function updatePositions() {
    cats.forEach(cat => {
        // Update position based on traits and relationships
        let speed = 2;
        
        if (cat.status === 'new') {
            speed = 2 + (cat.traits.stress / 100);
        }
        
        cat.position.x += cat.direction.x * speed;
        cat.position.y += cat.direction.y * speed;
        
        // Bounce off walls
        if (cat.position.x < 20 || cat.position.x > width - 20) {
            cat.direction.x *= -1;
            cat.position.x = Math.min(Math.max(cat.position.x, 20), width - 20);
        }
        if (cat.position.y < 20 || cat.position.y > height - 20) {
            cat.direction.y *= -1;
            cat.position.y = Math.min(Math.max(cat.position.y, 20), height - 20);
        }
        
        // Random direction change
        if (Math.random() < 0.02) {
            cat.direction.x += (Math.random() - 0.5) * 0.5;
            cat.direction.y += (Math.random() - 0.5) * 0.5;
            // Normalize
            const len = Math.hypot(cat.direction.x, cat.direction.y);
            if (len > 0) {
                cat.direction.x /= len;
                cat.direction.y /= len;
            }
        }
    });
    
    drawCanvas();
}

let animationFrameId = null;

function startAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    function animate() {
        updatePositions();
        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();
}

function stopAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

document.getElementById('startAnimation').addEventListener('click', () => {
    if (animationFrameId) {
        stopAnimation();
        document.getElementById('startAnimation').innerHTML = '▶ Mulai Animasi';
    } else {
        startAnimation();
        document.getElementById('startAnimation').innerHTML = '⏸ Berhenti';
    }
});

document.getElementById('resetAnimation').addEventListener('click', () => {
    stopAnimation();
    visualizeMovement();
    document.getElementById('startAnimation').innerHTML = '▶ Mulai Animasi';
});

// Initialize canvas on load
window.addEventListener('load', () => {
    canvas = document.getElementById('catCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
    }
});