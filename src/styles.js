export const widgetStyles = `
:host {
  display: block;
  width: 100%;
  min-height: 100vh;
  overflow: auto;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
}

.r2dt-mt-1 {
  margin-top: 0.25em !important;
}

.r2dt-mt-2 {
  margin-top: 0.5em !important;
}

.r2dt-mr-2 {
  margin-right: 0.5em !important;
}

.r2dt-mb-2 {
  margin-bottom: 0.5em !important;
}

.r2dt-d-none {
  display: none !important;
}

.r2dt-link {
  cursor: pointer;
  color: #337ab7;
  text-decoration: none;
}

.r2dt-link:hover {
  text-decoration: underline;
}

/* search input */
.r2dt-search-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.r2dt-search-insertion-point {
  position: relative;
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
  font-size: 0.9em;
}

.r2dt-search-input:focus {
  outline: none;
  border-color: #80bdff;
}

.r2dt-advanced-link {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 0.95em;
  color: #337ab7;
  text-decoration: none;
  cursor: pointer;
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
}

.r2dt-advanced-link:hover {
  text-decoration: underline;
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
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s;
}

.r2dt-search-btn {
  background-color: #337ab7;
  color: white;
}

.r2dt-clear-btn {
  background-color: #6c757d;
  color: white;
}

.r2dt-search-btn:hover {
  background-color: #286090;
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
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: r2dt-spin 0.6s linear infinite;
  vertical-align: text-bottom;
  margin-right: 6px;
}

.r2dt-spinner-secondary {
  width: 0.8em;
  height: 0.8em;
  border: 2px solid rgba(108, 117, 125, 0.3);
  border-top-color: #6c757d;
}

@keyframes r2dt-spin {
  to {
    transform: rotate(360deg);
  }
}

/* advanced search */
.r2dt-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  border: none;
  border-radius: 0.25em;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.r2dt-card-header {
  padding: 12px 10px;
  color: #212529;
  margin-bottom: 0;
  background-color: #f5f5f5;
  border: none;
  border-radius: 0.25em 0.25em 0 0;
}

.r2dt-card-body {
  padding: 12px 10px;
  border-top: 1px solid #dee2e6;
}

.r2dt-template-select,
.r2dt-template-autocomplete,
.r2dt-folding-select {
  width: 100%;
  box-sizing: border-box;
  padding: 0.5em;
  font-size: 1em;
  border-radius: 4px;
  border: 1px solid #ced4da;
  background-color: #fff;
}

.r2dt-advanced-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 2px;
}

.r2dt-advanced-row .r2dt-card {
  flex: 1 1 0;
  min-width: 350px;
}

.r2dt-autocomplete-list {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
}

.r2dt-autocomplete-item {
  padding: 0.5em;
  cursor: pointer;
}

.r2dt-autocomplete-item:hover {
  background-color: #f8f9fa;
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
  display: inline-flex;
  align-items: center;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375em 0.75em;
  font-size: 1em;
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
  box-shadow: 0 0 0 0.2em rgba(130,138,145,.5);
}

.r2dt-svg-icon {
  width: 16px;
  height: 16px;
  fill: #6c757d;
  flex-shrink: 0;
  margin-right: 4px;
}

.r2dt-btn:hover .r2dt-svg-icon {
  fill: #fff;
}

/* hamburger button (hidden by default on non-mobile devices) */
.r2dt-menu-toggle {
  display: none;
  background-color: #fff;
  border: 1px solid #ccc;
  font-size: 1.125em;
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
  min-width: 10em;
  padding: 0.5em 0;
  margin: 0.125em 0 0;
  font-size: 1em;
  color: #212529;
  text-align: left;
  background-color: #fff;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 0.25em;
  box-shadow: 0 0.5em 1em rgba(0,0,0,.175);
}

.r2dt-dropdown-menu.r2dt-show {
  display: block;
}

.r2dt-dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25em 1.5em;
  clear: both;
  font-size: 0.95em;
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
  font-size: 1.125em;
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
  margin-bottom: 0;
}

.r2dt-legend-container {
  position: absolute;
  z-index: 100;
  background-color: #ffffff;
  border-radius: 0.25em;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 150px;
  border-left: 1px solid #dee2e6;
}

.r2dt-legend-container.r2dt-legend-minimized {
  max-width: 150px;
}

.r2dt-legend-container.r2dt-legend-expanded {
  max-width: 400px;
}

.r2dt-legend-header {
  font-size: 16px;
  font-weight: bold;
}

.r2dt-source-template-text {
  display: block;
  line-height: 1.5;
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
  background-color: #f5f5f5;
  padding: 12px 10px;
  color: #212529;
  border: none;
  border-radius: 0.25em 0.25em 0 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.r2dt-arrow-icon {
  transition: transform 0.2s ease-in-out;
}

.r2dt-arrow-icon.r2dt-rotated {
  transform: rotate(90deg);
}

.r2dt-legend-content {
  padding: 12px 10px;
  border-top: 1px solid #dee2e6;
}

.r2dt-hidden {
  display: none !important;
}

.r2dt-legend-topRight {
  top: 2px;
  right: 2px;
}

.r2dt-legend-topLeft {
  top: 60px;
  left: 50px;
}

.r2dt-legend-bottomRight {
  bottom: 10px;
  right: 2px;
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
  padding: 2px;
  margin-bottom: 1em;
}

.r2dt-dot-bracket-notation .r2dt-card-body {
  max-height: 150px;
  overflow-y: auto;
  letter-spacing: 1px;
}

/* prevent button text from wrapping at 815px */
@media (max-width: 815px) {
  .r2dt-btn {
    padding: 0.375em;
  }
}

/* normalize <select> styling across browsers */
.r2dt-template-select,.r2dt-folding-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236c757d'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.084l3.71-3.853a.75.75 0 111.08 1.04l-4.24 4.4a.75.75 0 01-1.08 0l-4.24-4.4a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75em center;
  background-size: 1em;

  padding-right: 2em;
}

/* mobile behavior */
@media (max-width: 768px) {
  .r2dt-button-group {
    flex-direction: column;
  }

  .r2dt-search-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

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
    border-radius: 0.25em;
    box-shadow: 0 0.5em 1em rgba(0,0,0,.175);
    min-width: 240px;
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

  .r2dt-btn:hover .r2dt-svg-icon {
    fill: #6c757d;
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
