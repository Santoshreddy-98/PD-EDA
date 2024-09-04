import hist from '../data/timingout1.json'
import Histogram1 from "../components/Histogram/Histogram1";
import {CContainer} from "@coreui/react"
function App() {

  // ***** Filtering slack values  from ../data/timingout1.json *******
  const a=[]
  hist.map(item =>{
    return a.push(Math.round(item.slack * 100) / 100)
  })

  return (
    <CContainer style={{zoom: "0.8", border: "2px solid powderblue"}}>
        <Histogram1  data={a} />   
    </CContainer>
  );
}

export default App;
