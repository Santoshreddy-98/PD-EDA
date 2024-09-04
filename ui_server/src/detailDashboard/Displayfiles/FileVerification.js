import React, { Component } from 'react';
import { Button, TextField, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import "../Displayfiles/FileVerification.css";


class FileVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: '',
      isPathValid: null,
      fileContent: '',
      lineNumber: '',
      highlightedLine: '', // Added state for highlighted line
    };
  }

  handleFilePathChange = (e) => {
    this.setState({ filePath: e.target.value });
  };

  handleLineNumberChange = (e) => {
    this.setState({ lineNumber: e.target.value });
  };

  verifyFilePath = () => {
    const { filePath } = this.state;

    // Make a GET request to the backend
    fetch(`http://localhost:4001/verifyFilePath?path=${encodeURIComponent(filePath)}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('File path validation failed');
        }
      })
      .then((data) => {
        const { isPathValid, fileContent } = data;
        this.setState({ isPathValid, fileContent });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isPathValid: false, fileContent: '' });
      });
  };

  // openNewTabWithHighlight = () => {
  //   const { isPathValid, lineNumber, fileContent } = this.state;

  //   if (isPathValid && lineNumber >= 1) {
  //     // Split the file content into lines
  //     const lines = fileContent.split('\n');

  //     // Check if the entered line number is within the valid range
  //     if (lineNumber <= lines.length) {
  //       // Highlight the specified line by wrapping it in a <span> with a yellow background
  //       lines[lineNumber - 2] = `<span style="background-color: yellow;">${lines[lineNumber - 1]}</span>`;

  //       // Join the lines back into the file content
  //       const highlightedContent = lines.join('\n');

  //       // Update the state to store the highlighted line
  //       this.setState({ highlightedLine: highlightedContent });

  //       // Open a new tab with the highlighted content
  //       const newTab = window.open('', '_blank');
  //       newTab.document.write(highlightedContent);
  //     } else {
  //       alert('Line number is out of range.');
  //     }
  //   } else {
  //     alert('Invalid line number or file content not loaded.');
  //   }
  // };

  // render() {
  //   const { isPathValid, lineNumber, highlightedLine } = this.state;


  openNewTabWithHighlight = () => {
    const { isPathValid, lineNumber, fileContent } = this.state;
  
    if (isPathValid && lineNumber >= 1) {
      // Split the file content into lines
      const lines = fileContent.split('\n');
  
      // Check if the entered line number is within the valid range
      if (lineNumber <= lines.length) {
        // Create the styled content with highlighted line in the middle
        const styledContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Styled Content</title>
          <style>
            body {
              background-color: #000; /* Black outer layout */
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .content {
              background-color: #ffffff; /* White content background */
              border: 1px solid #ccc;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              max-width: 100%;
              overflow-x: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              border: 1px solid #ccc;
            }
            /* Custom styles for highlighted content */
            .highlighted-line {
              background-color: yellow;
            }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>Source File</h1>
            <!-- Display file content with the highlighted line in the middle -->
              <table>
                <tbody>
                  ${lines
                    .map((line, index) => {
                      if (index === lineNumber - 1) {
                        // Highlight the specified line
                        return `<tr class="highlighted-line"><td>${line}</td></tr>`;
                      } else {
                        return `<tr><td>${line}</td></tr>`;
                      }
                    })
                    .join('\n')}
                </tbody>
              </table>
          </div>
        </body>
        </html>
        
        `;
  
        // Open a new tab with the styled content
        const newTab = window.open('', '_blank');
        newTab.document.open();
        newTab.document.write(styledContent); // Make sure styledContent is a string
        newTab.document.close();
      } else {
        alert('Line number is out of range.');
      }
    } else {
      alert('Invalid line number or file content not loaded.');
    }
  };
  



  // openNewTabWithHighlight = () => {
  //   const { isPathValid, lineNumber, fileContent } = this.state;
  
  //   if (isPathValid && lineNumber >= 1) {
  //     // Split the file content into lines
  //     const lines = fileContent.split('\n');
  
  //     // Check if the entered line number is within the valid range
  //     if (lineNumber <= lines.length) {
  //       // Create the styled content with highlighted line in the middle
  //       const styledContent = `
  //         <!DOCTYPE html>
  //         <html lang="en">
  //         <head>
  //           <meta charset="UTF-8">
  //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //           <title>Styled Content</title>
  //           <style>
  //             body {
  //               background-color: #000; /* Black outer layout */
  //               font-family: Arial, sans-serif;
  //               margin: 0;
  //               padding: 0;
  //               display: flex;
  //               flex-direction: column;
  //               align-items: center;
  //               justify-content: center;
  //               min-height: 100vh;
  //             }
  //             .content {
  //               background-color: #ffffff;
  //               border: 1px solid #ccc;
  //               padding: 20px;
  //               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  //               max-width: 100%;
  //               overflow-x: auto;
  //             }
  //             table {
  //               width: 200%;
  //               border-collapse: collapse;
  //             }
  //             th, td {
  //               padding: 8px;
  //               border: 1px solid #ccc;
  //             }
  //             /* Custom styles for highlighted content */
  //             .highlighted-line {
  //               background-color: yellow;
  //             }
  //           </style>
  //         </head>
  //         <body>
  //           <div class="content">
  //             <h1>Source File</h1>
             
  //             <!-- Display file content with the highlighted line in the middle -->
  //             <table>
  //               <tbody>
  //                 ${lines
  //                   .map((line, index) => {
  //                     if (index === lineNumber - 1) {
  //                       // Highlight the specified line
  //                       return `<tr class="highlighted-line"><td>${line}</td></tr>`;
  //                     } else {
  //                       return `<tr><td>${line}</td></tr>`;
  //                     }
  //                   })
  //                   .join('\n')}
  //               </tbody>
  //             </table>
  //           </div>
  //           <script>
  //             // Scroll to the highlighted line
  //             window.addEventListener('DOMContentLoaded', () => {
  //               const highlightedLine = document.querySelector('.highlighted-line');
  //               if (highlightedLine) {
  //                 highlightedLine.scrollIntoView({
  //                   behavior: 'smooth',
  //                   block: 'center',
  //                   inline: 'nearest', // Scroll to nearest edge to center
  //                 });
  //               }
  //             });
  //           </script>
  //         </body>
  //         </html>
  //       `;
  
  //       // Open a new tab with the styled content
  //       const newTab = window.open('', '_blank');
  //       newTab.document.open();
  //       newTab.document.write(styledContent);
  //       newTab.document.close();
  //     } else {
  //       alert('Line number is out of range.');
  //     }
  //   } else {
  //     alert('Invalid line number or file content not loaded.');
  //   }
  // };
  
  
  
  
    render() {
      const { isPathValid, lineNumber } = this.state;
  
  


    return (
      <div className="file-verification">
      <h1>File Verification</h1>
      <div className="file-input">
        <label htmlFor="filePath">Enter File Path:</label>
        <input
          type="text"
          id="filePath"
          placeholder="Enter file path"
          value={this.state.filePath}
          onChange={this.handleFilePathChange}
        />
        <button onClick={this.verifyFilePath}>Verify Path</button>
      </div>
      {isPathValid && (
        <div className="file-viewer">
          <h2>File Viewer</h2>
          <div className="line-number-input">
            <label htmlFor="lineNumber">Enter Line Number:</label>
            <input
              type="number"
              id="lineNumber"
              placeholder="Enter line number"
              value={lineNumber}
              onChange={this.handleLineNumberChange}
            />
            <button onClick={this.openNewTabWithHighlight}>Show</button>
          </div>
        </div>
      )}
      {isPathValid !== null && (
        <div className="validation-status">
          {isPathValid ? (
            <div className="valid-status">
              <h2>File is Valid</h2>
            </div>
          ) : (
            <div className="invalid-status">
              <h2>File is Invalid</h2>
            </div>
          )}
        </div>
      )}
    </div>
    );
  }
}

