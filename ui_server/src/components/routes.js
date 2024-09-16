import { element } from 'prop-types'
import React from 'react'

import { Link } from 'react-router-dom'



// leftpage components


const Timingreport = React.lazy(() => import('../DashboardComponents/Timingreport'))
const Parent = React.lazy(() => import('./components/Parent'))
const Histogram = React.lazy(() => import('../DashboardComponents/Histogram'))
const Histogramtimingreport = React.lazy(() => import('../DashboardComponents/Histogramtimingreport'))
const Import = React.lazy(() => import ('../DashboardComponents/Import'))


const routes = [
  { path: '/',name: 'Import Design Files', element: Import, exact: true }, 
  { path: '/defviewer', name: 'DefViewer', element: Parent, exact: true }, 
  { path: '/timingreport',name: 'Timingreport', element: Timingreport, exact: true },
  { path: '/histogram',name: 'Histogram', element: Histogram, exact: true },
  { path: '/histim',name: 'Histogram & Timing', element: Histogramtimingreport, exact: true },
  { path: '/import',name: 'Import Design Files', element: Import, exact: true }
]



export default routes
