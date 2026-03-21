// Data Storage
let cats = [];
let animationFrameId = null;
let ctx, canvas, width, height;
let fightEffects = [];
let houseArea = 0; // Menyimpan luas rumah yang diinput user
let houseScale = 1; // Skala untuk konversi luas rumah ke pixel canvas

// DOM Elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');

// ==================== FUNGSI BACK ====================
document.getElementById('backToStep1From2').addEventListener('click', () => {
    if (confirm('Kembali ke halaman awal? Data kucing yang sudah diisi akan tersimpan.')) {
        saveAllCatsData();
        step2.classList.remove('active');
        step1.classList.add('active');
        document.getElementById('catCount').value = cats.length;
    }
});

document.getElementById('backToStep2').addEventListener('click', () => {
    step3.classList.remove('active');
    step2.classList.add('active');
    renderAllCatsForm();
});

document.getElementById('backToStep3').addEventListener('click', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    step4.classList.remove('active');
    step3.classList.add('active');
});

// ==================== STEP 1: JUMLAH KUCING ====================
const catCountInput = document.getElementById('catCount');
const nextStep1Btn = document.getElementById('nextStep1');
const errorMessage = document.getElementById('errorMessage');

nextStep1Btn.addEventListener('click', () => {
    const count = parseInt(catCountInput.value);
    
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
            direction: { x: 0, y: 0 },
            fighting: false,
            fightTimer: 0
        });
    }
    
    // Initialize relationships
    for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
            cats[i].relationships[j] = 'roommates';
            cats[j].relationships[i] = 'roommates';
        }
    }
}

function showStep2() {
    step1.classList.remove('active');
    step2.classList.add('active');
    renderAllCatsForm();
}