export default FileVerification;




// top line highlite

// import React, { Component } from 'react';

// class FileVerification extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       filePath: '',
//       isPathValid: null,
//       fileContent: '',
//       lineNumber: '',
//     };
//   }

//   handleFilePathChange = (e) => {
//     this.setState({ filePath: e.target.value });
//   };

//   handleLineNumberChange = (e) => {
//     this.setState({ lineNumber: e.target.value });
//   };

//   verifyFilePath = () => {
//     const { filePath } = this.state;

//     // Make a GET request to the backend
//     fetch(`http://localhost:4001/verifyFilePath?path=${encodeURIComponent(filePath)}`)
//       .then((response) => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('File path validation failed');
//         }
//       })
//       .then((data) => {
//         const { isPathValid, fileContent } = data;
//         this.setState({ isPathValid, fileContent });
//       })
//       .catch((error) => {
//         console.error(error);
//         this.setState({ isPathValid: false, fileContent: '' });
//       });
//   };

//   openNewTabWithHighlight = () => {
//     const { isPathValid, lineNumber, fileContent } = this.state;

//     if (isPathValid && lineNumber >= 1) {
//       // Split the file content into lines
//       const lines = fileContent.split('\n');

//       // Check if the entered line number is within the valid range
//       if (lineNumber <= lines.length) {
//         // Highlight the specified line by wrapping it in a <span> with a yellow background
//         const highlightedLine = `<span style="background-color: yellow;">${lines[lineNumber - 1]}</span>`;
        
//         // Insert the highlighted line at the top of the content
//         const newContent = highlightedLine + '\n' + fileContent;

//         // Open a new tab with the modified content
//         const newTab = window.open('', '_blank');
//         newTab.document.write(newContent);
//       } else {
//         alert('Line number is out of range.');
//       }
//     } else {
//       alert('Invalid line number or file content not loaded.');
//     }
//   };

//   render() {
//     const { isPathValid, lineNumber } = this.state;

//     return (
//       <div>
//         <h1>File Verification</h1>
//         <div>
//           <label htmlFor="filePath">Enter File Path:</label>
//           <input
//             type="text"
//             id="filePath"
//             placeholder="Enter file path"
//             value={this.state.filePath}
//             onChange={this.handleFilePathChange}
//           />
//           <button onClick={this.verifyFilePath}>Verify Path</button>
//         </div>
//         {isPathValid && (
//           <div>
//             <h2>File Viewer</h2>
//             <div>
//               <label htmlFor="lineNumber">Enter Line Number:</label>
//               <input
//                 type="number"
//                 id="lineNumber"
//                 placeholder="Enter line number"
//                 value={lineNumber}
//                 onChange={this.handleLineNumberChange}
//               />
//               <button onClick={this.openNewTabWithHighlight}>Highlight Line</button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// export default FileVerification;
