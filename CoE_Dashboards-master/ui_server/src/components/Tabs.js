import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation
import { useAppContext } from "../AppContext";

const TabsWrapper = styled.div`
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  gap: 20px 0;
  margin-bottom: 10px;
`;

const Tab = styled(Link)`
  width: 100%;
  padding: 10px 20px;
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 800;
  text-transform: uppercase;
  font-family: "Aquire";
  letter-spacing: 1.5px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#2F3F59" : "transparent")};
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #ccc;
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    color: #fff;
  }

  span {
    display: ${({ isSidebarShrunk }) => (isSidebarShrunk ? "block" : "none")};
    transition: display 0.3s ease-in-out;
  }
`;

const Tabs = () => {
  const { tabs, isSidebarShrunk } = useAppContext();
  const location = useLocation(); // Get the current route location

  return (
    <TabsWrapper>
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          to={`/${tab.path}`}
          isSidebarShrunk={isSidebarShrunk}
          active={location.pathname === `/${tab.title}`} // Check if the tab is active
        >
          <img
            src={process.env.PUBLIC_URL + tab.image}
            alt={`Tab Image - ${tab.title}`}
          />
          <span>{tab.title}</span>
        </Tab>
      ))}
    </TabsWrapper>
  );
};

export default Tabs;
