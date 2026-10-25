document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('schematic-wrapper');
  const tabs = document.querySelectorAll('.tab-btn');
  const images = document.querySelectorAll('.schematic-img');
  
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

  // Tab switching logic (swaps images without triggering the modal)
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      
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

  function applyTransform() {
    modalContent.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  }

  // Open modal with the active tab's image
  wrapper.addEventListener('click', () => {
    const activeImg = document.querySelector('.schematic-img.active');
    if (activeImg && activeImg.src) {
      modalContent.innerHTML = `
        <img 
          src="${activeImg.src}" 
          alt="Expanded Schematic View" 
          style="max-width: 90vw; max-height: 85vh; object-fit: contain; pointer-events: none; display: block;" 
        />
      `;
      modal.style.display = 'block';
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      resetView();
    }
  });

  // Close modal
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

  // Zoom button controls
  zoomInBtn.addEventListener('click', () => {
    scale = Math.min(scale * 1.3, 5);
    applyTransform();
  });

  zoomOutBtn.addEventListener('click', () => {
    scale = Math.max(scale / 1.3, 0.4);
    applyTransform();
  });

  zoomResetBtn.addEventListener('click', resetView);

  // Mouse wheel zoom
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    scale = Math.min(Math.max(scale * zoomFactor, 0.4), 5);
    applyTransform();
  }, { passive: false });

  // Pan dragging
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
});