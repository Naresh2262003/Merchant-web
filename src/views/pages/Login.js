
import React, { useState, useRef } from "react";
import { Navigate, useLocation, useNavigate , Link} from "react-router-dom";
import classnames from "classnames";
import { config } from "config";
import LocalStorageManager from "../../utils/LocalStorageManager";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from "reactstrap";

import NotificationAlert from "react-notification-alert";




const Login = () => {
  const [state, setState] = useState({});
  const [merchantId , setMerchantId] = useState("");

  const notificationAlertRef = useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.classList.toggle("login-page");
    return function cleanup() {
      document.body.classList.toggle("login-page");
    };
  });

  // XHR Request to send transaction to Blockchain
  async function  login () {
    console.log("Inside Login Button");
    const settings = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }

    try {
      const response = await fetch(
          `${config.api_url}/merchant/api/login-merchant/${merchantId}`, settings
      );

      const json = await response.json();

      if (!response.ok) {
        console.log("Login Failed");
        console.log("errp", json.status);
        notify("tr", json.status);
      } else {
        console.log("Login Success");
        notify("tr", "Login Success", "success");
        console.log("Response", json);
        LocalStorageManager.setMerchantId(json.data.merchant_id);
        LocalStorageManager.setAccountId( json.data.account_no? `${json.data.account_no}@drbob`:"");
        LocalStorageManager.setName(json.data.name);
        LocalStorageManager.setMCC(json.data.mcc);
        LocalStorageManager.setGeo(json.data.geo_id);
        navigate("/admin/files");
      }
    } catch (error) {
      notify("tr", error.toString());
    }
  }

  const notify = (place, msg, ntype) => {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (ntype === "success" ? 2 : 3) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
          <div>
            <div>
              <b>{msg}</b> {ntype === "success" ? "" : "- Error"}
            </div>
          </div>
      ),
      type: type,
      icon: "tim-icons icon-alert-circle-exc",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  // if(orgName !== null && token !== null) {
  //   return <Navigate to='/admin/loyalty' />
  // }

  return (
      <>
        <div className="content pt-6">
          <div className="rna-container">
            <NotificationAlert ref={ notificationAlertRef } />
          </div>

          <Container>
            <Col className="ml-auto mr-auto" lg="4" md="6">
              <Form className="form">
                <Card className="card-login card-white">
                  <CardHeader className="text-center" style={{paddingBottom: "10px"}}>
                    <img
                        alt="..."
                        src={require("assets/img/merchant2.png")}
                        style={{width: "150px", position: "relative", margin: "14px 0 10px 0"}}
                    />
                    <CardTitle tag="h1" style={{color: "#003149"}}>Log in</CardTitle>
                  </CardHeader>
                  <CardBody className="pb-0">
                    <InputGroup
                        className={classnames({
                          "input-group-focus": state.merchantIDFocus,
                        })}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-email-85" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                          placeholder="Enter Your Merchant ID"
                          type="text"
                          defaultValue={ merchantId }
                          onChange={(e) => setMerchantId(e.target.value)}
                          onFocus={(e) => setState({ ...state, merchantIDFocus: true })}
                          onBlur={(e) => setState({ ...state, merchantIDFocus: false })}
                      />
                    </InputGroup>
                  </CardBody>

                  <CardFooter className="pt-0">
                    <Button
                        block
                        className="mb-3"
                        color="info"
                        onClick={ login }
                        size="lg"
                    >
                      Log In
                    </Button>
                    <div className="text-center">
                      Don't have an account?{" "}
                      <Link to="/auth/register" className="text-info">
                        Register
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </>
  );
};

export default Login;