/*!
=========================================================
* Xaults Dashboard PRO
=========================================================
*/
import React from "react";
// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert";
import hourglass from '../../assets/img/hourglass.gif'

// reactstrap components
import { Button, Card, CardBody, CardText, Row, Col , Spinner} from "reactstrap";

const SweetAlert = () => {
  const [alert, setAlert] = React.useState(null);
  // to stop the warning of calling setState of unmounted component
  React.useEffect(() => {
    return function cleanup() {
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });
  const customPendingPopup = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        // title="Welcome to the platform!"
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="info"
        confirmBtnText="Start Exploring"
        btnSize="80px"
        customIcon={
        <img
          src={hourglass} // replace with the correct path or URL
          alt="pending animation"
          style={{ height: "100px", width: "100px" }}
        />
      }
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={hourglass} 
            alt="pending animation"
            style={{ height: "100px", width: "100px" }}
          />
        </div>
        <h2 style={{ fontWeight:600, fontSize:26, textAlign: "center", color:'#595959' }}>
          Welcome to the platform!
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "16px",
            marginBlock: "20px"

          }}
        >
          <i className="fas fa-clock" style={{ color: "#FFA500", alignSelf:'self-start', marginTop:5 }}></i>
          <span>
            Approval Request has been sent to the bank, awaiting bank approval.
          </span>
        </div>
      </ReactBSAlert>
    );
  };
  const basicAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      />
    );
  };
  const titleAndTextAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        It's pretty, isn't it?
      </ReactBSAlert>
    );
  };
  const successAlert = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Good job!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        You clicked the button!
      </ReactBSAlert>
    );
  };
  const htmlAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="HTML example"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        You can use <b>bold</b> text,{" "}
        <a href="https://www.xaults.com">links</a> and other HTML tags
      </ReactBSAlert>
    );
  };
  const warningWithConfirmMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this imaginary file!
      </ReactBSAlert>
    );
  };
  const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => cancelDetele()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this imaginary file!
      </ReactBSAlert>
    );
  };
  const autoCloseAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Auto close alert!"
        onConfirm={() => hideAlert()}
        showConfirm={false}
      >
        I will close in 2 seconds.
      </ReactBSAlert>
    );
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  const inputAlert = () => {
    setAlert(
      <ReactBSAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={(e) => inputConfirmAlert(e)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        btnSize=""
      />
    );
  };
  const inputConfirmAlert = (e) => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
        title="You entered: "
      >
        <b>{e}</b>
      </ReactBSAlert>
    );
  };
  const successDelete = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Deleted!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Your imaginary file has been deleted.
      </ReactBSAlert>
    );
  };
  const cancelDetele = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Your imaginary file is safe :)
      </ReactBSAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  return (
    <>
      <div className="content">
        {alert}
        <div className="places-sweet-alerts">
          <h2 className="text-center">Sweet Alert</h2>
          <p className="category text-center">
            A beautiful plugin, that replace the classic alert, Handcrafted by
            our friend{" "}
            <a
              href="https://twitter.com/t4t5"
              rel="noopener noreferrer"
              target="_blank"
            >
              Tristan Edwards
            </a>
            . Please check out the{" "}
            <a
              href="https://sweetalert2.github.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              full documentation.
            </a>
          </p>
          <Row className="mt-5">
            <Col className="ml-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>Basic example</CardText>
                  <Button
                    className="btn-fill"
                    color="info"
                    onClick={basicAlert}
                  >
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="mr-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>A success message</CardText>
                  <Button
                    className="btn-fill"
                    color="info"
                    onClick={successAlert}
                  >
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="ml-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>Custom HTML description</CardText>
                  <Button className="btn-fill" color="info" onClick={htmlAlert}>
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="mr-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>
                    A warning message, with a function attached to the "Confirm"
                    Button...
                  </CardText>
                  <Button
                    className="btn-fill"
                    color="info"
                    onClick={warningWithConfirmMessage}
                  >
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="ml-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>Modal window with input field</CardText>
                  <Button
                    className="btn-fill"
                    color="info"
                    onClick={inputAlert}
                  >
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="mr-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>A title with a text under</CardText>
                  <Button
                    className="btn-fill"
                    color="info"
                    onClick={titleAndTextAlert}
                  >
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="ml-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>
                    A message with auto close timer set to 2 seconds
                  </CardText>
                  <Button
                    className="btn-fill"
                    color="info"
                    onClick={autoCloseAlert}
                  >
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="mr-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>
                    ...and by passing a parameter, you can execute something
                    else for "Cancel"
                  </CardText>
                  <Button
                    className="btn-fill"
                    color="info"
                    onClick={warningWithConfirmAndCancelMessage}
                  >
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col className="ml-auto" md="3">
              <Card>
                <CardBody className="text-center">
                  <CardText>Custom Pending Popup</CardText>
                  <Button className="btn-fill" color="info" onClick={customPendingPopup}>
                    Try me!
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default SweetAlert;
