import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/actions';
import {ALIGN_CENTER, POSITION_LEFT, UncontrolledReactSVGPanZoom, TOOL_NONE} from 'react-svg-pan-zoom';
import { SvgLoader } from 'react-svgmt';
import { saveSvgAsPng } from 'save-svg-as-png';
import { MdColorLens } from 'react-icons/md';
import { RiImage2Line, RiFileCodeLine, RiFileCopy2Line } from "react-icons/ri";
import { BsToggles } from "react-icons/bs";

const miniatureProps = { position: TOOL_NONE }
const toolbarProps = { position: POSITION_LEFT, SVGAlignY: ALIGN_CENTER, SVGAlignX: ALIGN_CENTER }


class Results extends React.Component {
  constructor(props) {
    super(props);
    this.viewerRef = React.createRef();
    this.divRef = React.createRef();
    this.doFirstFit = true;
    this.state = { divWidth: window.innerWidth };
  }

  componentDidMount() {
    window.addEventListener("resize", (e) => this.handleResize(e));
  }

  componentWillUnMount() {
    window.addEventListener("resize", (e) => this.handleResize(e));
  }

  componentDidUpdate() {
    if (this.doFirstFit && this.viewerRef.current) {
      this.viewerRef.current.fitToViewer("center", "center");
      this.doFirstFit = false;
    }
    if (!this.props.jobId && !this.doFirstFit) {
      this.doFirstFit = true;
    }
  }

  handleResize(e) {
    const { current } = this.divRef;
    current && this.setState({ divWidth: current.offsetWidth });
  };

  downloadPNG() {
    let div = document.createElement('div');
    div.innerHTML = this.props.svg;
    saveSvgAsPng(div.firstChild, this.props.jobId + ".png", {backgroundColor: 'white', scale: 3});
  }

  downloadSVG() {
    let svgBlob = new Blob([this.props.svg], {type:"image/svg+xml;charset=utf-8"});
    let svgUrl = URL.createObjectURL(svgBlob);
    let downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = this.props.jobId + ".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  sourceLink(source, linkColor){
    let link = "#";
    let name = "";
    if (source.toLowerCase() === "crw") {
      link = "http://www.rna.ccbb.utexas.edu/";
      name = "CRW";
    } else if (source.toLowerCase() === "rfam") {
      link = "https://rfam.org/";
      name = "Rfam";
    } else if (source.toLowerCase() === "ribovision") {
      link = "http://apollo.chemistry.gatech.edu/RiboVision/";
      name = "RiboVision";
    } else if (source.toLowerCase() === "gtrnadb") {
      link = "http://gtrnadb.ucsc.edu/";
      name = "GtRNAdb"
    }
    return <a className="custom-link" style={{color: linkColor}} href={link} target="_blank">{name}</a>
  }

