import React from "react";
// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert";
import hourglass from '../../assets/img/hourglass.gif'

const PendingPopup = ({ show, onConfirm }) => {
  
  const [alert, setAlert] = React.useState(null);
  if (!show) return null;
  
  const hideAlert = () => {
    setAlert(null);
    onConfirm()
  };

  return (
    <ReactBSAlert
      style={{ display: "block", marginTop: "-100px" }}
      onConfirm={() => hideAlert()}
      confirmBtnBsStyle="info"
      confirmBtnText="Start Exploring"
      btnSize="80px"
      customIcon={
      <img
        src={hourglass}
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

export default PendingPopup;