// ==================== STEP 2: RENDER SEMUA KUCING DALAM 1 HALAMAN ====================
function renderAllCatsForm() {
    const container = document.getElementById('allCatsForm');
    let html = '';
    
    cats.forEach((cat, index) => {
        const catNumber = index + 1;
        
        html += `
            <div class="cat-form-card" data-cat-id="${cat.id}">
                <div class="cat-form-header">
                    <div class="cat-number">${catNumber}</div>
                    <h3>${cat.name || `Kucing ${catNumber}`}</h3>
                </div>
                <div class="cat-form-body">
                    <div class="form-group">
                        <label>🐱 Nama Kucing</label>
                        <input type="text" class="cat-name" value="${escapeHtml(cat.name)}" placeholder="Masukkan nama kucing" data-id="${cat.id}">
                    </div>
                    
                    <div class="form-group">
                        <label>📋 Status Kucing</label>
                        <select class="cat-status" data-id="${cat.id}">
                            <option value="new" ${cat.status === 'new' ? 'selected' : ''}>🐣 Kucing Baru (belum pernah tinggal bersama)</option>
                            <option value="old" ${cat.status === 'old' ? 'selected' : ''}>😺 Kucing Lama (sudah tinggal bersama)</option>
                        </select>
                    </div>
                    
                    <div class="traits-section" id="traits-${cat.id}" style="${cat.status === 'new' ? 'display: block;' : 'display: none;'}">
                        <div class="form-group">
                            <label>🦁 Tingkat Dominance (0-100)</label>
                            <div class="slider-wrapper">
                                <input type="range" class="dominance-slider" min="0" max="100" value="${cat.traits.dominance}" data-id="${cat.id}">
                                <span class="trait-value" id="dominance-val-${cat.id}">${cat.traits.dominance}</span>
                            </div>
                            <div class="helper-text">Semakin tinggi, semakin dominan</div>
                        </div>
                        <div class="form-group">
                            <label>😰 Tingkat Stress (0-100)</label>
                            <div class="slider-wrapper">
                                <input type="range" class="stress-slider" min="0" max="100" value="${cat.traits.stress}" data-id="${cat.id}">
                                <span class="trait-value" id="stress-val-${cat.id}">${cat.traits.stress}</span>
                            </div>
                            <div class="helper-text">Semakin tinggi, semakin mudah stres</div>
                        </div>
                        <div class="form-group">
                            <label>🤝 Tingkat Tolerance (0-100)</label>
                            <div class="slider-wrapper">
                                <input type="range" class="tolerance-slider" min="0" max="100" value="${cat.traits.tolerance}" data-id="${cat.id}">
                                <span class="trait-value" id="tolerance-val-${cat.id}">${cat.traits.tolerance}</span>
                            </div>
                            <div class="helper-text">Semakin tinggi, semakin toleran</div>
                        </div>
                    </div>
                    
                    <div class="relationships-section" id="relationships-${cat.id}" style="${cat.status === 'old' ? 'display: block;' : 'display: none;'}">
                        ${renderRelationships(cat, index)}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    addFormEventListeners();
}

function renderRelationships(cat, catIndex) {
    const otherOldCats = cats.filter((otherCat, idx) => idx !== catIndex && otherCat.status === 'old');
    
    if (otherOldCats.length === 0) {
        return `
            <div class="relationships-title">🐾 Hubungan dengan kucing lain:</div>
            <p class="helper-text">Belum ada kucing lama lain untuk dihubungkan. Hubungan akan otomatis terisi saat ada kucing lama lain.</p>
        `;
    }
    
    let html = '<div class="relationships-title">🐾 Hubungan dengan kucing lama lain:</div>';
    html += '<div class="radio-group-vertical">';
    
    otherOldCats.forEach(otherCat => {
        const currentRelation = cat.relationships[otherCat.id] || 'roommates';
        const relationLabels = {
            'bestfriends': '💖 Best Friends',
            'roommates': '🏠 Roommates',
            'conflict': '⚠️ Tidak Cocok'
        };
        
        const relationDescriptions = {
            'bestfriends': 'tidur bareng, grooming, main bareng',
            'roommates': 'damai tapi tidak dekat, time-sharing',
            'conflict': 'hindari satu sama lain, bisa konflik'
        };
        
        html += `
            <div class="radio-card" data-cat="${cat.id}" data-other="${otherCat.id}" data-value="${currentRelation}">
                <input type="radio" name="rel_${cat.id}_${otherCat.id}" value="bestfriends" ${currentRelation === 'bestfriends' ? 'checked' : ''}>
                <label>
                    <strong>${otherCat.name || `Kucing ${otherCat.id + 1}`}</strong><br>
                    <span style="font-size: 0.9rem;">${relationLabels.bestfriends}</span>
                    <div class="radio-desc">✨ ${relationDescriptions.bestfriends}</div>
                </label>
            </div>
            <div class="radio-card" data-cat="${cat.id}" data-other="${otherCat.id}" data-value="${currentRelation}">
                <input type="radio" name="rel_${cat.id}_${otherCat.id}" value="roommates" ${currentRelation === 'roommates' ? 'checked' : ''}>
                <label>
                    <strong>${otherCat.name || `Kucing ${otherCat.id + 1}`}</strong><br>
                    <span style="font-size: 0.9rem;">${relationLabels.roommates}</span>
                    <div class="radio-desc">🏡 ${relationDescriptions.roommates}</div>
                </label>
            </div>
            <div class="radio-card" data-cat="${cat.id}" data-other="${otherCat.id}" data-value="${currentRelation}">
                <input type="radio" name="rel_${cat.id}_${otherCat.id}" value="conflict" ${currentRelation === 'conflict' ? 'checked' : ''}>
                <label>
                    <strong>${otherCat.name || `Kucing ${otherCat.id + 1}`}</strong><br>
                    <span style="font-size: 0.9rem;">${relationLabels.conflict}</span>
                    <div class="radio-desc">💢 ${relationDescriptions.conflict}</div>
                </label>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function addFormEventListeners() {
    document.querySelectorAll('.cat-name').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            cats[id].name = e.target.value;
        });
    });
    
    document.querySelectorAll('.cat-status').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const oldStatus = cats[id].status;
            cats[id].status = e.target.value;
            
            const traitsSection = document.getElementById(`traits-${id}`);
            const relationshipsSection = document.getElementById(`relationships-${id}`);
            
            if (e.target.value === 'new') {
                traitsSection.style.display = 'block';
                relationshipsSection.style.display = 'none';
            } else {
                traitsSection.style.display = 'none';
                relationshipsSection.style.display = 'block';
            }
            
            if (oldStatus === 'new' && e.target.value === 'old') {
                renderAllCatsForm();
            }
            
            if (oldStatus === 'old' && e.target.value === 'new') {
                for (let i = 0; i < cats.length; i++) {
                    if (i !== id) {
                        delete cats[id].relationships[i];
                        delete cats[i].relationships[id];
                    }
                }
                renderAllCatsForm();
            }
        });
    });
    
    document.querySelectorAll('.dominance-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const id = parseInt(e.target.dataset.id);
            const value = parseInt(e.target.value);
            cats[id].traits.dominance = value;
            document.getElementById(`dominance-val-${id}`).textContent = value;
        });
    });
    
    document.querySelectorAll('.stress-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const id = parseInt(e.target.dataset.id);
            const value = parseInt(e.target.value);
            cats[id].traits.stress = value;
            document.getElementById(`stress-val-${id}`).textContent = value;
        });
    });
    
    document.querySelectorAll('.tolerance-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const id = parseInt(e.target.dataset.id);
            const value = parseInt(e.target.value);
            cats[id].traits.tolerance = value;
            document.getElementById(`tolerance-val-${id}`).textContent = value;
        });
    });
    
    document.querySelectorAll('input[type="radio"][name^="rel_"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const nameParts = e.target.name.split('_');
            const catId = parseInt(nameParts[1]);
            const otherId = parseInt(nameParts[2]);
            const value = e.target.value;
            
            cats[catId].relationships[otherId] = value;
            cats[otherId].relationships[catId] = value;
        });
    });
    
    document.querySelectorAll('.radio-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.type === 'radio') return;
            const radio = card.querySelector('input[type="radio"]');
            if (radio && !radio.checked) {
                radio.checked = true;
                const event = new Event('change', { bubbles: true });
                radio.dispatchEvent(event);
            }
        });
        
        const radio = card.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            card.classList.add('selected');
        }
        
        if (radio) {
            radio.addEventListener('change', (e) => {
                document.querySelectorAll(`.radio-card[data-cat="${card.dataset.cat}"][data-other="${card.dataset.other}"]`).forEach(c => {
                    c.classList.remove('selected');
                });
                if (e.target.checked) {
                    card.classList.add('selected');
                }
            });
        }
    });
}

