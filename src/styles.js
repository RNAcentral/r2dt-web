export const widgetStyles = `
:host {
  display: block;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  font-family: sans-serif;
}

.viewer-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
}

.mt-1 {
  margin-top: 0.25rem !important;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

/* svg-pan-zoom */
.svg-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.svg-container svg {
  max-width: 100%;
  max-height: 100%;
  display: block;
  background: white;
}

.zoom-controls {
  position: absolute;
  top: 25px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 10;
}

.zoom-controls button {
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

.zoom-controls button:hover {
  background-color: #f0f0f0;
}

/* error/loading message */
.r2dt-message {
  padding: 1em;
  color: #666;
}

/* legend */
.list-unstyled {
  padding-left: 0;
  list-style: none;
}

.legend-container {
  position: absolute;
  padding: 0 10px;
  z-index: 5;
}

.legend-topRight {
  top: 10px;
  right: 10px;
}

.legend-topLeft {
  top: 10px;
  left: 50px;
}

.legend-bottomRight {
  bottom: 10px;
  right: 10px;
}

.legend-bottomLeft {
  bottom: 10px;
  left: 10px;
}

.traveler-magenta {
  background-color: rgb(255, 0, 255);
}

.traveler-green {
  background-color: rgb(44, 162, 95);
}

.traveler-blue {
  background-color: rgb(43, 140, 190);
}

.traveler-black {
  background-color: rgb(0, 0, 0);
}

.traveler-key {
  height: 20px;
  width: 20px;
  float: left;
  margin-right: 8px;
}
`;
