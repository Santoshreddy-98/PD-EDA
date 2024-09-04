import React from 'react'    
import CIcon from '@coreui/icons-react'
import {
  cilArrowThickToBottom,
  cilBank,
  cilBell,
  cilBlurCircular,
  cilBook,
  cilCalculator,
  cilChartPie,
  cilCloudUpload,
  cilCrop,
  cilCursor,
  cilDescription,
  cilDrop,
  cilMemory,
  cilNotes,
  cilPencil,
  cilPrint,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilWatch,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <img style={{paddingRight:"10px"}} height="50px" src="https://pbs.twimg.com/profile_images/1346392681736331264/iwMsr5AM_400x400.jpg" alt="logo" />,//<CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Timingreport',
    to: '/timingreport',
    icon: <CIcon icon={cilBlurCircular} customClassName="nav-icon" />,
  }, 
  {
    component: CNavItem,
    name: 'Def viewer',
    to: '/defViewer',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Histogram',
    to: '/histogram',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Histogram & Timing',
    to: '/histim',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Import Design Files',
    to: '/import',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  }
]

export default _nav
