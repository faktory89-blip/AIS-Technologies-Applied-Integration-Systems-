document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Dual-Tab Schematic Switching ---
  const tabs = document.querySelectorAll('.tab-btn');
  const images = document.querySelectorAll('.schematic-img');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation(); // Keeps modal from triggering on tab switch
      tabs.forEach(t => t.classList.remove('active'));
      images.forEach(img => img.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetImg = document.getElementById(targetId);
      if (targetImg) {
        targetImg.classList.add('active');
      }
    });
  });

  // --- 2. Interactive Pan & Zoom Lightbox ---
  const wrapper = document.getElementById('schematic-wrapper');
  const modal = document.getElementById('schematic-modal');
  const modalContent = document.getElementById('modal-content');
  const viewport = document.getElementById('modal-pan-viewport');
  const closeModal = document.getElementById('close-modal');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function applyTransform() {
    modalContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  }

  wrapper.addEventListener('click', () => {
    const activeImg = document.querySelector('.schematic-img.active');
    if (activeImg && activeImg.src) {
      modalContent.innerHTML = `
        <img 
          src="${activeImg.src}" 
          alt="Expanded Schematic" 
          style="max-width: 90vw; max-height: 85vh; object-fit: contain; pointer-events: none; display: block;" 
        />
      `;
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      resetView();
    }
  });

  function hideModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
  }

  closeModal.addEventListener('click', hideModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
  });

  // Zoom Controls
  zoomInBtn.addEventListener('click', () => {
    scale = Math.min(scale * 1.3, 5);
    applyTransform();
  });

  zoomOutBtn.addEventListener('click', () => {
    scale = Math.max(scale / 1.3, 0.4);
    applyTransform();
  });

  zoomResetBtn.addEventListener('click', resetView);

  // Wheel Zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    scale = Math.min(Math.max(scale * factor, 0.4), 5);
    applyTransform();
  }, { passive: false });

  // Drag Panning
  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.modal-controls')) return;
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // --- 3. Formspree AJAX Submission ---
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.innerText = 'Transmitting...';
      status.className = 'form-status';
      status.style.display = 'none';

      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.className = 'form-status success';
          status.innerText = 'Transmission received. AIS Technologies will respond shortly.';
          form.reset();
        } else {
          const resData = await response.json();
          status.className = 'form-status error';
          status.innerText = resData.errors ? resData.errors.map(err => err.message).join(', ') : 'Transmission error. Please try again.';
        }
      } catch (err) {
        status.className = 'form-status error';
        status.innerText = 'Network error. Please check your connection.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Send Communication';
        status.style.display = 'block';
      }
    });
  }
});