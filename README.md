# R2DT-Web

This is an embeddable component that you can include into your website to visualise RNA secondary structures.

This plugin is written in React/Redux. It is bundled as a Web Component, so it should not clash with your website's 
javascript or CSS.

## Installation

Download this package directly from Github.

`git clone https://github.com/RNAcentral/r2dt-web.git`

Now you can add the component's javascript bundle (it contains all the styles and fonts) to your web page either 
directly or through an import with Webpack:

`<script type="text/javascript" src="/r2dt-web/dist/r2dt-web.js"></script>`

To use it just insert an html tag somewhere in your html:

```
<r2dt-web />
```

To show some examples, use:

```
<r2dt-web 
    examples='[
        {"description": "miRNA hsa-let-7a-1", "urs": "URS000004F5D8", "sequence": "CUAUACAAUCUACUGUCUUUC"}
    ]'
/>
```

You can also customise some elements of this embeddable component. See what you can change [here](#layout).
The example below changes the color of the buttons:

```
<r2dt-web
    customStyle='{
      "searchButtonColor": "#007c82",
      "clearButtonColor": "#6c757d"
    }'
/>
```

For a minimal example, see [index.html](./index.html).

## Attributes/parameters

This component accepts a number of attributes. You pass them as html attributes
and their values are strings (this is a requirement of Web Components):

#### layout

Parameters that you can use to customise some elements of this embeddable component

parameter                   | description                                                                       |
----------------------------|-----------------------------------------------------------------------------------|
fixCss                      | fix the CSS. Use *"fixCss": "true"* if the button sizes are different             |
linkColor                   | change the color of the links                                                     |
searchButtonColor           | change the color of the `Search` button                                           |
clearButtonColor            | change the color of the `Clear` button                                            |

## Developer details

### Local development

1. `npm install`

2. `npm run serve` to start a server on http://localhost:8080/

3. `npm run clean` to clean the dist folder of old assets

4. `npm run build` to generate a new distribution.

### Notes

This embed is implemented as a Web Component, wrapping a piece of code in React/Redux.

Being a Web Component, it isolates CSS styles from the main page to avoid clash of styles with it.
The CSS styles and fonts are bundled into the javascript inline via Webpack 3 build system,
see webpack.config.js file. Upon load of RNAcentral-sequence-search.js, the component registers
itself in the custom elements registry.

There are some peculiarities about interaction of Web Components with React.

First, there is a known issue with React events breaking, when React component is mounted under a shadow root in
shadow DOM. We solve this by retargeting React events for shadow dom with this package:

* https://www.npmjs.com/package/react-shadow-dom-retarget-events.

Second, Web Components accept input parameters as strings. That means that we have to parse
parameters in Web Component initialization code and pass the resulting objects as props to React.
Here are some examples of passing the parameters to the Web Component or from Web Component
to React:

* https://hackernoon.com/how-to-turn-react-component-into-native-web-component-84834315cb24
* https://stackoverflow.com/questions/50404970/web-components-pass-data-to-and-from/50416836
