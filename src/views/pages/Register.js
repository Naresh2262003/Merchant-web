import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
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

const Register = () => {
  const [state, setState] = useState({});
  const [accountNo, setAccountNo] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [mcc, setMcc] = useState("");
  const [geo, setGeo] = useState("");
  const [firstName, setFirstName]= useState("");
  const [lastname, setLastName]= useState("");

  const navigate = useNavigate();
  const notificationAlertRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("register-page");
    return () => document.body.classList.remove("register-page");
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

  const register = async () => {
    const body = {
      name: firstName+" "+lastname,
      account_no: accountNo,
      merchant_id: id,
      mcc,
      geo_id: geo,
    };


    try {
      const response = await fetch(`${config.api_url}/merchant/api/ReqRegisterMerchant`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        notify("tr", data.error_message);
      } else {
        notify("tr", "Registration Success", "success");
        LocalStorageManager.setMerchantId(data.data.merchant_id);
        LocalStorageManager.setAccountId(`${data.data.account_no}@drbob`);
        LocalStorageManager.setName(data.data.name);
        LocalStorageManager.setMCC(mcc);
        LocalStorageManager.setGeo(geo);
        LocalStorageManager.setRegistered(true);
        navigate("/merchant/dashboard");
      }
    } catch (error) {
      notify("tr", error.toString());
    }
  };

  return (
    <div className="d-flex align-items-center justify-between vh-100" style={{marginLeft:0, paddingLeft:0, backgroundColor:"#E2F0FF"}}>
      <NotificationAlert ref={notificationAlertRef} />
        <Container style={{width:'150%', paddingLeft:20, marginLeft:50}}>
          <Row className="align-items-center" style={{width:'150%'}}>
            <Col md="5" className="d-none d-md-block text-center" style={{backgroundColor:"#E2F0FF", width:'700px', minHeight:'850px'}}>
              <img
                src={require("assets/img/1.png")}
                alt="illustration"
                className="img-fluid"
                style={{ height: "400px", marginTop:'110px'}}
              />
             <div>
                <h2 style={{fontFamily: 'Poppins', fontWeight:600, width:500, marginInline:90, marginTop:30, marginBottom:15, lineHeight:'45px',}}> Track Your Payments and Rewards Seamlessly </h2>
                <h4 style={{fontFamily: 'Poppins', fontWeight:300, width:480, marginInline:100, fontSize:17}}>Monitor every transaction and reward your customers—all in one place.</h4>
             </div>
            </Col>
            <Col md="6" style={{marginLeft:120, backgroundColor:"white", paddingBlock:120}}>
              <div className="register-box p-4 bg-white" style={{borderRadius:16, marginRight:75, marginLeft:30,  }}>
              <div style={{marginTop: 20, marginBottom: 50,  marginInline:10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center'}}>
              <h2 className="mb-4" style={{fontSize:50, fontFamily:'Poppins', fontWeight:600, fontStyle:'normal'}}>Sign up</h2>
              <p className="text-muted mb-4">
                Let’s get you all set up so you can access your merchant account.
              </p>
              <Form  style={{width:'90%'}}>
                <Row>
                  <Col md="6">
                    <Input
                      type="text"
                      placeholder="First Name"
                      className="form-control mb-4 py-4"
                      value={firstName}
                      style={{fontSize:16}}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Col>
                  <Col md="6">
                    <Input
                      type="text"
                      placeholder="Last Name"
                      className="form-control mb-4 py-4"
                      style={{fontSize:16}} 
                      value={lastname}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Col>
                </Row>
                <Input
                  type="Merchant ID"
                  placeholder="Merchant ID"
                  className="form-control mb-4 py-4"
                  style={{fontSize:16}} 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Account Number"
                  className="form-control mb-4 py-4"
                  style={{fontSize:16}} 
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="MCC"
                  className="form-control mb-4 py-4"
                  style={{fontSize:16}} 
                  value={mcc}
                  onChange={(e) => setMcc(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Geography"
                  className="form-control mb-4 py-4"
                  style={{fontSize:16}} 
                  value={geo}
                  onChange={(e) => setGeo(e.target.value)}
                />
                <Button color="info" className="p-3" style={{fontSize:16}} block onClick={register}>
                  Create account
                </Button>
                <div className="text-center mt-4">
                  Already have an account? <Link to="/auth/login">Login</Link>
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

export default Register;