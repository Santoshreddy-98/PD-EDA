import React from "react";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BootstrapTable from "../contents/BootstrapTable";
import ChartComponent from "../charts/ChartComponent";
import { useAppContext } from "../AppContext"; // Import the AppProvider and useAppContext
import LNLtable from "../detailDashboard/LNLtable";
import Login from "../designAuditor/Login";
import ConfigYML from "../designAuditor/ConfigYML";
import DesignAuditorHome from "../designAuditor/DesignAuditorHome";
import ChecklistSummary from "../designAuditor/Reports/ChecklistSummary";
import ViewChecklist from "../designAuditor/Reports/ViewChecklist";
import AdminLogin from "../adminModule/AdminLogin";
import AdminList from "../adminModule/AdminList";
import UpdateChecklist from "../designAuditor/Reports/UpdateChecklist";
import ChecklistQuestions from "../designAuditor/Reports/ChecklistQuestions"; //active checklist
import PageNotFound from "../designAuditor/Reports/PageNotFound";
import PasswordChange from "../PasswordManagement/PasswordChanage";
import PasswordResetForm from "../PasswordManagement/PasswordResetForm";
const AppWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ isSidebarShrunk }) =>
    isSidebarShrunk ? "200px 1fr" : "55px 1fr"};
  transition: grid-template-columns 0.4s ease;

  
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  padding: 1px;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  padding: 0 0 5px 0; /* Add padding to create space between header and main content */
`;

const MainPage = () => {
  return <h1>hello world </h1>;
};

const Tab2Contents = () => {
  return <h1>tab2</h1>;
};
const Tab3Contents = () => {
  return <h1>tab3</h1>;
};
const Tab4Contents = () => {
  return <h1>flow</h1>;
};

const MainHome = () => {
  const { isSidebarShrunk } = useAppContext(); // Use the isSidebarShrunk value from context
  const auth = JSON.parse(localStorage.getItem("auth")) || false;
  return (
    <AppWrapper isSidebarShrunk={isSidebarShrunk}>
      <Sidebar />

      <ContentWrapper>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/mainpage" element={<BootstrapTable />} />
          <Route path="/timing" element={<MainPage />} />
          <Route path="/design" element={<Tab3Contents />} />
          <Route path="/power" element={<Tab2Contents />} />
          <Route path="/flow" element={<Tab4Contents />} />
          <Route path="/chartpage" element={<ChartComponent />} />
          <Route path="/detailpage" element={<LNLtable />} />
          <Route path="/configYML" element={<ConfigYML />} />
          <Route path="/reset/request" element={<PasswordResetForm />} />
          <Route path="/reset/password/:token" element={<PasswordChange />} />

          {
            auth && auth.isAdmin === 'yes' && <>
              <Route path="/admin/create" element={<AdminLogin />} />
              <Route path="/admin/list" element={<AdminList />} />
            </>
          }
          
          {/* Design Auditor Paths */}
          <Route path="/designAuditorPage" element={<DesignAuditorHome />} /> 
          <Route path="/designAuditorPage/view/:milestone/:DesignName/:Stage/:ChecklistType" element={<ViewChecklist />} />
          {
            auth && (auth.role === "PD Lead" || auth.role ==="PD Dev") &&<>
              <Route path="/designAuditorPage/info/:milestone/:DesignName/:Stage/:ChecklistType" element={<UpdateChecklist />} />
              <Route path="/designAuditorPage/summary/:milestone/:DesignName/:Stage/:ChecklistType" element={<ChecklistSummary />} />
            </>
          }
          <Route path="/designAuditorPage/questions/add/:milestone/:DesignName/:stage/:type" element={<ChecklistQuestions />} />
          <Route path="/DAloginpage" element={<Login />} />
          <Route path="*" element ={<PageNotFound/>}/>
        </Routes>
      </ContentWrapper>
    </AppWrapper>
  );
};
export default MainHome;