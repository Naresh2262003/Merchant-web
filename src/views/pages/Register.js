import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
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
  const [phoneNo, setPhoneNo]= useState("");
  const [isPressed, setIsPressed] = useState(false);

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

  const register = async (e) => {
    e.preventDefault();

    if( !firstName.trim() || !lastname.trim() || !accountNo.trim() || !mcc.trim() || !geo.trim() || !id.trim() || !phoneNo.trim()){
        notify("tr", "Please Fill the required details.");
        return;
    }

    if(phoneNo.trim().length !== 10 ){
      notify("tr", "Phone Number should be of 10 Digits.");
      return;
    }

    const body = {
      name: firstName+ " " + lastname,
      account_no: accountNo,
      merchant_id: id,
      mcc,
      geo_id: geo,
      phone_number: phoneNo
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
        LocalStorageManager.setAccountId(data.data.account_no);
        LocalStorageManager.setName(data.data.name);
        LocalStorageManager.setMCC(data.data.mcc);
        LocalStorageManager.setGeo(data.data.geo_id);
        LocalStorageManager.setPhoneNo(data.data.phone_number);
        LocalStorageManager.setPhoneNo(data.data.phone_number);
        LocalStorageManager.setWalletID(data.wallet_id)
        LocalStorageManager.setRegistered(true);
        navigate("/merchant/dashboard");
      }
    } catch (error) {
      notify("tr", error.toString());
    }
  };

  return (
    <div className="d-flex align-items-center justify-between vh-100" style={{marginLeft:0, paddingLeft:0, backgroundColor:"#F8F6FE", overflow:'hidden'}}>
      <NotificationAlert ref={notificationAlertRef} />
        <Container style={{width:'150%', paddingLeft:20, marginLeft:60}}>
          <Row className="align-items-center" style={{width:'150%'}}>
            <Col md="6" className="" style={{backgroundColor:"#F8F6FE", width:'700px', minHeight:'850px', display:'flex', flexDirection:'column', justifyContent:'center', gap:50,  alignItems:"center" }}>
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
              <h2 style={{fontFamily: 'Poppins', fontWeight:600, width:610, marginInline:100, marginBottom:15, lineHeight:'45px'}}>Track Your Transactions and Rewards Easily</h2>
              <h4 style={{fontFamily: 'Poppins', fontWeight:300, width:580, marginInline:100, fontSize:17, textAlign:'center'}}>Easily monitor every transaction and effectively reward your customers—all in one convenient place.</h4>
              </div>
            </Col>
            
            <Col md="5" style={{marginLeft:120, backgroundColor:"white", paddingBlock:200}}>
              {/* <img 
                src={require("assets/img/xaults_bg_black.png")}
                alt="illustration"
                style={{ position: 'absolute', top:108, right:10, width:'180px' }}
              /> */}
              <div className="register-box p-4 bg-white" style={{borderRadius:16, marginRight:75, marginLeft:30,  }}>
              <div style={{marginTop: 20, marginBottom: 50,  marginInline:10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems:'center'}}>
              <h2 className="mb-4" style={{fontSize:46, fontFamily:'Poppins', fontWeight:600}}>Sign up</h2>
              <p className="text-muted mb-4" style={{ width: '100%' , textAlign:'center'}}>
                Let’s get you all set up so you can create your merchant account.
              </p>
              <Form  style={{width:'100%'}} onSubmit={(e)=>register(e)}>
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
                <Input
                  type="text"
                  placeholder="Phone Number"
                  className="form-control mb-4 py-4"
                  maxLength={10}
                  style={{fontSize:16}} 
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
                <button type="submit" style={{fontSize:16, backgroundColor:"#5732BF", width:"100%", border:"none", color:"white", paddingBlock: 16, borderRadius:7, fontWeight:600,
                    transition: "all 0.1s ease",
                    transform: isPressed ? "translateY(2px)" : "translateY(0px)",
                  }} 
                    
                  onMouseDown={() => setIsPressed(true)}
                  onMouseUp={() => setIsPressed(false)}
                  onMouseLeave={() => setIsPressed(false)} 
                  
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4522a6")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5732BF")}
                
                >
                  Create account
                </button>
                <div className="text-center mt-4">
                  Already have an account? <Link to="/auth/login" style={{color:"#5732BF"}}>Login</Link>
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