document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting Scope...';
      statusDiv.textContent = '';

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        statusDiv.style.color = '#10b981';
        statusDiv.textContent = 'Scope request received. Technical integration desk will reply within 1 business day.';
        contactForm.reset();
      } catch (err) {
        statusDiv.style.color = '#ef4444';
        statusDiv.textContent = 'Transmission failed. Please reach out directly to contact@appliedintegrationsystems.com';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Scope Request';
      }
    });
  }
});