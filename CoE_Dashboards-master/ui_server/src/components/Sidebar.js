import React from "react";
import styled from "styled-components";
import Tabs from "./Tabs";
import { useAppContext } from "../AppContext"; // Import the useAppContext hook



const SidebarWrapper = styled.div`
  background: linear-gradient(to bottom, #0d0f40, #0d0f40, #0d0f40);
  padding: 20px 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
`;

const Sidebar = () => {
  const { tabs, selectedTab, handleTabChange, isSidebarShrunk } =
    useAppContext();

  return (
    <SidebarWrapper>
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        isSidebarShrunk={isSidebarShrunk}
      />
      {/* Other sidebar content */}
    </SidebarWrapper>
  );
};

export default Sidebar;
