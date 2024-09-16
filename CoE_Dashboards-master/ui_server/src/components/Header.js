import React from "react";
import styled from "styled-components";
import { FaWindowClose, FaBars } from "react-icons/fa";
import { useAppContext } from "../AppContext";
import { logout } from "../designAuditor/logout";
import { Link, useLocation } from "react-router-dom";

const HeaderWrapper = styled.header`
  background-color: #fff;
  color: white;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 5px rgba(57, 63, 72, 0.3);

`;

const StyledSpan = styled.span`
  cursor: pointer;
  font-size: 20px;
  color: #252525;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  background-color: #4169E1;
  color: white;
  font-family: "Aquire";
  border: none;
  border-radius: 4px;
  padding: 9px 10px;
  margin-left: 15px;
  cursor: pointer;
`;

const Header = () => {
  const { isSidebarShrunk, handleSidebarClick } = useAppContext();
  const { pathname } = useLocation()
  // console.log(pathname)
  const UserInfo = JSON.parse(localStorage.getItem('auth'))
  return (
    <HeaderWrapper>
      <StyledSpan onClick={() => handleSidebarClick()}>
        {isSidebarShrunk ? <FaWindowClose size={20} /> : <FaBars size={20} />}
      </StyledSpan>

      {UserInfo !== null ? (
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            <div>
              <button style={{ color: "black" }} className="btn ml-4">
                <b>Logged In: {UserInfo?.username && UserInfo?.username.toUpperCase()}</b>
              </button>
            </div>
            <div>
              <button style={{ color: "black" }} className="btn">
                <b>Role: {UserInfo?.role}</b>
              </button>
            </div>
          </div>
          <div>

            <Link to="/configYML">
              <Button>Add Design</Button>
            </Link>
            <Button style={{ background: "red" }} onClick={() => logout()}>
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <ButtonWrapper>
          {pathname !== "/DAloginpage" && (
            <>
              <Link to="/">
                <Button>Login</Button>
              </Link>
            </>
          )}
          <span style={{ marginLeft: "15px", fontSize: "16px", color: "#252525" }}>
            Guest (read-only mode)
          </span>
        </ButtonWrapper>
      )}
    </HeaderWrapper>
  );
};

export default Header;
