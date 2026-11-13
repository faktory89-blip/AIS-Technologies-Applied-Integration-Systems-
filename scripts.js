:root {
  --bg-dark: #05080f;
  --card-bg: #0b111e;
  --accent-cyan: #00f0ff;
  --accent-green: #00e676;
  --text-main: #e2e8f0;
  --text-muted: #94a3b8;
  --border-subtle: rgba(0, 240, 255, 0.22);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg-dark);
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace, sans-serif;
  line-height: 1.6;
}

.site-header {
  padding: 2.5rem 1.5rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--border-subtle);
}

.site-header h1 {
  margin: 0;
  letter-spacing: 0.12em;
  color: var(--accent-cyan);
  font-size: 1.6rem;
}

.site-header .subtitle {
  margin: 0.4rem 0 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.project-card {
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
}

.card-header h3 {
  margin: 0.25rem 0 0.75rem;
  font-size: 1.3rem;
  color: #ffffff;
}

.status-badge.status-complete {
  display: inline-block;
  font-family: monospace;
  font-size: 0.75rem;
  color: var(--accent-green);
  background: rgba(0, 230, 118, 0.12);
  border: 1px solid rgba(0, 230, 118, 0.4);
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
}

.project-summary {
  color: var(--text-muted);
  margin-top: 0;
}

.media-gallery.two-up {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 14px 0;
}

.media-gallery .media-item {
  margin: 0;
  background: #060a10;
  border: 1px solid rgba(0, 240, 255, 0.25);
  border-radius: 6px;
  overflow: hidden;
}

.media-gallery .media-item img {
  width: 100%;
  height: auto;
  display: block;
  cursor: zoom-in;
}

.media-gallery .media-item figcaption {
  padding: 6px 10px;
  font-family: monospace;
  font-size: 0.78rem;
  color: var(--text-muted);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.spec-list {
  padding-left: 1.2rem;
  margin: 1rem 0 0;
}

.spec-list li {
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.spec-list strong {
  color: var(--accent-cyan);
}

@media (max-width: 768px) {
  .media-gallery.two-up {
    grid-template-columns: 1fr;
  }
}