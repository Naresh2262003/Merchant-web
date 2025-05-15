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

  const login = async () => {
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

      if (!response.ok) {
        notify("tr", json.status);
      } else {
        notify("tr", "Login Success", "success");
        LocalStorageManager.setMerchantId(json.data.merchant_id);
        LocalStorageManager.setAccountId(json.data.account_no ? `${json.data.account_no}@drbob` : "");
        LocalStorageManager.setName(json.data.name);
        LocalStorageManager.setMCC(json.data.mcc);
        LocalStorageManager.setGeo(json.data.geo_id);
        navigate("/merchant/dashboard");
      }
    } catch (error) {
      notify("tr", error.toString());
    }
  };

  return (
    <div className="d-flex align-items-center justify-between vh-100" style={{ marginLeft: 0, paddingLeft: 0, backgroundColor: "#E2F0FF" }}>
      <NotificationAlert ref={notificationAlertRef} />
      <Container style={{ width: '150%', paddingLeft: 20, marginLeft: 50 }}>
        <Row className="align-items-center" style={{ width: '150%' }}>
          {/* Left Side - Image & Message (70%) */}
          <Col md="6" className="d-none d-md-block text-center" style={{ backgroundColor: "#E2F0FF", width: '700px', minHeight: '850px' }}>
            <img
              src={require("assets/img/1.png")}
              alt="illustration"
              className="img-fluid"
              style={{ height: "400px", marginTop: '110px' }}
            />
            <div>
              <h2 style={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                width: 600,
                marginInline: 100,
                marginTop: 30,
                marginBottom: 15,
                lineHeight: '45px'
              }}>
                Reconnect with Your Merchant Dashboard
              </h2>
              <h4 style={{
                fontFamily: 'Poppins',
                fontWeight: 300,
                width:600,
                marginInline: 100,
                fontSize: 17
              }}>
                Access your account to track transactions and manage customer rewards with ease.
              </h4>
            </div>
          </Col>

          {/* Right Side - Login Form (30%) */}
          <Col md="5" style={{ marginLeft: 120, backgroundColor: "white", paddingBlock: 200 }}>
            <img 
              src={require("assets/img/xaults_bg_black.png")}
              alt="illustration"
              style={{ position: 'absolute', top:-40, right:10, width:'180px' }}
            />
            <div className="register-box p-4 bg-white" style={{ borderRadius: 16, marginRight: 75, marginLeft: 30 }}>
              <div style={{ marginTop: 20, marginBottom: 50, marginInline: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 className="mb-4" style={{ fontSize: 46, fontFamily: 'Poppins', fontWeight: 600 }}>Welcome back!</h2>
                <p className="text-muted mb-4" style={{ width: '90%' , textAlign:'center'}}>
                  Please enter your Merchant ID to access your account.
                </p>
                <Form style={{ width: '90%' }}>
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
                  <Button color="info" className="p-3" style={{ fontSize: 16 }} block onClick={login}>
                    Log in
                  </Button>
                  <div className="text-center mt-4">
                    Don't have an account? <Link to="/auth/register">Sign up</Link>
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
