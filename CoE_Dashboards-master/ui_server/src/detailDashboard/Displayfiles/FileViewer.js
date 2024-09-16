import React from 'react';

const FileViewer = ({ highlightedContent }) => {
  return (
    <div>
      <h1>File Viewer</h1>
      <div className="file-content">
        {/* Render the highlighted content */}
        <pre dangerouslySetInnerHTML={{ __html: highlightedContent }}></pre>
      </div>
    </div>
  );
};

export default FileViewer;
