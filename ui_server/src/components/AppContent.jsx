import React, { Suspense, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from './routes'

export const dieareaData = React.createContext()
export const pathsData = React.createContext()



const AppContent = () => {

  //********** */ Diearea Data Storage *************

  const [cellData, setCellData] = useState()
  const [portsData, setPortsData] = useState()
  const [wiresData, setWiresData] = useState()
  const [timingData, setTimingData] = useState()
  const [dieAreaData, setDieAreaData] = useState()
  const [timingPath, setTimingPath] = useState()
  const [netPath, setNetPath] = useState()
  const [pinsData, setPinsData] = useState()
  const [point , setPoint] = useState()

  //********** */ Diearea Data Storage Ends Here *************

  return (
    <CContainer lg>
      <dieareaData.Provider value={{ cellData, setCellData, portsData, setPortsData, wiresData, setWiresData, timingData, setTimingData, dieAreaData, setDieAreaData, point,setPoint, pinsData, setPinsData }}>
        <pathsData.Provider value={{timingPath, setTimingPath, netPath, setNetPath}}>
          <Suspense fallback={<CSpinner color="primary" />}>
            <Routes>
              {routes.map((route, idx) => {
                return (
                  route.element && (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      element={<route.element />}
                    />
                  )
                )
              })}
              <Route path="/" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Suspense>
        </pathsData.Provider>
      </dieareaData.Provider>
    </CContainer>
  )
}

export default React.memo(AppContent)
