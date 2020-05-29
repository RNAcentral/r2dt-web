import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import {Provider} from 'react-redux';

import AutoTraveler from 'containers/AutoTraveler/index.jsx';
import configureStore from 'store/configureStore.js';

import bootstrap from 'styles/bootstrap.css';
import AutoTravelerStyles from 'styles/auto-traveler.scss';

// Prepare data
export const store = configureStore();


class AutoTravelerEmbed extends HTMLElement {
  constructor() {
    super();

    // prepare DOM and shadow DOM
    const shadowRoot = this.attachShadow({mode: 'open'});
    const mountPoint = document.createElement('html');
    shadowRoot.appendChild(mountPoint);

    // parse arguments
    const customStyle = JSON.parse(this.attributes.customStyle ? this.attributes.customStyle.nodeValue : null);
    const examples = JSON.parse(this.attributes.examples ? this.attributes.examples.nodeValue : null);

    // render React
    ReactDOM.render([
      <style key={bootstrap} dangerouslySetInnerHTML={{__html: bootstrap}}/>,
      <style key={AutoTravelerStyles} dangerouslySetInnerHTML={{__html: AutoTravelerStyles}}/>,
      <body key='body'>
        <Provider key='provider' store={store}>
          <AutoTraveler
              customStyle={customStyle}
              examples={examples}
          />
        </Provider>
      </body>
      ],
      mountPoint
    );

    // retarget React events to work with shadow DOM
    retargetEvents(shadowRoot);
  }

  connectedCallback() {
  }

  disconnectedCallback() {
    let state = store.getState();
    if (state.statusTimeout) {
      clearTimeout(state.statusTimeout);
    }
  }
}

customElements.define('auto-traveler', AutoTravelerEmbed);
