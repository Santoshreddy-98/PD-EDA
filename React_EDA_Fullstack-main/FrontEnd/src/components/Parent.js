import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Draw from "../components/Draw";
import Popup from "../components/Popup";


import '../App.css'
export const GetId = React.createContext()

function App() {

  const [buttonPopup, setButtonPopup] = useState(false)
  const [open, setOpen] = useState(true)
  const [idOpen, setIdOpen] = useState(true)
  const [zooming, setZooming] = useState("")

  return (
    <div className="main">

      <GetId.Provider value={{ setIdOpen, idOpen }}>

        <Header dataCell={open} setZooming={setZooming} setOpen={setOpen}  />
        <Draw zooming={zooming} setOpen={setOpen} setButtonPopup={setButtonPopup} />
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup} open={open} />

      </GetId.Provider>
      
    </div>

  );
}

export default App;
