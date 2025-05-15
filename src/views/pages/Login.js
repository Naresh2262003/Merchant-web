import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import classnames from "classnames";
import { config } from "config";
import LocalStorageManager from "../../utils/LocalStorageManager";

import {
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
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
    console.log("Inside Login Button");
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
        console.log("Login Failed");
        notify("tr", json.status);
      } else {
        console.log("Login Success");
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
    <div className="register-container d-flex align-items-center justify-content-center vh-100 vw-100">
      <NotificationAlert ref={notificationAlertRef} />
      <Container style={{width:'150%', paddingLeft:20, marginLeft:140}}>
        <Row className="align-items-center" style={{width:'140%'}}>
          <Col md="5" className="d-none d-md-block text-center">
            <img
              src={require("assets/img/login11.png")}
              alt="illustration"
              className="img-fluid"
              style={{ height: "800px"}}
            />
          </Col>
          <Col md="6" style={{marginLeft:120}}>
            <div className="register-box p-4 shadow bg-white" style={{borderRadius:16, marginRight:75, marginLeft:30}}>
              <div style={{marginTop: 20, marginBottom: 20, marginInline:10}}>
              <h2 className="mb-4" style={{fontSize:40, fontFamily:'Poppins-Bold'}}>Log in</h2>
              <p className="text-muted mb-4">
                 Welcome back! Please enter your Merchant ID to access your account.
              </p>
              <Form>
                <Input
                  type="text"
                  placeholder="Merchant ID"
                  className="form-control mb-4"
                  value={merchantId}
                  onChange={(e) => setMerchantId(e.target.value)}
                  onFocus={() => setState({ ...state, merchantIDFocus: true })}
                  onBlur={() => setState({ ...state, merchantIDFocus: false })}
                />
                <Button color="primary" block onClick={login}>
                  Log in
                </Button>
                <div className="text-center mt-4">
                  Don't have an account? <Link to="/auth/register">Register</Link>
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
