// Data Storage
let cats = [];
let currentCatIndex = 0;
let animationFrameId = null;
let ctx, canvas, width, height;

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');

// ==================== STEP 1: JUMLAH KUCING ====================
const catCountInput = document.getElementById('catCount');
const nextStep1Btn = document.getElementById('nextStep1');
const errorMessage = document.getElementById('errorMessage');

nextStep1Btn.addEventListener('click', () => {
    const count = parseInt(catCountInput.value);
    
    // Validasi: wajib diisi dan angka bulat
    if (catCountInput.value === '') {
        errorMessage.textContent = '❌ Jumlah kucing harus diisi!';
        return;
    }
    
    if (isNaN(count) || !Number.isInteger(count) || count < 1 || count > 10) {
        errorMessage.textContent = '❌ Masukkan angka bulat yang valid (1-10)';
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
            name: '',
            status: 'new',
            traits: {
                dominance: 50,
                stress: 50,
                tolerance: 50
            },
            relationships: {},
            color: `hsl(${Math.random() * 360}, 70%, 65%)`,
            position: { x: 0, y: 0 },
            direction: { x: 0, y: 0 }
        });
    }
    
    // Initialize relationships
    for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
            cats[i].relationships[j] = 'roommates';
            cats[j].relationships[i] = 'roommates';
        }
    }
    
    document.getElementById('totalCats').textContent = count;
    currentCatIndex = 0;
}

function showStep2() {
    step1.classList.remove('active');
    step2.classList.add('active');
    updateCatForm();
}

// ==================== STEP 2: INFORMASI KUCING (BERTAHAP) ====================
function updateCatForm() {
    const cat = cats[currentCatIndex];
    const totalCats = cats.length;
    
    document.getElementById('catTitle').textContent = `Informasi Kucing #${currentCatIndex + 1}`;
    document.getElementById('currentCatIndex').textContent = currentCatIndex + 1;
    
    let html = `
        <div class="cat-info-form">
            <div class="form-group">
                <label>🐱 Nama Kucing</label>
                <input type="text" id="catName" value="${cat.name}" placeholder="Masukkan nama kucing" required>
            </div>
            <div class="form-group">
                <label>📋 Status Kucing</label>
                <select id="catStatus">
                    <option value="new" ${cat.status === 'new' ? 'selected' : ''}>🐣 Kucing Baru (belum pernah tinggal bersama)</option>
                    <option value="old" ${cat.status === 'old' ? 'selected' : ''}>😺 Kucing Lama (sudah tinggal bersama)</option>
                </select>
            </div>
    `;
    
    if (cat.status === 'new') {
        html += `
            <div class="form-group">
                <label>🦁 Tingkat Dominance (0-100)</label>
                <div class="slider-container">
                    <input type="range" id="dominance" min="0" max="100" value="${cat.traits.dominance}">
                    <span class="slider-value" id="dominanceValue">${cat.traits.dominance}</span>
                </div>
                <small>Semakin tinggi, semakin dominan</small>
            </div>
            <div class="form-group">
                <label>😰 Tingkat Stress (0-100)</label>
                <div class="slider-container">
                    <input type="range" id="stress" min="0" max="100" value="${cat.traits.stress}">
                    <span class="slider-value" id="stressValue">${cat.traits.stress}</span>
                </div>
                <small>Semakin tinggi, semakin mudah stres</small>
            </div>
            <div class="form-group">
                <label>🤝 Tingkat Tolerance (0-100)</label>
                <div class="slider-container">
                    <input type="range" id="tolerance" min="0" max="100" value="${cat.traits.tolerance}">
                    <span class="slider-value" id="toleranceValue">${cat.traits.tolerance}</span>
                </div>
                <small>Semakin tinggi, semakin toleran</small>
            </div>
        `;
    } else {
        // Relationship form for old cats
        const otherCats = cats.filter((_, idx) => idx !== currentCatIndex);
        if (otherCats.length > 0) {
            html += `<div class="relationship-group"><h4>🐾 Hubungan dengan kucing lain:</h4>`;
            otherCats.forEach(otherCat => {
                const currentRelation = cat.relationships[otherCat.id] || 'roommates';
                let relationText = '';
                if (currentRelation === 'bestfriends') relationText = 'Best Friends';
                else if (currentRelation === 'roommates') relationText = 'Roommates';
                else relationText = 'Tidak Cocok';
                
                html += `
                    <div class="form-group">
                        <label>Hubungan dengan ${otherCat.name || `Kucing ${otherCat.id + 1}`}</label>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="rel_${otherCat.id}" value="bestfriends" ${currentRelation === 'bestfriends' ? 'checked' : ''}>
                                💖 Best Friends (tidur bareng, grooming, main bareng)
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="rel_${otherCat.id}" value="roommates" ${currentRelation === 'roommates' ? 'checked' : ''}>
                                🏠 Roommates (damai tapi tidak dekat, time-sharing)
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="rel_${otherCat.id}" value="conflict" ${currentRelation === 'conflict' ? 'checked' : ''}>
                                ⚠️ Tidak Cocok (hindari satu sama lain, bisa konflik)
                            </label>
                        </div>
                    </div>
                `;
            });
            html += `</div>`;
        } else {
            html += `<p class="subtitle">Tidak ada kucing lain untuk dihubungkan</p>`;
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
    const prevBtn = document.getElementById('prevCat');
    const nextBtn = document.getElementById('nextCat');
    const finishBtn = document.getElementById('finishCats');
    
    // Show prev button if not first cat
    prevBtn.style.display = currentCatIndex === 0 ? 'none' : 'inline-block';
    
    // Show next or finish based on if it's the last cat
    if (currentCatIndex === totalCats - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        finishBtn.style.display = 'none';
    }
}

function saveCurrentCatData() {
    const cat = cats[currentCatIndex];
    const nameInput = document.getElementById('catName');
    if (nameInput && nameInput.value.trim() !== '') {
        cat.name = nameInput.value.trim();
    } else {
        cat.name = `Kucing ${currentCatIndex + 1}`;
    }
    
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
                cats[otherCat.id].relationships[currentCatIndex] = radioSelected.value;
            }
        });
    }
}

