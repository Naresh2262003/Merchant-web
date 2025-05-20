import React from "react";
// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert";
import hourglass from '../../assets/img/hat.gif'

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
      showCancel={false}
      showConfirm={false} 
      btnSize="80px"
      customIcon={
      <img
        src={hourglass}
        alt="pending animation"
        style={{ height: "200px", width: "200px" }}
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
      <div style={{ marginTop: "30px", textAlign: "center" }}>  
        <button
          onClick={() => hideAlert()}
          style={{ paddingBlock:15, paddingInline:48 , backgroundColor:"#5732BF", boxShadow:'0 4px 6px rgba(50, 50, 93, 0.31)', color:"#fff", border:"none", fontFamily:"Poppins", fontWeight:500, fontSize:14, borderRadius:12}}
        >
          Start Exploring
        </button>
      </div>
    </ReactBSAlert>
  );
};

export default PendingPopup;