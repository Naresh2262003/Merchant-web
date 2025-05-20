/*!
=========================================================
* Xaults Dashboard PRO
=========================================================
*/
import React , {useState} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import {Navigate} from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal,
} from "reactstrap";

import darkPoweredLogo from '../../assets/img/updated_font_svg.svg';
import xaults from '../../assets/img/Xaults_logo_light_v.png';

const AdminNavbar = (props) => {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [modalSearch, setModalSearch] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");
  const [loginRedirect, setLoginRedirectState] = React.useState(false);

  const navigate= useNavigate();
  const location = useLocation();

  const [currLoc, setCurrLoc] = useState(location.pathname || "/")

  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
    setCurrLoc(location.pathname);
    return function cleanup() {
      window.removeEventListener("resize", updateColor);
    };
  }, [location.pathname]);
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("navbar-transparent");
    }
  };
  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setColor("navbar-transparent");
    } else {
      setColor("bg-white");
    }
    setCollapseOpen(!collapseOpen);
  };
  // this function is to open the Search modal
  const toggleModalSearch = () => {
    setModalSearch(!modalSearch);
  };

  const logOut = () => {
    localStorage.clear();
    setLoginRedirectState(true);
  };

  // if(!localStorage.getItem("token")){
  //   localStorage.clear()
  //   return <Navigate to="/auth/login"/>
  // }

  if(loginRedirect) {
    return <Navigate to='/auth/login' />
  }

  return (
    <>
      <Navbar
        className={classNames("navbar-absolute", {
          [color]: props.location?.pathname?.indexOf("full-screen-map") === -1,
        })}
        expand="lg"
        style={{backgroundColor:"#5732BF", borderBottomRightRadius: 15, borderBottomLeftRadius:15}}
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize d-inline">
              <Button
                className="minimize-sidebar btn-just-icon"
                color="link"
                id="tooltip209599"
                onClick={props.handleMiniClick}
              >
              </Button>
            </div>
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened,
              })}
            >
              <button
                className="navbar-toggler"
                type="button"
                onClick={props.toggleSidebar}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {props.brandText}
            </NavbarBrand>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navigation"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </button>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
                <img 
                  src={xaults} 
                  alt="Logo" 
                  style={{ position:'absolute',top:17, left:35, width:150, cursor:'pointer'}} 
                />
              <UncontrolledDropdown nav>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Mike John responded to your email
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      You have 5 more tasks
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Your friend Michael is in town
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Another notification
                    </DropdownItem>
                  </NavLink>
                  <NavLink tag="li">
                    <DropdownItem className="nav-item">
                      Another one
                    </DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                  onClick={() => {
                    setCurrLoc('/merchant/dashboard')
                    navigate('/merchant/dashboard')
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: currLoc==='/merchant/dashboard'  ? 'white':"", borderRadius:10, paddingInline:16 }}>
                    <h3 style={{margin:0, padding:0, color:  currLoc==='/merchant/dashboard' ? "#5732BF": "#fff", fontSize:18, fontWeight:600, fontFamily:'Nunito', marginBlock:4}}>Dashboard</h3>
                  </div>
                </DropdownToggle>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                  onClick={() => {
                    setCurrLoc('/merchant/loyalty/create')
                    navigate('/merchant/loyalty/create')
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' , backgroundColor: currLoc==='/merchant/loyalty/create'  ? 'white':"", borderRadius:10, paddingInline:16}}>
                    <h3 style={{margin:0, padding:0, color:  currLoc==='/merchant/loyalty/create' ? "#5732BF": "#fff", fontSize:18, fontWeight:600, fontFamily:'Nunito',  marginBlock:4}}>Loyalty Program</h3>
                  </div>
                </DropdownToggle>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                  onClick={() => {
                    setCurrLoc('/merchant/transactions')
                    navigate('/merchant/transactions')
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' , backgroundColor: currLoc==='/merchant/transactions'  ? 'white':"", borderRadius:10, paddingInline:16}}>
                    <h3 style={{margin:0, padding:0, color:  currLoc==='/merchant/transactions' ? "#5732BF": "#fff", fontSize:18, fontWeight:600, fontFamily:'Nunito',  marginBlock:4}}>Transactions</h3>
                  </div>
                </DropdownToggle>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav style={{marginLeft:16}}>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  nav
                  onClick={(e) => e.preventDefault()}
                  style={{marginBlock:3}}
                >
                  <div className="photo">
                    <img alt="..." src={require("assets/img/default-avatar.png")} />
                  </div>
                  <b className="caret d-none d-lg-block d-xl-block" style={{color:"#fff"}} />
                  <p className="d-lg-none">Log out</p>
                </DropdownToggle>
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                  <NavLink tag="li">
                    <DropdownItem className="nav-item" onClick={ logOut }>Log out</DropdownItem>
                  </NavLink>
                </DropdownMenu>
              </UncontrolledDropdown>
              <li className="separator d-lg-none" /> 
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      <Modal
        modalClassName="modal-search"
        isOpen={modalSearch}
        toggle={toggleModalSearch}
      >
        <div className="modal-header">
          <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={toggleModalSearch}
          >
            <i className="tim-icons icon-simple-remove" />
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AdminNavbar;
