/* ==========================================================================
   AIS TECHNOLOGIES - CLIENT RUNTIME LOGIC
   ========================================================================== */

// 1. TOP SCHEMATIC VIEWER TABS (Hardware vs Software)
window.switchSchematic = function(tabId) {
  // Update buttons
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  var activeBtn = document.getElementById('btn-' + tabId);
  if (activeBtn) activeBtn.classList.add('active');

  // Update diagrams
  document.querySelectorAll('.diagram-img').forEach(function(img) {
    img.classList.remove('active');
    img.style.display = 'none';
  });
  var activeImg = document.getElementById('diag-' + tabId);
  if (activeImg) {
    activeImg.classList.add('active');
    activeImg.style.display = 'block';
  }
};
// Lightbox Modal Controls
function openLightbox(src, title) {
  const modal = document.getElementById('schematic-lightbox');
  const img = document.getElementById('lightbox-img');
  const titleElem = document.getElementById('lightbox-title');
  if (modal && img) {
    img.src = src;
    if (titleElem) titleElem.textContent = title;
    modal.style.display = 'flex';
  }
}

function closeLightbox() {
  const modal = document.getElementById('schematic-lightbox');
  if (modal) modal.style.display = 'none';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Deliverables Station Tab Switching
function openUeocTab(evt, panelId) {
  document.querySelectorAll('.ueoc-panel').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  document.querySelectorAll('.ueoc-tab-btn').forEach(b => {
    b.classList.remove('active');
  });

  const targetPanel = document.getElementById(panelId);
  if (targetPanel) {
    targetPanel.classList.add('active');
    targetPanel.style.display = 'block';
  }

  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add('active');
  }
}

// Sub-View Switcher (Matrix vs Calc)
function switchSubView(view) {
  const table = document.getElementById('ueoc-sub-table');
  const calc = document.getElementById('ueoc-sub-calc');
  const btnT = document.getElementById('sub-btn-table');
  const btnC = document.getElementById('sub-btn-calc');

  if (view === 'table') {
    if (table) table.style.display = 'block';
    if (calc) calc.style.display = 'none';
    if (btnT) btnT.classList.add('active');
    if (btnC) btnC.classList.remove('active');
  } else {
    if (table) table.style.display = 'none';
    if (calc) calc.style.display = 'block';
    if (btnC) btnC.classList.add('active');
    if (btnT) btnT.classList.remove('active');
    runStorageMath();
  }
}

// Storage Retention Calculator
function runStorageMath() {
  const camsInput = document.getElementById('cams-range');
  const bitInput = document.getElementById('bitrate-range');
  const daysInput = document.getElementById('days-range');

  if (!camsInput || !bitInput || !daysInput) return;

  const cams = parseInt(camsInput.value, 10);
  const mbps = parseFloat(bitInput.value);
  const days = parseInt(daysInput.value, 10);

  const camsLabel = document.getElementById('cams-num');
  const bitrateLabel = document.getElementById('bitrate-num');
  const daysLabel = document.getElementById('days-num');

  if (camsLabel) camsLabel.textContent = `${cams} Channel${cams > 1 ? 's' : ''}`;
  if (bitrateLabel) bitrateLabel.textContent = `${mbps} Mbps`;
  if (daysLabel) daysLabel.textContent = `${days} Days`;

  const ratePerHour = ((mbps * 3600) / 8000) * cams;
  const totalGB = Math.round(ratePerHour * 24 * days);

  const outRate = document.getElementById('out-rate-hr');
  const outTotal = document.getElementById('out-total-gb');

  if (outRate) outRate.textContent = `${ratePerHour.toFixed(2)} GB/hr`;
  if (outTotal) outTotal.textContent = `${totalGB.toLocaleString()} GB`;
}

document.addEventListener('DOMContentLoaded', () => {
  runStorageMath();
});

// 2. DELIVERABLES HORIZONTAL STATION TABS (01, 02, 03, 04)
window.openUeocTab = function(evt, panelId) {
  // Hide all panels
  document.querySelectorAll('.ueoc-panel').forEach(function(p) {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  // Reset tab button states
  document.querySelectorAll('.ueoc-tab-btn').forEach(function(b) {
    b.classList.remove('active');
  });

  // Show active panel
  var target = document.getElementById(panelId);
  if (target) {
    target.classList.add('active');
    target.style.display = 'block';
  }

  // Activate clicked button
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add('active');
  }
};

// 3. PROTOCOL MATRIX VS RETENTION ENGINE SUB-TOGGLE
window.switchSubView = function(view) {
  var table = document.getElementById('ueoc-sub-table');
  var calc = document.getElementById('ueoc-sub-calc');
  var btnT = document.getElementById('sub-btn-table');
  var btnC = document.getElementById('sub-btn-calc');

  if (view === 'table') {
    if (table) table.style.display = 'block';
    if (calc) calc.style.display = 'none';
    if (btnT) btnT.classList.add('active');
    if (btnC) btnC.classList.remove('active');
  } else {
    if (table) table.style.display = 'none';
    if (calc) calc.style.display = 'block';
    if (btnC) btnC.classList.add('active');
    if (btnT) btnT.classList.remove('active');
    runStorageMath();
  }
};

// 4. DYNAMIC STORAGE RETENTION ENGINE
window.runStorageMath = function() {
  var camsInput = document.getElementById('cams-range');
  var bitInput = document.getElementById('bitrate-range');
  var daysInput = document.getElementById('days-range');

  if (!camsInput || !bitInput || !daysInput) return;

  var cams = parseInt(camsInput.value, 10);
  var mbps = parseFloat(bitInput.value);
  var days = parseInt(daysInput.value, 10);

  var camsLabel = document.getElementById('cams-num');
  var bitrateLabel = document.getElementById('bitrate-num');
  var daysLabel = document.getElementById('days-num');

  if (camsLabel) camsLabel.textContent = cams + ' Channel' + (cams > 1 ? 's' : '');
  if (bitrateLabel) bitrateLabel.textContent = mbps + ' Mbps';
  if (daysLabel) daysLabel.textContent = days + ' Days';

  var ratePerHour = ((mbps * 3600) / 8000) * cams;
  var totalGB = Math.round(ratePerHour * 24 * days);

  var outRate = document.getElementById('out-rate-hr');
  var outTotal = document.getElementById('out-total-gb');

  if (outRate) outRate.textContent = ratePerHour.toFixed(2) + ' GB/hr';
  if (outTotal) outTotal.textContent = totalGB.toLocaleString() + ' GB';
};

// Initialize default state when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  runStorageMath();
});