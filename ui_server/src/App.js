import React from "react";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainHome from "./components/MainHome";
import { AppProvider } from "./AppContext";

function App() {
 //console.log(latest)
  return (
    <div>
     <ToastContainer position="top-right" />
      <AppProvider>
        <MainHome />
      </AppProvider>
    </div>
  );
}

export default App;