// Previous cat button
document.getElementById('prevCat').addEventListener('click', () => {
    saveCurrentCatData();
    currentCatIndex--;
    updateCatForm();
});

// Next cat button
document.getElementById('nextCat').addEventListener('click', () => {
    saveCurrentCatData();
    currentCatIndex++;
    updateCatForm();
});

// Finish cats button
document.getElementById('finishCats').addEventListener('click', () => {
    saveCurrentCatData();
    
    // Validasi: pastikan semua kucing punya nama (optional, tapi lebih baik)
    let allHaveNames = true;
    cats.forEach(cat => {
        if (!cat.name || cat.name.trim() === '') {
            allHaveNames = false;
        }
    });
    
    if (!allHaveNames) {
        alert('Beberapa kucing belum diberi nama. Nama default akan digunakan.');
    }
    
    showStep3();
});

function showStep3() {
    step2.classList.remove('active');
    step3.classList.add('active');
}

// ==================== STEP 3: LUAS RUMAH ====================
const calculateBtn = document.getElementById('calculateBtn');
const houseAreaInput = document.getElementById('houseArea');
const areaError = document.getElementById('areaError');

calculateBtn.addEventListener('click', () => {
    const area = parseFloat(houseAreaInput.value);
    
    // Validasi: wajib diisi
    if (houseAreaInput.value === '') {
        areaError.textContent = '❌ Luas rumah harus diisi!';
        return;
    }
    
    if (isNaN(area) || area < 10) {
        areaError.textContent = '❌ Masukkan luas rumah yang valid (minimal 10 m²)';
        return;
    }
    
    areaError.textContent = '';
    generateRecommendations(area);
    showStep4();
});

function showStep4() {
    step3.classList.remove('active');
    step4.classList.add('active');
    visualizeMovement();
}

