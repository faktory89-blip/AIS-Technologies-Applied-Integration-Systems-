/* ==========================================================================
   AIS TECHNOLOGIES - SCRIPTS.JS
   - Dual-tab schematic switching (tap isolated)
   - Fullscreen Lightbox with Touch Pan & Pinch-to-Zoom
   - Formspree AJAX Submission
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Dual-Tab Schematic Switching ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const diagrams = document.querySelectorAll('.diagram-img');
  const viewerControls = document.querySelector('.viewer-controls');

  // Prevent taps inside the control header from opening the lightbox modal
  if (viewerControls) {
    viewerControls.addEventListener('click', (e) => e.stopPropagation());
    viewerControls.addEventListener('touchend', (e) => e.stopPropagation());
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      tabButtons.forEach(b => b.classList.remove('active'));
      diagrams.forEach(d => d.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetDiagram = document.getElementById(targetId);
      if (targetDiagram) {
        targetDiagram.classList.add('active');
      }
    });
  });

  // --- 2. Interactive Pan & Zoom Lightbox (Touch + Mouse) ---
  const viewerDisplay = document.querySelector('.viewer-display');
  const lightbox = document.getElementById('lightbox');
  const canvas = document.getElementById('lightbox-canvas');
  const viewport = document.getElementById('lightbox-viewport');
  const closeBtn = document.getElementById('close-modal');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Touch tracking
  let initialPinchDistance = null;
  let initialScale = 1;

  function updateTransform() {
    if (canvas) {
      canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
  }

  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.hypot(dx, dy);
  }

  // Open Lightbox only when clicking the display area
  const targetTrigger = viewerDisplay || document.getElementById('schematic-viewer');
  if (targetTrigger && lightbox && canvas) {
    targetTrigger.addEventListener('click', () => {
      const activeDiagram = document.querySelector('.diagram-img.active');
      if (activeDiagram && activeDiagram.src) {
        canvas.innerHTML = `
          <img 
            src="${activeDiagram.src}" 
            alt="Expanded System Schematic" 
            style="max-width: 90vw; max-height: 85vh; object-fit: contain; pointer-events: none; display: block; user-select: none;" 
          />
        `;
        lightbox.style.setProperty('display', 'block', 'important');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        resetView();
      }
    });
  }

  // Close Lightbox
  function hideLightbox() {
    if (lightbox && canvas) {
      lightbox.style.setProperty('display', 'none', 'important');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      canvas.innerHTML = '';
      resetView();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', hideLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideLightbox();
  });

  // UI Button Zoom Controls
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scale = Math.min(scale * 1.3, 5);
      updateTransform();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scale = Math.max(scale / 1.3, 0.5);
      updateTransform();
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetView();
    });
  }

  // --- Pointer & Touch Engine for Mobile Devices ---
  if (viewport) {
    // 1. Desktop Mouse Wheel
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.85;
      scale = Math.min(Math.max(scale * factor, 0.4), 6);
      updateTransform();
    }, { passive: false });

    // 2. Desktop Mouse Drag
    viewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('#zoom-in, #zoom-out, #zoom-reset, #close-modal')) return;
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      if (viewport) viewport.style.cursor = 'grab';
    });

    // 3. Mobile Touch Events (1-Finger Pan & 2-Finger Pinch)
    viewport.addEventListener('touchstart', (e) => {
      if (e.target.closest('#zoom-in, #zoom-out, #zoom-reset, #close-modal')) return;

      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
        initialScale = scale;
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();

      if (e.touches.length === 1 && isDragging) {
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        updateTransform();
      } else if (e.touches.length === 2 && initialPinchDistance) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const pinchRatio = currentDistance / initialPinchDistance;
        scale = Math.min(Math.max(initialScale * pinchRatio, 0.4), 6);
        updateTransform();
      }
    }, { passive: false });

    viewport.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        isDragging = false;
        initialPinchDistance = null;
      } else if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
        initialPinchDistance = null;
      }
    });
  }

  // --- 3. Formspree AJAX Submission ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitButton = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerText = 'Transmitting...';
      }
      if (formStatus) {
        formStatus.className = 'status-msg';
        formStatus.style.display = 'none';
      }

      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (formStatus) {
            formStatus.className = 'status-msg success';
            formStatus.style.color = '#10b981';
            formStatus.innerText = 'Transmission received. AIS Technologies will respond shortly.';
            formStatus.style.display = 'block';
          }
          contactForm.reset();
        } else {
          const result = await response.json();
          if (formStatus) {
            formStatus.className = 'status-msg error';
            formStatus.style.color = '#ef4444';
            formStatus.innerText = result.errors ? result.errors.map(err => err.message).join(', ') : 'Transmission error. Please try again.';
            formStatus.style.display = 'block';
          }
        }
      } catch (err) {
        if (formStatus) {
          formStatus.className = 'status-msg error';
          formStatus.style.color = '#ef4444';
          formStatus.innerText = 'Network error. Please verify your connection.';
          formStatus.style.display = 'block';
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerText = 'Send Communication';
        }
      }
    });
  }
});