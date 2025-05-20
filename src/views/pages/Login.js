import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import classnames from "classnames";
import { config } from "config";
import LocalStorageManager from "../../utils/LocalStorageManager";

import {
  Button,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

import NotificationAlert from "react-notification-alert";

const Login = () => {
  const [state, setState] = useState({});
  const [merchantId, setMerchantId] = useState("");
  const [isPressed, setIsPressed] = useState(false);

  const notificationAlertRef = useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  const notify = (place, msg, ntype) => {
    const type = ntype === "success" ? "success" : "danger";
    const options = {
      place,
      message: (
        <div>
          <b>{msg}</b> {ntype !== "success" && "- Error"}
        </div>
      ),
      type,
      icon: "tim-icons icon-alert-circle-exc",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const login = async (e) => {
    e.preventDefault();
    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    };

    try {
      const response = await fetch(
        `${config.api_url}/merchant/api/login-merchant/${merchantId}`,
        settings
      );

      const json = await response.json();

      console.log("here is the console", json.error_message);

      if (!response.ok) {
        notify("tr", json.message || json.error_message);
      } else {
        notify("tr", "Login Success", "success");
        console.log("success", json)
        LocalStorageManager.setMerchantId(json.data.merchant_id);
        LocalStorageManager.setAccountId(json.data.account_no);
        LocalStorageManager.setName(json.data.name);
        LocalStorageManager.setMCC(json.data.mcc);
        LocalStorageManager.setGeo(json.data.geo_id);
        LocalStorageManager.setWalletID(json.wallet_id)
        navigate("/merchant/dashboard");
      }
    } catch (error) {
      notify("tr", error.toString());
    }
  };

  return (
    <div className="d-flex align-items-center justify-between vh-100" style={{ marginLeft: 0, paddingLeft: 0,  backgroundColor:"#F8F6FE", overflow:'hidden' }}>
      <NotificationAlert ref={notificationAlertRef} />
      <Container style={{ width: '150%', paddingLeft: 20, marginLeft: 60 }}>
        <Row className="align-items-center" style={{ width: '150%' }}>
          {/* <Col md="6" className="d-none d-md-block text-center" style={{ backgroundColor:"#F8F6FEBD",  width: '700px', minHeight: '850px', display:'flex', flexDirection:'column' , justifyContent:'flex-start', alignItems:"center" }}> */}
          <Col md="6" style={{ backgroundColor:"#F8F6FE",  width: '700px', minHeight: '850px', display:'flex', flexDirection:'column' , justifyContent:'center', gap:50, alignItems:"center" }}>
            <div>
              <img 
                src={require("assets/img/xaults_bg_black_v.png")}
                alt="illustration"
                style={{width:'200px' , marginTop:0}}
              />
            </div>
            <div>
              <img
                src={require("assets/img/27.png")}
                alt="illustration"
                className="img-fluid"
                style={{ height: "350px"}}
              />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                width: 600,
                marginInline: 100,
                marginBottom: 15,
                lineHeight: '45px',
                textAlign:'center'
              }}>
                Reconnect with Your Merchant Dashboard
              </h2>
              <h4 style={{
                fontFamily: 'Poppins',
                fontWeight: 300,
                width:600,
                marginInline: 100,
                fontSize: 17,
                textAlign:'center'
              }}>
                Access your account to track transactions and manage customer rewards with ease.
              </h4>
            </div>
          </Col>

          <Col md="5" style={{ marginLeft: 120, backgroundColor: "white", paddingBlock: 200 }}>
            {/* <img 
              src={require("assets/img/xaults_bg_black.png")}
              alt="illustration"
              style={{ position: 'absolute', top:-40, right:10, width:'180px' }}
            /> */}
            <div className="register-box p-4 bg-white" style={{ borderRadius: 16, marginRight: 75, marginLeft: 30 }}>
              <div style={{ marginTop: 20, marginBottom: 50, marginInline: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 className="mb-4" style={{ fontSize: 46, fontFamily: 'Poppins', fontWeight: 600 }}>Welcome back!</h2>
                <p className="text-muted mb-4" style={{ width: '100%' , textAlign:'center'}}>
                  Please enter your Merchant ID to access your account.
                </p>
                <Form style={{ width: '100%' }} onSubmit={(e)=>login(e)}>
                  <Input
                    type="text"
                    placeholder="Merchant ID"
                    className="form-control mb-4 py-4"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    onFocus={() => setState({ ...state, merchantIDFocus: true })}
                    onBlur={() => setState({ ...state, merchantIDFocus: false })}
                    style={{ fontSize: 16 }}
                  />
                  <button type="submit" style={{
                    fontSize:16, backgroundColor:"#5732BF", width:"100%", border:"none", color:"white", paddingBlock: 16, borderRadius:7, fontWeight:600,
                    transition: "all 0.1s ease",
                    transform: isPressed ? "translateY(2px)" : "translateY(0px)",
                    }} 
                    
                    onMouseDown={() => setIsPressed(true)}
                    onMouseUp={() => setIsPressed(false)}
                    onMouseLeave={() => setIsPressed(false)} 
                    
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4522a6")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5732BF")}
                    
                  >
                    Log in
                  </button>
                  <div className="text-center mt-4">
                    Don't have an account? <Link to="/auth/register" style={{color:"#5732BF"}}>Sign up</Link>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