function saveAllCatsData() {
    cats.forEach((cat, index) => {
        if (!cat.name || cat.name.trim() === '') {
            cat.name = `Kucing ${index + 1}`;
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

document.getElementById('saveAndContinue').addEventListener('click', () => {
    saveAllCatsData();
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
    
    if (houseAreaInput.value === '') {
        areaError.textContent = '❌ Luas rumah harus diisi!';
        return;
    }
    
    if (isNaN(area) || area < 1) {
        areaError.textContent = '❌ Masukkan luas rumah yang valid (minimal 1 m²)';
        return;
    }
    
    areaError.textContent = '';
    houseArea = area; // Simpan luas rumah
    generateRecommendations(area);
    showStep4();
});

function showStep4() {
    step3.classList.remove('active');
    step4.classList.add('active');
    visualizeMovement();
}

// ==================== REKOMENDASI ====================
function generateRecommendations(area) {
    const catCount = cats.length;
    const recommendedFoodBowls = Math.ceil(catCount + (catCount * 0.3));
    const recommendedLitterBoxes = Math.ceil(catCount + 1);
    
    let html = '<ul>';
    html += `<li>🍽️ Tempat makan: minimal ${recommendedFoodBowls} buah (${catCount} kucing + 30% cadangan)</li>`;
    html += `<li>📦 Kotak pasir: minimal ${recommendedLitterBoxes} buah (jumlah kucing + 1)</li>`;
    
    const spacePerCat = area / catCount;
    
    if (spacePerCat < 2) {
        html += `<li>⚠️ Ruangan sangat sempit! (${spacePerCat.toFixed(1)} m² per kucing). Kucing butuh ruang gerak yang cukup.</li>`;
    } else if (spacePerCat < 5) {
        html += `<li>⚠️ Ruangan terbatas (${spacePerCat.toFixed(1)} m² per kucing), perlu pengaturan yang baik untuk mengurangi konflik</li>`;
    } else if (spacePerCat < 10) {
        html += `<li>😐 Ruangan cukup (${spacePerCat.toFixed(1)} m² per kucing), masih perlu perhatian ekstra</li>`;
    } else if (spacePerCat < 15) {
        html += `<li>👍 Ruangan lumayan luas (${spacePerCat.toFixed(1)} m² per kucing)</li>`;
    } else {
        html += `<li>✅ Ruangan sangat luas (${spacePerCat.toFixed(1)} m² per kucing), kucing akan nyaman!</li>`;
    }
    
    if (area < 5) {
        html += `<li>🏠 Rumah sangat kecil! Rekomendasi: tambahkan vertical space (cat tree, rak) untuk memaksimalkan ruang</li>`;
    } else if (area < 10) {
        html += `<li>📦 Rumah kecil, pertimbangkan untuk menambah tempat persembunyian dan vertical space</li>`;
    }
    
    html += '</ul>';
    document.getElementById('recommendations').innerHTML = html;
    
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

// ==================== CANVAS ANIMASI DENGAN SKALA RUMAH ====================
function visualizeMovement() {
    canvas = document.getElementById('catCanvas');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    
    // Hitung skala: lebar rumah = sqrt(area) (karena bentuk persegi)
    // Asumsi rumah berbentuk persegi, jadi panjang sisi = sqrt(area)
    const houseSide = Math.sqrt(houseArea);
    // Skala: 1 meter dalam rumah = berapa pixel di canvas?
    // Kita mapping sisi rumah ke 90% dari ukuran canvas (biar ada margin)
    const maxDimension = Math.min(width, height) * 0.85;
    houseScale = maxDimension / houseSide;
    
    fightEffects = [];
    
    cats.forEach(cat => {
        // Posisi awal dalam meter (koordinat rumah)
        const startX = Math.random() * houseSide;
        const startY = Math.random() * houseSide;
        
        // Konversi ke pixel canvas
        cat.position = {
            x: (startX * houseScale) + (width - (houseSide * houseScale)) / 2,
            y: (startY * houseScale) + (height - (houseSide * houseScale)) / 2
        };
        
        // Arah gerak dalam meter per frame
        cat.direction = {
            x: (Math.random() - 0.5) * 1.5,
            y: (Math.random() - 0.5) * 1.5
        };
        cat.fighting = false;
        cat.fightTimer = 0;
    });
    
    // Generate legend
    const legendDiv = document.getElementById('legend');
    legendDiv.innerHTML = cats.map(cat => `
        <div class="legend-item">
            <div class="legend-color" style="background: ${cat.color}"></div>
            <span>${cat.name || `Kucing ${cat.id + 1}`}</span>
        </div>
    `).join('');
    
    // Tambahkan informasi luas rumah di canvas
    drawCanvas();
}

function drawCanvas() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    
    // Hitung offset untuk menempatkan rumah di tengah canvas
    const houseSideMeters = Math.sqrt(houseArea);
    const houseSidePixels = houseSideMeters * houseScale;
    const offsetX = (width - houseSidePixels) / 2;
    const offsetY = (height - houseSidePixels) / 2;
    
    // Draw area rumah (background putih dengan border pink)
    ctx.fillStyle = '#fff5f7';
    ctx.fillRect(offsetX, offsetY, houseSidePixels, houseSidePixels);
    ctx.strokeStyle = '#e68a9e';
    ctx.lineWidth = 3;
    ctx.strokeRect(offsetX, offsetY, houseSidePixels, houseSidePixels);
    
    // Draw grid dalam rumah (setiap 1 meter)
    ctx.strokeStyle = '#ffccdd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= houseSideMeters; i++) {
        const x = offsetX + (i * houseScale);
        const y = offsetY + (i * houseScale);
        
        ctx.beginPath();
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + houseSidePixels);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + houseSidePixels, y);
        ctx.stroke();
    }
    
    // Draw label ukuran rumah
    ctx.fillStyle = '#b8909e';
    ctx.font = '12px Quicksand';
    ctx.fillText(`Luas rumah: ${houseArea} m²`, offsetX + 10, offsetY + 20);
    ctx.fillText(`${houseSideMeters.toFixed(1)} m`, offsetX + houseSidePixels - 40, offsetY + houseSidePixels - 5);
    
    // Update fight timers
    for (let i = 0; i < fightEffects.length; i++) {
        fightEffects[i].timer--;
        if (fightEffects[i].timer <= 0) {
            fightEffects.splice(i, 1);
            i--;
        }
    }
    
    // Draw fight effects
    fightEffects.forEach(effect => {
        const alpha = effect.timer / 30;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 107, ${alpha * 0.5})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 107, ${alpha * 0.7})`;
        ctx.fill();
    });
    
    // Draw connections
    for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
            const distance = Math.hypot(cats[i].position.x - cats[j].position.x, 
                                       cats[i].position.y - cats[j].position.y);
            const relation = cats[i].relationships[j] || 'roommates';
            
            // Jarak konflik dalam pixel (skala 1 meter = houseScale pixel)
            const conflictDistancePx = 0.5 * houseScale; // 0.5 meter dalam pixel
            
            if (distance < conflictDistancePx * 2) {
                if (relation === 'conflict') {
                    ctx.beginPath();
                    ctx.moveTo(cats[i].position.x, cats[i].position.y);
                    ctx.lineTo(cats[j].position.x, cats[j].position.y);
                    ctx.strokeStyle = '#ff6b6b';
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.moveTo(cats[i].position.x, cats[i].position.y);
                    ctx.lineTo(cats[j].position.x, cats[j].position.y);
                    ctx.strokeStyle = '#ff4444';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    
                } else if (relation === 'bestfriends') {
                    ctx.beginPath();
                    ctx.moveTo(cats[i].position.x, cats[i].position.y);
                    ctx.lineTo(cats[j].position.x, cats[j].position.y);
                    ctx.strokeStyle = '#a8e6cf';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                } else if (relation === 'roommates') {
                    ctx.beginPath();
                    ctx.moveTo(cats[i].position.x, cats[i].position.y);
                    ctx.lineTo(cats[j].position.x, cats[j].position.y);
                    ctx.strokeStyle = '#ffccdd';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Draw cats
    cats.forEach((cat, index) => {
        if (cat.fighting) {
            ctx.shadowColor = 'rgba(255, 107, 107, 0.8)';
            ctx.shadowBlur = 15;
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(cat.position.x, cat.position.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = cat.color;
        ctx.fill();
        ctx.strokeStyle = '#5a3e4b';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        if (cat.fighting) {
            ctx.beginPath();
            ctx.moveTo(cat.position.x - 12, cat.position.y - 12);
            ctx.lineTo(cat.position.x - 4, cat.position.y - 8);
            ctx.lineTo(cat.position.x - 12, cat.position.y - 4);
            ctx.fillStyle = '#5a3e4b';
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(cat.position.x + 12, cat.position.y - 12);
            ctx.lineTo(cat.position.x + 4, cat.position.y - 8);
            ctx.lineTo(cat.position.x + 12, cat.position.y - 4);
            ctx.fill();
        }
        
        ctx.fillStyle = '#5a3e4b';
        ctx.beginPath();
        ctx.arc(cat.position.x - 7, cat.position.y - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cat.position.x + 7, cat.position.y - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        if (cat.fighting) {
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(cat.position.x - 7, cat.position.y - 5, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cat.position.x + 7, cat.position.y - 5, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#ff9999';
        ctx.beginPath();
        ctx.arc(cat.position.x, cat.position.y + 2, 2, 0, Math.PI * 2);
        ctx.fill();
        
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
        
        ctx.fillStyle = '#5a3e4b';
        ctx.font = 'bold 12px Quicksand';
        ctx.fillText(cat.name || `Kucing ${cat.id + 1}`, cat.position.x - 20, cat.position.y - 28);
        
        if (cat.fighting) {
            ctx.fillStyle = '#ff6b6b';
            ctx.font = 'bold 32px Arial';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff0000';
            ctx.fillText('❗', cat.position.x + 15, cat.position.y - 25);
            ctx.font = 'bold 24px Arial';
            ctx.fillText('⚡', cat.position.x + 5, cat.position.y - 35);
            ctx.shadowBlur = 0;
        }
    });
}

function updatePositions() {
    // Hitung batas rumah dalam pixel
    const houseSideMeters = Math.sqrt(houseArea);
    const houseSidePixels = houseSideMeters * houseScale;
    const offsetX = (width - houseSidePixels) / 2;
    const offsetY = (height - houseSidePixels) / 2;
    const minX = offsetX + 20;
    const maxX = offsetX + houseSidePixels - 20;
    const minY = offsetY + 20;
    const maxY = offsetY + houseSidePixels - 20;
    
    cats.forEach(cat => {
        if (cat.fightTimer > 0) {
            cat.fightTimer--;
            if (cat.fightTimer <= 0) {
                cat.fighting = false;
            }
        }
    });
    
    // Deteksi konflik dengan jarak yang diskalakan
    for (let i = 0; i < cats.length; i++) {
        for (let j = i + 1; j < cats.length; j++) {
            const distance = Math.hypot(cats[i].position.x - cats[j].position.x, 
                                       cats[i].position.y - cats[j].position.y);
            const relation = cats[i].relationships[j] || 'roommates';
            const conflictDistancePx = 0.5 * houseScale; // 0.5 meter dalam pixel
            
            if (relation === 'conflict' && distance < conflictDistancePx) {
                cats[i].fighting = true;
                cats[j].fighting = true;
                cats[i].fightTimer = 40;
                cats[j].fightTimer = 40;
                
                fightEffects.push({
                    x: (cats[i].position.x + cats[j].position.x) / 2,
                    y: (cats[i].position.y + cats[j].position.y) / 2,
                    timer: 30
                });
                
                const angle = Math.atan2(cats[j].position.y - cats[i].position.y, 
                                         cats[j].position.x - cats[i].position.x);
                const force = 15;
                cats[i].position.x -= Math.cos(angle) * force;
                cats[i].position.y -= Math.sin(angle) * force;
                cats[j].position.x += Math.cos(angle) * force;
                cats[j].position.y += Math.sin(angle) * force;
                
                cats[i].direction.x += (Math.random() - 0.5) * 1;
                cats[i].direction.y += (Math.random() - 0.5) * 1;
                cats[j].direction.x += (Math.random() - 0.5) * 1;
                cats[j].direction.y += (Math.random() - 0.5) * 1;
                
                let len = Math.hypot(cats[i].direction.x, cats[i].direction.y);
                if (len > 0) {
                    cats[i].direction.x /= len;
                    cats[i].direction.y /= len;
                }
                len = Math.hypot(cats[j].direction.x, cats[j].direction.y);
                if (len > 0) {
                    cats[j].direction.x /= len;
                    cats[j].direction.y /= len;
                }
            }
        }
    }
    
    // Update posisi dengan kecepatan yang diskalakan
    cats.forEach(cat => {
        // Kecepatan dalam meter per frame (dikalikan scale untuk pixel)
        let speedMeters = 0.08;
        if (cat.status === 'new') {
            speedMeters = 0.08 + (cat.traits.stress / 1000);
        }
        
        if (cat.fighting) {
            speedMeters = 0.15;
        }
        
        const speedPx = speedMeters * houseScale;
        
        cat.position.x += cat.direction.x * speedPx;
        cat.position.y += cat.direction.y * speedPx;
        
        // Batas dalam rumah (dengan margin 20px dari tepi)
        if (cat.position.x < minX) {
            cat.position.x = minX;
            cat.direction.x *= -1;
        }
        if (cat.position.x > maxX) {
            cat.position.x = maxX;
            cat.direction.x *= -1;
        }
        if (cat.position.y < minY) {
            cat.position.y = minY;
            cat.direction.y *= -1;
        }
        if (cat.position.y > maxY) {
            cat.position.y = maxY;
            cat.direction.y *= -1;
        }
        
        // Random direction change
        if (Math.random() < 0.02 && !cat.fighting) {
            cat.direction.x += (Math.random() - 0.5) * 0.5;
            cat.direction.y += (Math.random() - 0.5) * 0.5;
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

window.addEventListener('load', () => {
    canvas = document.getElementById('catCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
    }
});
