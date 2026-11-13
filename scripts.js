/**
 * AIS Technologies - UEOC Platform Logic
 */

// 1. Lightbox Open / Close Logic
window.openLightbox = function(src, title) {
  var modal = document.getElementById('schematic-lightbox');
  var img = document.getElementById('lightbox-img');
  var titleElem = document.getElementById('lightbox-title');
  if (modal && img) {
    img.src = src;
    if (titleElem) titleElem.textContent = title;
    modal.style.display = 'flex';
  }
};

window.closeLightbox = function() {
  var modal = document.getElementById('schematic-lightbox');
  if (modal) modal.style.display = 'none';
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

// 2. Deliverables Station Tabs
window.openUeocTab = function(evt, panelId) {
  var panels = document.querySelectorAll('.ueoc-panel');
  for (var i = 0; i < panels.length; i++) {
    panels[i].classList.remove('active');
    panels[i].style.display = 'none';
  }

  var tabBtns = document.querySelectorAll('.ueoc-tab-btn');
  for (var j = 0; j < tabBtns.length; j++) {
    tabBtns[j].classList.remove('active');
  }

  var targetPanel = document.getElementById(panelId);
  if (targetPanel) {
    targetPanel.classList.add('active');
    targetPanel.style.display = 'block';
  }

  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add('active');
  }
};

// 3. Sub-Toggle (Matrix vs Calc)
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

// 4. Storage Math Calculation
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

document.addEventListener('DOMContentLoaded', function() {
  runStorageMath();
});

// ==========================================================================
// ASYNCHRONOUS FORMSPREE RFQ HANDLER (AJAX)
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('rfq-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('rfq-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevents redirecting to Formspree page

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'TRANSMITTING INQUIRY...';
    }

    if (status) {
      status.style.color = '#38bdf8';
      status.innerText = 'Routing telemetry to procurement queue...';
    }

    const formData = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/myekvlyw', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        if (status) {
          status.style.color = '#34d399';
          status.innerHTML = '✓ TRANSMISSION CONFIRMED // Inquiry logged. Engineering team will respond via provided channel.';
        }
        form.reset();
      } else {
        const errorData = await response.json();
        console.error('Formspree Server Error:', errorData);
        if (status) {
          status.style.color = '#ef4444';
          status.innerHTML = 'Transmission failed. Direct inquiries: <a href="mailto:rfq@appliedintegrationsystems.com" style="color: #38bdf8;">rfq@appliedintegrationsystems.com</a>';
        }
      }
    } catch (err) {
      console.error('Network Error:', err);
      if (status) {
        status.style.color = '#ef4444';
        status.innerHTML = 'Network route offline. Transmit directly to: <a href="mailto:rfq@appliedintegrationsystems.com" style="color: #38bdf8;">rfq@appliedintegrationsystems.com</a>';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Transmit Secure Inquiry';
      }
    }
  });
});

// === LIGHTBOX HIGH-RES PAN & ZOOM ENGINE (UP TO 5X) ===
(function initLightboxZoom() {
  let scale = 1, panX = 0, panY = 0, isDragging = false, startX = 0, startY = 0, initialPinchDist = 0, initialScale = 1;
  const getImg = () => document.getElementById('lightbox-img');

  const applyTransform = () => {
    const img = getImg();
    if (!img) return;
    img.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
    img.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
  };

  window.resetLightboxZoom = function() {
    scale = 1; panX = 0; panY = 0;
    applyTransform();
  };

  const origOpen = window.openLightbox;
  window.openLightbox = function(src, title) {
    if (origOpen) origOpen(src, title);
    window.resetLightboxZoom();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const img = getImg();
    if (!img) return;
    img.style.transition = 'transform 0.08s ease-out';
    img.style.transformOrigin = 'center center';
    img.style.userSelect = 'none';
    img.draggable = false;

    img.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (scale > 1) {
        window.resetLightboxZoom();
      } else {
        scale = 2.5;
        applyTransform();
      }
    });

    img.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 0.35 : -0.35;
      scale = Math.min(5, Math.max(1, +(scale + delta).toFixed(2)));
      if (scale === 1) { panX = 0; panY = 0; }
      applyTransform();
    }, { passive: false });

    img.addEventListener('mousedown', (e) => {
      if (scale <= 1) return;
      e.preventDefault();
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      applyTransform();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      applyTransform();
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      applyTransform();
    });

    img.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialPinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = scale;
      } else if (e.touches.length === 1 && scale > 1) {
        isDragging = true;
        startX = e.touches[0].clientX - panX;
        startY = e.touches[0].clientY - panY;
      }
    }, { passive: true });

    img.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        scale = Math.min(5, Math.max(1, +(initialScale * (dist / initialPinchDist)).toFixed(2)));
        if (scale === 1) { panX = 0; panY = 0; }
        applyTransform();
      } else if (e.touches.length === 1 && isDragging && scale > 1) {
        e.preventDefault();
        panX = e.touches[0].clientX - startX;
        panY = e.touches[0].clientY - startY;
        applyTransform();
      }
    }, { passive: false });

    img.addEventListener('touchend', () => {
      isDragging = false;
      initialPinchDist = 0;
    });
  });
})();