  render() {
    let title = {
      color: this.props.customStyle && this.props.customStyle.titleColor ? this.props.customStyle.titleColor : "#007c82",
      fontSize: this.props.customStyle && this.props.customStyle.titleSize ? this.props.customStyle.titleSize : "28px",
    };
    const fixCss = this.props.customStyle && this.props.customStyle.fixCss && this.props.customStyle.fixCss === "true" ? "1.5rem" : "";
    const linkColor = this.props.customStyle && this.props.customStyle.linkColor ? this.props.customStyle.linkColor : "#337ab7";
    const width = this.state.divWidth > 1100 ? 1100 : this.state.divWidth - 40;
    const height = parseFloat(this.props.height) > 600 ? parseFloat(this.props.height) : 600;

    return (
      <div className="rna" ref={this.divRef}>
        {
          this.props.jobId && this.props.status === "error" && (
            <div className="row" key={`error-div`}>
              <div className="col-12 col-sm-9">
                <div className="alert alert-danger">
                  There was an error. Let us know if the problem persists by raising an issue on <a href="https://github.com/RNAcentral/r2dt-web/issues" target="_blank">GitHub</a>.
                </div>
              </div>
            </div>
          )
        }
        {
          this.props.jobId && this.props.svg === "SVG not available" && this.props.status === "FINISHED" && (
            <div className="row" key={`error-div`}>
              <div className="col-12 col-sm-9">
                <div className="alert alert-warning">
                  The sequence did not match any of the templates. If you think it's an error, please <a href="https://github.com/RNAcentral/r2dt-web/issues" target="_blank">get in touch</a>.
                </div>
              </div>
            </div>
          )
        }
        {
          this.props.jobId && this.props.svg !== "SVG not available" && this.props.status === "FINISHED" && [
            <div className="row" key={`results-div`}>
              <div className="col-12">
                <span style={title}>Secondary structure </span>
                {
                  (this.props.template === "error" || this.props.source === "error") ? <p className="text-muted mt-3">
                    Generated by <a className="custom-link" style={{color: linkColor}} href="https://github.com/RNAcentral/r2dt" target="_blank">R2DT</a>. <a className="custom-link" style={{color: linkColor}} href="https://rnacentral.org/help/secondary-structure" target="_blank">Learn more →</a>
                  </p> : <p className="text-muted mt-3">
                    Generated by <a className="custom-link" style={{color: linkColor}} href="https://github.com/RNAcentral/r2dt" target="_blank">R2DT</a> using the <i>{this.props.template}</i> template provided by {this.sourceLink(this.props.source, linkColor)}. <a className="custom-link" style={{color: linkColor}} href="https://rnacentral.org/help/secondary-structure" target="_blank">Learn more →</a>
                  </p>
                }
                <div className="btn-group mb-3" role="group" aria-label="button options">
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.props.toggleColors(this.props.svg)}><span className="btn-icon"><MdColorLens size="1.2em"/></span> Toggle colours</button>
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.props.toggleNumbers(this.props.svg)}><span className="btn-icon"><BsToggles size="1.2em"/></span> Toggle numbers</button>
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.downloadPNG()}><span className="btn-icon"><RiImage2Line size="1.2em"/></span> Save PNG</button>
                  <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => this.downloadSVG()}><span className="btn-icon"><RiFileCodeLine size="1.2em"/></span> Save SVG</button>
                  {this.props.notation ? <button className="btn btn-outline-secondary" style={{fontSize: fixCss}} onClick={() => navigator.clipboard.writeText(this.props.notation)}><span className="btn-icon"><RiFileCopy2Line size="1.2em"/></span> Copy dot-bracket notation</button> : ""}
                </div>
                <div className="border border-secondary">
                  <UncontrolledReactSVGPanZoom
                    width={width}
                    height={height}
                    ref={this.viewerRef}
                    toolbarProps={toolbarProps}
                    miniatureProps={miniatureProps}
                    detectAutoPan={false}
                    background={"#fff"}
                  >
                    <svg width={parseFloat(this.props.width)} height={parseFloat(this.props.height)}>
                      <SvgLoader svgXML={this.props.svg} />
                    </svg>
                  </UncontrolledReactSVGPanZoom>
                </div>
                <div className="mt-3">
                  <strong>Colour legend</strong>
                  <ul className="list-unstyled">
                    <li className="mt-1"><span className="traveler-black traveler-key"></span> Same as the template</li>
                    <li className="mt-1">
                      <span className="traveler-green traveler-key"></span> Modified compared to the template.
                      <strong> Tip:</strong> Hover over green nucleotides for more details
                    </li>
                    <li className="mt-1"><span className="traveler-red traveler-key"></span> Inserted nucleotides</li>
                    <li className="mt-1"><span className="traveler-blue traveler-key"></span> Repositioned compared to the template</li>
                    <li className="mt-1"><strong>Tip:</strong> Hover over the nucleotides to see nucleotide numbers</li>
                  </ul>
                </div>
              </div>
            </div>
          ]
        }
        {
          this.props.jobId && this.props.svg !== "SVG not available" && this.props.status === "FINISHED" && this.props.notation && [
            <div className="row" key={`notation-div`}>
              <div className="col-12">
                <p className="notation-title">Dot-bracket notation</p>
                {
                  this.props.notation === "error" ? <div className="alert alert-danger">
                    There was an error loading the dot-bracket notation. Let us know if the problem persists by raising an issue on <a href="https://github.com/RNAcentral/r2dt-web/issues" target="_blank">GitHub</a>.
                  </div> : <pre className="notation">
                    <span className="notation-font">{this.props.notation}</span>
                  </pre>
                }
              </div>
            </div>
          ]
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    jobId: state.jobId,
    status: state.status,
    submissionError: state.submissionError,
    sequence: state.sequence,
    width: state.width,
    height: state.height,
    svg: state.svg,
    notation: state.notation,
    template: state.template,
    source: state.source
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleColors: (svg) => dispatch(actionCreators.onToggleColors(svg)),
    toggleNumbers: (svg) => dispatch(actionCreators.onToggleNumbers(svg))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
