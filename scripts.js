/* ==========================================================================
   AIS TECHNOLOGIES - SCRIPTS.JS
   - Dual-tab schematic switching
   - Fullscreen Lightbox with Pan & Zoom (Clean Toggle)
   - Formspree AJAX Submission
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Dual-Tab Schematic Switching ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const diagrams = document.querySelectorAll('.diagram-img');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevents opening the zoom modal when switching tabs
      
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

  // --- 2. Interactive Pan & Zoom Lightbox ---
  const viewerBox = document.getElementById('schematic-viewer');
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

  // Open Lightbox
  if (viewerBox && lightbox && canvas) {
    viewerBox.addEventListener('click', () => {
      const activeDiagram = document.querySelector('.diagram-img.active');
      if (activeDiagram && activeDiagram.src) {
        canvas.innerHTML = `
          <img 
            src="${activeDiagram.src}" 
            alt="Expanded System Schematic" 
            style="max-width: 90vw; max-height: 85vh; object-fit: contain; pointer-events: none; display: block;" 
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
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', hideLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideLightbox();
  });

  // Zoom Controls
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
      scale = Math.max(scale / 1.3, 0.4);
      updateTransform();
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetView();
    });
  }

  // Mouse Wheel Zoom
  if (viewport) {
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.85;
      scale = Math.min(Math.max(scale * factor, 0.4), 5);
      updateTransform();
    }, { passive: false });

    // Drag to Pan
    viewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('.lightbox-controls')) return;
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
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
            formStatus.innerText = 'Transmission received. AIS Technologies will respond shortly.';
            formStatus.style.display = 'block';
          }
          contactForm.reset();
        } else {
          const result = await response.json();
          if (formStatus) {
            formStatus.className = 'status-msg error';
            formStatus.innerText = result.errors ? result.errors.map(err => err.message).join(', ') : 'Transmission error. Please try again.';
            formStatus.style.display = 'block';
          }
        }
      } catch (err) {
        if (formStatus) {
          formStatus.className = 'status-msg error';
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