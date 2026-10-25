/* --- Contact Section --- */
.form-wrapper {
  max-width: 660px;
  margin: 0 auto;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 36px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.field-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.field-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-group input,
.field-group textarea {
  width: 100%;
  display: block;
  background-color: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 12px 14px;
  color: #ffffff;
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.field-group input:focus,
.field-group textarea:focus {
  outline: none;
  border-color: var(--cyan);
}

.status-msg {
  margin-top: 15px;
  font-size: 0.9rem;
  display: none;
}

.status-msg.success {
  display: block;
  color: var(--emerald);
}

.status-msg.error {
  display: block;
  color: #ef4444;
}

/* --- Lightbox Modal (Strictly Hidden Until Triggered) --- */
.lightbox-modal {
  display: none;
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background-color: rgba(4, 7, 13, 0.97);
  backdrop-filter: blur(12px);
}

.lightbox-controls {
  position: absolute;
  top: 24px;
  right: 28px;
  display: flex;
  gap: 10px;
  z-index: 100000;
}

.lightbox-controls button {
  background: var(--bg-surface);
  color: var(--text-main);
  border: 1px solid var(--border-subtle);
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lightbox-controls button:hover {
  background: #19273c;
  border-color: var(--cyan);
  color: var(--cyan);
}

.lightbox-controls .btn-close {
  background: #7f1d1d;
  border-color: #991b1b;
}

.lightbox-controls .btn-close:hover {
  background: #dc2626;
  color: #ffffff;
}

.lightbox-viewport {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-viewport:active {
  cursor: grabbing;
}

.lightbox-canvas {
  transform-origin: center center;
  transition: transform 0.05s linear;
  user-select: none;
}