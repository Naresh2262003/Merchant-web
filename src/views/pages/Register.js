
import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { useNavigate, Link } from "react-router-dom";
import { config } from "config";
import NotificationAlert from "react-notification-alert";
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

const Register = () => {
  const [state, setState] = useState({});
  const [accountNo, setAccountNo] = useState(null);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [mcc, setMcc] = useState(null);
  const [geo, setGeo] = useState(null);

  const navigate = useNavigate();
  const notificationAlertRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("login-page"); // reuse login-page styling
    return () => document.body.classList.toggle("login-page");
  }, []);

  const notify = (place, msg, ntype) => {
    const type = ntype === "success" ? "success" : "danger";
    const options = {
      place,
      message: <div><b>{msg}</b> {ntype !== "success" && "- Error"}</div>,
      type,
      icon: "tim-icons icon-alert-circle-exc",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  const register = async () => {
    const body = {
      name,
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
        navigate("/admin/files");
      }
    } catch (error) {
      notify("tr", error.toString());
    }
  };

  return (
    <>
      <div className="content pt-5">
        <div className="rna-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        <Container>
          <Col className="ml-auto mr-auto" lg="4" md="6">
            <Form className="form">
              <Card className="card-login card-white">
                <CardHeader className="text-center" style={{ paddingBottom: "0px" }}>
                  <img
                    alt="..."
                    src={require("assets/img/merchant2.png")}
                    style={{ width: "150px", position:"relative", margin: "10px 0 6px 0" }}
                  />
                  <CardTitle tag="h5" style={{ color: "#003149" }}>Register</CardTitle>
                </CardHeader>

                <CardBody className="pb-0">
                  <InputGroup className={classnames({ "input-group-focus": state.nameFocus })}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><i className="tim-icons icon-single-02" /></InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Full Name"
                      type="text"
                      defaultValue={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setState({ ...state, nameFocus: true })}
                      onBlur={() => setState({ ...state, nameFocus: false })}
                    />
                  </InputGroup>

                  <InputGroup className={classnames({ "input-group-focus": state.accountNoFocus })}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><i className="tim-icons icon-bank" /></InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Account No"
                      type="text"
                      defaultValue={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      onFocus={() => setState({ ...state, accountNoFocus: true })}
                      onBlur={() => setState({ ...state, accountNoFocus: false })}
                    />
                  </InputGroup>

                  <InputGroup className={classnames({ "input-group-focus": state.idFocus })}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><i className="tim-icons icon-badge" /></InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Merchant ID"
                      type="text"
                      defaultValue={id}
                      onChange={(e) => setId(e.target.value)}
                      onFocus={() => setState({ ...state, idFocus: true })}
                      onBlur={() => setState({ ...state, idFocus: false })}
                    />
                  </InputGroup>

                  <InputGroup className={classnames({ "input-group-focus": state.mccFocus })}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><i className="tim-icons icon-map-big" /></InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="MCC"
                      type="text"
                      defaultValue={mcc}
                      onChange={(e) => setMcc(e.target.value)}
                      onFocus={() => setState({ ...state, mccFocus: true })}
                      onBlur={() => setState({ ...state, mccFocus: false })}
                    />
                  </InputGroup>

                  <InputGroup className={classnames({ "input-group-focus": state.geoFocus })}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText><i className="tim-icons icon-world" /></InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Geo ID"
                      type="text"
                      defaultValue={geo}
                      onChange={(e) => setGeo(e.target.value)}
                      onFocus={() => setState({ ...state, geoFocus: true })}
                      onBlur={() => setState({ ...state, geoFocus: false })}
                    />
                  </InputGroup>
                </CardBody>

                <CardFooter className="pt-0 pb-0">
                  <Button className="mb-2 btn-block" color="info" onClick={register} size="lg">
                    Register
                  </Button>
                  <div className="text-center mb-2">
                      Already have an account?{" "}
                      <Link to="/auth/login" className="text-info">
                        Login
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

export default Register;
