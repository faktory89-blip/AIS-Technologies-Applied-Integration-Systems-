document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const diagrams = document.querySelectorAll('.diagram-img');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      tabButtons.forEach(b => b.classList.remove('active'));
      diagrams.forEach(d => d.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetDiagram = document.getElementById(targetId);
      if (targetDiagram) targetDiagram.classList.add('active');
    });
  });

  // Lightbox Zoom & Pan
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
    canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  if (viewerBox) {
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
        lightbox.style.display = 'block';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        resetView();
      }
    });
  }

  function hideLightbox() {
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    canvas.innerHTML = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', hideLightbox);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideLightbox();
  });

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      scale = Math.min(scale * 1.3, 5);
      updateTransform();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      scale = Math.max(scale / 1.3, 0.4);
      updateTransform();
    });
  }

  if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetView);

  if (viewport) {
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.85;
      scale = Math.min(Math.max(scale * factor, 0.4), 5);
      updateTransform();
    }, { passive: false });

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

  // Formspree AJAX Submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitButton = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitButton.disabled = true;
      submitButton.innerText = 'Transmitting...';
      formStatus.className = 'status-msg';
      formStatus.style.display = 'none';

      const formData = new FormData(contactForm);
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.className = 'status-msg success';
          formStatus.innerText = 'Transmission received. AIS Technologies will respond shortly.';
          contactForm.reset();
        } else {
          const result = await response.json();
          formStatus.className = 'status-msg error';
          formStatus.innerText = result.errors ? result.errors.map(err => err.message).join(', ') : 'Transmission error. Please try again.';
        }
      } catch (err) {
        formStatus.className = 'status-msg error';
        formStatus.innerText = 'Network error. Please verify your connection.';
      } finally {
        submitButton.disabled = false;
        submitButton.innerText = 'Send Communication';
        formStatus.style.display = 'block';
      }
    });
  }
});