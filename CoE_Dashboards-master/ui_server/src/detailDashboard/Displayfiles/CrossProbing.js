import React, { Component } from 'react';

class CrossProbing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: '',
      isPathValid: false,
      fileContent: '',
      lineNumber: '',
    };
    this.showFile = this.showFile.bind(this);
  }

  handleFilePathChange = (e) => {
    this.setState({ filePath: e.target.value });
  };

  handleLineNumberChange = (e) => {
    this.setState({ lineNumber: e.target.value });
  };

  verifyFilePath = () => {
    // Simulate file loading with your actual file content
    const dummyFileContent = `1: Generating Timing information <br/>
    2: Information: Orientation ETCH is using reference direction: VERTICAL. (NEX-032)<br/>
    3: Design Scenario func_ssgnp_0p675v_m40c_rcworst_CCworst_T (Mode func Corner `

    this.setState({
      isPathValid: true,
      fileContent: dummyFileContent,
    });
  };




  


  showFile = () => {
    const { isPathValid, lineNumber } = this.state;

    if (isPathValid && lineNumber >= 1) {
      // Split the file content into lines
      const lines = this.state.fileContent.split('\n');

      if (lineNumber <= lines.length) {
        // Highlight the specified line by wrapping it in a <span>
        lines[lineNumber - 1] = `<span style="background-color: yellow;">${lines[lineNumber - 1]}</span>`;
      }

      // Join the lines back into the file content
      const highlightedContent = lines.join('\n');

      // Open a new tab with the highlighted content
      const newTab = window.open('', '_blank');
      newTab.document.write(highlightedContent);
    } else {
      // Display an error message or handle invalid input
      alert('Invalid line number or file content not loaded.');
    }
  };

  render() {
    return (
      <div>
        <h1>Timing Report Viewer</h1>
        <div>
          <label htmlFor="filePath">Enter Timing Report File Path:</label>
          <input
            type="text"
            id="filePath"
            placeholder="Enter file path"
            value={this.state.filePath}
            onChange={this.handleFilePathChange}
          />
          <button onClick={this.verifyFilePath}>Verify Path</button>
        </div>

        {this.state.isPathValid && (
          <div>
            <h2>File Viewer</h2>
            {/* <pre dangerouslySetInnerHTML={{ __html: this.state.fileContent }}></pre> */}
            <div>
              <label htmlFor="lineNumber">Enter Line Number:</label>
              <input
                type="number"
                id="lineNumber"
                placeholder="Enter line number"
                value={this.state.lineNumber}
                onChange={this.handleLineNumberChange}
              />
              <button onClick={this.showFile}>Highlight Line</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CrossProbing;