// ==================== REKOMENDASI & VISUALISASI ====================
function generateRecommendations(area) {
    const catCount = cats.length;
    const recommendedFoodBowls = Math.ceil(catCount + (catCount * 0.3));
    const recommendedLitterBoxes = Math.ceil(catCount + 1);
    
    let html = '<ul>';
    html += `<li>🍽️ Tempat makan: minimal ${recommendedFoodBowls} buah (${catCount} kucing + 30% cadangan)</li>`;
    html += `<li>📦 Kotak pasir: minimal ${recommendedLitterBoxes} buah (jumlah kucing + 1)</li>`;
    
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
                conflictScore += (cats[i].traits.dominance - 50) / 5;
                conflictScore += (100 - cats[i].traits.tolerance) / 5;
            }
            if (cats[j].status === 'new') {
                conflictScore += (cats[j].traits.dominance - 50) / 5;
                conflictScore += (100 - cats[j].traits.tolerance) / 5;
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

// ==================== CANVIS ANIMASI ====================
function visualizeMovement() {
    canvas = document.getElementById('catCanvas');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    
    // Assign random starting positions and directions
    cats.forEach(cat => {
        cat.position = {
            x: Math.random() * (width - 100) + 50,
            y: Math.random() * (height - 100) + 50
        };
        cat.direction = {
            x: (Math.random() - 0.5) * 1.5,
            y: (Math.random() - 0.5) * 1.5
        };
        cat.conflictCount = 0;
    });
    
    // Generate legend
    const legendDiv = document.getElementById('legend');
    legendDiv.innerHTML = cats.map(cat => `
        <div class="legend-item">
            <div class="legend-color" style="background: ${cat.color}"></div>
            <span>${cat.name || `Kucing ${cat.id + 1}`}</span>
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
    
    // Reset conflict count
    cats.forEach(cat => cat.conflictCount = 0);
    
    // Draw connections first (so they appear behind cats)
    for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
            const distance = Math.hypot(cats[i].position.x - cats[j].position.x, 
                                       cats[i].position.y - cats[j].position.y);
            
            if (distance < 60) {
                const relation = cats[i].relationships[j] || 'roommates';
                if (relation === 'conflict') {
                    ctx.beginPath();
                    ctx.moveTo(cats[i].position.x, cats[i].position.y);
                    ctx.lineTo(cats[j].position.x, cats[j].position.y);
                    ctx.strokeStyle = '#ff6b6b';
                    ctx.lineWidth = 3;
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
    
    // Draw cats
    cats.forEach((cat, index) => {
        // Draw cat circle
        ctx.beginPath();
        ctx.arc(cat.position.x, cat.position.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = cat.color;
        ctx.fill();
        ctx.strokeStyle = '#5a3e4b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw cat face
        ctx.fillStyle = '#5a3e4b';
        ctx.beginPath();
        ctx.arc(cat.position.x - 7, cat.position.y - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cat.position.x + 7, cat.position.y - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw nose
        ctx.fillStyle = '#ff9999';
        ctx.beginPath();
        ctx.arc(cat.position.x, cat.position.y + 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ears
        ctx.fillStyle = cat.color;
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
        ctx.font = 'bold 12px Quicksand';
        ctx.fillText(cat.name || `Kucing ${cat.id + 1}`, cat.position.x - 20, cat.position.y - 28);
        
        // Draw conflict indicator
        if (cat.conflictCount > 0) {
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 24px Arial';
            ctx.fillText('⚠️', cat.position.x + 15, cat.position.y - 20);
        }
    });
}

function updatePositions() {
    cats.forEach(cat => {
        // Speed based on stress level for new cats
        let speed = 1.5;
        if (cat.status === 'new') {
            speed = 1.5 + (cat.traits.stress / 100);
        }
        
        cat.position.x += cat.direction.x * speed;
        cat.position.y += cat.direction.y * speed;
        
        // Bounce off walls
        if (cat.position.x < 25 || cat.position.x > width - 25) {
            cat.direction.x *= -1;
            cat.position.x = Math.min(Math.max(cat.position.x, 25), width - 25);
        }
        if (cat.position.y < 25 || cat.position.y > height - 25) {
            cat.direction.y *= -1;
            cat.position.y = Math.min(Math.max(cat.position.y, 25), height - 25);
        }
        
        // Random direction change
        if (Math.random() < 0.02) {
            cat.direction.x += (Math.random() - 0.5) * 0.8;
            cat.direction.y += (Math.random() - 0.5) * 0.8;
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

function startAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        document.getElementById('startAnimation').innerHTML = '▶ Mulai Animasi';
    } else {
        function animate() {
            updatePositions();
            animationFrameId = requestAnimationFrame(animate);
        }
        animate();
        document.getElementById('startAnimation').innerHTML = '⏸ Berhenti';
    }
}

function stopAndReset() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    visualizeMovement();
    document.getElementById('startAnimation').innerHTML = '▶ Mulai Animasi';
}

document.getElementById('startAnimation').addEventListener('click', startAnimation);
document.getElementById('resetAnimation').addEventListener('click', stopAndReset);

// Initialize canvas on load
window.addEventListener('load', () => {
    canvas = document.getElementById('catCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
    }
});
