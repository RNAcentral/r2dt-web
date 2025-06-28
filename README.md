# R2DT-Web

This is an embeddable component that you can include into your website to visualise RNA secondary structures.

## How to use

To show the secondary structure for a specific sequence, you need to pass the **U**nique **R**NA **S**equence 
identifier (URS), for example: 

```
<r2dt-web urs="URS0000049E57"></r2dt-web>
```

Click [here](https://rnacentral.org/help#how-to-find-rnacentral-id) to see how you can find an RNAcentral identifier for an RNA sequence.

### Local development

1. `npm install`

2. `npm start` to start a server on http://localhost:9000/

3. `npm run build` to generate a new distribution.

### Notes

This tool is implemented as a Web Component using pure Javascript. The goal of this branch is to create a lighter 
version, without React/Redux.
