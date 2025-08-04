export const widgetStyles = `
:host {
  display: block;
  width: 100%;
  min-height: 100vh;
  overflow: auto;
  box-sizing: border-box;
  font-family: sans-serif;
}

.r2dt-mt-1 {
  margin-top: 0.25rem !important;
}

.r2dt-mt-2 {
  margin-top: 0.5rem !important;
}

.r2dt-mr-2 {
  margin-right: 0.5rem !important;
}

/* search input */
.r2dt-search-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.r2dt-search-footer {
  display: flex;
  align-items: center;
}

.r2dt-search-input {
  width: 100%;
  min-height: 200px;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  box-sizing: border-box;
}

.r2dt-search-input:focus {
  outline: none;
  border-color: #80bdff;
}

.r2dt-search-examples {
  flex: 1;
}

.r2dt-example {
  cursor: pointer;
  color: #337ab7;
  margin-right: 15px;
  display: inline-block;
  line-height: 1.5;
}

.r2dt-example:hover {
  text-decoration: underline;
}

.r2dt-button-group {
  display: inline-flex;
  gap: 10px;
  vertical-align: middle;
}

.r2dt-search-btn,
.r2dt-clear-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.r2dt-search-btn {
  background-color: #0d6efd;
  color: white;
}

.r2dt-clear-btn {
  background-color: #6c757d;
  color: white;
}

.r2dt-search-btn:hover {
  background-color: #025ce2;
}

.r2dt-clear-btn:hover {
  background-color: #5a6268;
}

.r2dt-search-btn:disabled,
.r2dt-clear-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  pointer-events: none;
}

.r2dt-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: r2dt-spin 0.6s linear infinite;
  vertical-align: text-bottom;
  margin-right: 6px;
}

@keyframes r2dt-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .r2dt-button-group {
    flex-direction: column;
  }

  .r2dt-search-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}

/* results */
.r2dt-outer-scroll-wrapper {
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.r2dt-viewer-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/*  button */
.r2dt-button-panel {
  display: inline-flex;
  flex-wrap: nowrap;
}

.r2dt-button-panel > .r2dt-dropdown {
  display: inline-block;
}

.r2dt-button-panel > .r2dt-btn + .r2dt-dropdown,
.r2dt-button-panel > .r2dt-dropdown + .r2dt-btn,
.r2dt-button-panel > .r2dt-dropdown + .r2dt-dropdown {
  margin-left: -1px;
}

.r2dt-button-panel .r2dt-btn:focus,
.r2dt-button-panel .r2dt-dropdown-toggle:focus {
  outline: none;
  box-shadow: none;
}

.r2dt-btn {
  display: inline-block;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  transition: color 0.15s ease-in-out,
              background-color 0.15s ease-in-out,
              border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
}

.r2dt-btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.r2dt-btn-outline-secondary:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.r2dt-btn + .r2dt-btn {
  margin-left: -1px; /* join buttons together */
}

.r2dt-btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(130,138,145,.5);
}

/* hamburger button (hidden by default on non-mobile devices) */
.r2dt-menu-toggle {
  display: none;
  background-color: #fff;
  border: 1px solid #ccc;
  font-size: 18px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  line-height: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  width: 32px;
  height: 32px;
}

/* dropdown */
.r2dt-dropdown {
  position: relative;
}

.r2dt-dropdown-toggle::after {
  display: inline-block;
  margin-left: 0.255em;
  vertical-align: 0.255em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}

.r2dt-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,.175);
}

.r2dt-dropdown-menu.r2dt-show {
  display: block;
}

.r2dt-dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-size: 0.95rem;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  text-decoration: none;
}

.r2dt-dropdown-item:hover, .r2dt-dropdown-item:focus {
  color: #16181b;
  background-color: #f8f9fa;
}

/* svg-pan-zoom */
.r2dt-svg-container {
  flex: 1;
  overflow: hidden;
}

.r2dt-svg-container svg {
  max-width: 100%;
  max-height: 100%;
  display: block;
  background: white;
}

.r2dt-zoom-controls {
  position: absolute;
  top: 60px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10;
}

.r2dt-zoom-controls button {
  background-color: #fff;
  border: 1px solid #ccc;
  font-size: 18px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  line-height: 1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.r2dt-zoom-controls button:hover {
  background-color: #f0f0f0;
}

/* error/loading message */
.r2dt-message {
  padding: 1em;
  color: #666;
}

.r2dt-alert-container {
  margin-top: 12px;
}

.r2dt-alert {
  padding: 10px 15px;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 0.95rem;
}

.r2dt-alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border: 1px solid #f5c2c7;
}

/* legend */
.r2dt-list-unstyled {
  padding-left: 0;
  list-style: none;
}

.r2dt-legend-container {
  position: absolute;
  z-index: 100;
  background-color: #ffffff;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
  font-size: 0.95rem;
  border: none;
}

.r2dt-legend-header {
  font-size: 1rem;
  font-weight: bold;
}

.r2dt-source-template-text {
  display: block;
  font-size: 1rem;
}

.r2dt-source-template-text a {
  cursor: pointer;
  color: #337ab7;
  text-decoration: none;
}

.r2dt-source-template-text a:hover {
  text-decoration: underline;
}

.r2dt-legend-toggle-btn {
  width: 100%;
  text-align: left;
  background-color: #f8f9fa;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 1rem;
  color: #212529;
  border: none;
  border-radius: 0.25rem 0.25rem 0 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.r2dt-legend-toggle-btn:focus {
  outline: none;
  background-color: #e9ecef;
}

.r2dt-arrow-icon {
//  display: inline-block;
  transition: transform 0.2s ease-in-out;
}

.r2dt-arrow-icon.r2dt-rotated {
  transform: rotate(-180deg); /* Rotate up when content is hidden */
}

.r2dt-legend-content {
  padding: 12px 16px;
  border-top: 1px solid #dee2e6;
}

.r2dt-legend-content.r2dt-hidden {
  display: none;
}

.r2dt-legend-topRight {
  top: 10px;
  right: 10px;
}

.r2dt-legend-topLeft {
  top: 60px;
  left: 50px;
}

.r2dt-legend-bottomRight {
  bottom: 10px;
  right: 10px;
}

.r2dt-legend-bottomLeft {
  bottom: 10px;
}

.r2dt-traveler-magenta {
  background-color: rgb(255, 0, 255);
}

.r2dt-traveler-green {
  background-color: rgb(44, 162, 95);
}

.r2dt-traveler-blue {
  background-color: rgb(43, 140, 190);
}

.r2dt-traveler-black {
  background-color: rgb(0, 0, 0);
}

.r2dt-traveler-key {
  height: 20px;
  width: 20px;
  float: left;
  margin-right: 8px;
}

/* dot bracket notation */
.r2dt-dot-bracket-notation {
  padding: 10px;
  white-space: pre-wrap;
  background: #f5f5f5;
  max-height: 150px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.r2dt-dot-bracket-notation pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.r2dt-dot-bracket-notation strong {
  display: block;
  margin-bottom: 0.5rem;
}

/* mobile behavior */
@media (max-width: 768px) {
  .r2dt-menu-toggle {
    display: inline-block;
  }

  .r2dt-menu-toggle:focus {
    outline: none;
    box-shadow: none;
  }

  .r2dt-button-panel {
    display: none;
    position: absolute;
    top: 0;
    left: 40px;
    flex-direction: column;
    border: 1px solid rgba(0,0,0,0.15);
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,.175);
    min-width: 220px;
  }

  .r2dt-button-panel.r2dt-show-buttons {
    display: flex;
  }

  .r2dt-button-panel .r2dt-btn {
    border: none;
    text-align: left;
    width: 100%;
    color: #212529;
    box-shadow: none;
  }

  .r2dt-button-panel .r2dt-btn:hover {
    background-color: #f0f0f0;
  }

  .r2dt-zoom-controls {
    top: 40px;
  }

  .r2dt-legend-topLeft {
    top: 1px;
  }

  .r2dt-legend-topRight {
    top: 1px;
  }
}
`;
