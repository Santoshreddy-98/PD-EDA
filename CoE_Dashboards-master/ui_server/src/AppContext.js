import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import Backendapi from "./designAuditor/Backendapi";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);


//push and pop

const tabs = [
  {
    title: "Login",
    path: "DAloginpage",
    image: "/login.png", // Replace with actual image path
  },
 
  {
    title: "main dashboard",
    path: "mainpage",
    image: "/table.png", // Replace with actual image path
  }, 

  {
    title: "charts",
    path: "chartpage",
    image: "/chart.png", // Replace with actual image path
  },
  {
    title: "detail dashboard",
    path: "detailpage",
    image: "/table.png", // Replace with actual image path
  },
  {
    title: "design auditor",
    path: "designAuditorPage",
    image: "/checklist.png", // Replace with actual image path
  },
  {
    title: "Admin Panel",
    path: "admin/list",
    image: "/loginAdmin.png",
  },
];



export const AppProvider = ({ children }) => {
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(true);
  const [isMulti, setMulti] = useState([]);
  const [isMain, setIsMain] = useState([])
  const [user, setUser] = useState(null); 

  const [split, setSplit] = useState();

  const handleSidebarClick = () => {
    setIsSidebarShrunk(!isSidebarShrunk);
  };

  useEffect(() => {
    const multiData = async () => {
      try {
        const { data } = await axios.get(`${Backendapi.PYTHON_APP_BACKEND_API_URL}/multirun/`);
        setMulti(data.data);
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    multiData();
  }, []);

  useEffect(() => {
    const mainData = async () => {
      try {
        const { data } = await axios.get(`${Backendapi.PYTHON_APP_BACKEND_API_URL}/process_directories/`);
        
        setIsMain(data);
        console.log(isMain,"Is main data")
      } catch (error) {
        console.log(error);
      }
    };
    mainData();
  }, []);
  useEffect(() => {
    // Check for user authentication and role in local storage
    const authData = JSON.parse(localStorage.getItem('auth'));
    setUser(authData);
  }, []);
  // const isAdmin = user && user.role === 'PD Manager'
  const isAdmin = user && user.isAdmin === 'yes'; // Check if the user is an admin
  console.log(isAdmin,"is Admin")
  // Only include the "Admin Control Panel" tab if the user is an admin
  const dynamicTabs = isAdmin
    ? tabs
    : tabs.filter(tab => tab.title !== 'Admin Panel');


  const contextValue = {
    isSidebarShrunk,
    tabs: dynamicTabs,
    handleSidebarClick,
    isMulti,
    isMain
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
