import React from 'react'
import AppBreadcrumb from './AppBreadcrumb'
import AppContent from './AppContent'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'
import AppHeaderDropdown from './header/AppHeaderDropdown'
import AppSidebar from './AppSidebar'


export {
  AppBreadcrumb,
  AppHeaderDropdown,
}

const Index = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-5">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>

    </div>
  )
}

export default Index

