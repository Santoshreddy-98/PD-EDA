import React, { useState } from 'react';


const SplitView = () => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [rightSplitContent, setRightSplitContent] = useState('');
  const [leftSplitContent, setLeftSplitContent] = useState('');

  const handleDropdownChange = (selectedOption) => {
    setSelectedValues(selectedOption);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    // Implement your right-click logic here to split content
    setRightSplitContent('Right Split Content'); // Set the content for the right split
  };

  const handleLeftClick = (event) => {
    event.preventDefault();
    // Implement your left-click logic here to split content
    setLeftSplitContent('Left Split Content'); // Set the content for the left split
  };

  return (
    <div className="split-view">
      <div className="dropdown">
        {/* Implement your dropdown component here */}
        <select onChange={(e) => handleDropdownChange(e.target.value)}>
          <option value={1}>Value 1</option>
          <option value={2}>Value 2</option>
          <option value={3}>Value 3</option>
          <option value={4}>Value 4</option>
          <option value={5}>Value 5</option>
        </select>
      </div>
      <div className="left-pane" onContextMenu={handleLeftClick}>
        {selectedValues.includes(2) && <div>Content for Value 2</div>}
        {leftSplitContent && <div>{leftSplitContent}</div>}
      </div>
      <div className="right-pane" onContextMenu={handleRightClick}>
        {selectedValues.includes(4) && <div>Content for Value 4</div>}
        {rightSplitContent && <div>{rightSplitContent}</div>}
      </div>
    </div>
  );
};

export default SplitView;
