import React from "react";
const Draw = React.lazy(() => import("src/components/Draw"));




const DefViewer = () => {
  return (
    <>
      <div>
        <Draw />
      </div>
    </>
  );
};

export default DefViewer;
