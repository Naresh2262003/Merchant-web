import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Row, Col, Alert, } from "reactstrap";
import { useCreateLoyaltyProgramMutation, useGetLoyaltyProgramsQuery, useDeactiveLoyaltyProgramMutation} from "../../../api/loyaltyApi";
import { useNavigate } from "react-router-dom";
import Datetime from "react-datetime";
import SweetAlert from "react-bootstrap-sweetalert";
import LocalStorageManager from "../../../utils/LocalStorageManager";
import { reverseDate } from "../../../variables/utils";
import pdf from "../../../assets/img/sample.pdf"
import ReactBSAlert from "react-bootstrap-sweetalert";
import LongHash from "../../../views/components/LongHash/LongHash";


const initialState = {
  campaign_end_date: "",
  campaign_start_date: "",
  expiry: "",
  geo_id: "",
  mcc: "",
  merchant_wallet_id: "",
};

const LoyaltyProgramCreatePage = () => {
  const [createLoyaltyProgram, { isLoading }] = useCreateLoyaltyProgramMutation();
  const [deactiveLoyaltyProgram, { isLoading : deactivateLoading }] = useDeactiveLoyaltyProgramMutation();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const [merchantId, setMerchantId] = useState(LocalStorageManager.getMerchantId() || "-");
  const { isLoading: loyaltyProgramLoading , data: loyaltyProgram, refetch } = useGetLoyaltyProgramsQuery({ merchantID: merchantId });
  const mcc = LocalStorageManager.getMCC() || "-";
  const geo = LocalStorageManager.getGeo() || "-";
  const WalletID = LocalStorageManager.getWalletID() || "-";
  
  const [form, setForm] = useState({
    campaign_end_date: "",
    campaign_start_date: "",
    expiry: "",
    geo_id: geo,
    mcc: mcc,
    merchant_wallet_id: WalletID,
    loyalty_reward_percentage: "",
  });

  const [disabled, setDisabled] = useState(false); 
  const navigate = useNavigate();

  // const handleChangereward = (e) => {
  //   const  value = e.target.value;
  //   setForm((prev) => ({ ...prev, "loyalty_reward_percentage": value }));
  // };

  const handleChangereward = (e) => {
    const inputValue = e.target.value;
    
    // Remove the '%' if the user somehow adds it
    const numericOnly = inputValue.replace(/[^\d]/g, "");
    
    setForm((prev) => ({
      ...prev,
      loyalty_reward_percentage: numericOnly === "" ? "" : Number(numericOnly),
    }));
  };

  useEffect(() => {
  if (!loyaltyProgramLoading) {
    const existingProgram = loyaltyProgram ? loyaltyProgram?.data : null;
    if (! existingProgram) {
      setShowAlert(true); 
    } else {
      console.log("loyaltyProgram in set", existingProgram);
      setForm({
        campaign_start_date: reverseDate(existingProgram.campaign_start_date.slice(0, 10)),
        campaign_end_date: reverseDate(existingProgram.campaign_end_date.slice(0, 10)),
        expiry: reverseDate(existingProgram.expiry.slice(0, 10)),
        geo_id: existingProgram.geo_id,
        mcc: existingProgram.mcc,
        merchant_wallet_id: existingProgram.merchant_wallet_id,
        loyalty_reward_percentage: existingProgram.loyalty_reward_percentage,
      });
      setDisabled(true);
    }
  }
  }, [loyaltyProgramLoading, loyaltyProgram, loyaltyProgram]);

  const hideAlert = () => {
    setShowAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    console.log("form", form);
    try {
      const response = await createLoyaltyProgram({form, merchantId}).unwrap();
      const loyaltyProgramID= response.data.loyalty_program_id;
      console.log("loyalty Program id", loyaltyProgramID)
      setForm(initialState);
      await refetch(); 
        
      setSuccess(
        <SweetAlert
            success
            title="Loyalty Program Created!"
            showCancel={false}
            showConfirm={false} 
        >
            id: {loyaltyProgramID}A
            {/* id: <LongHash hash={loyaltyProgramID} /> */}
            
            <div style={{ marginTop: "30px", textAlign: "center" }}>  
              <button
                onClick={() => {
                  setSuccess(null);
                  navigate("/merchant/loyalty/create"); 
                }}
                style={{ paddingBlock:15, paddingInline:48 , backgroundColor:"#5732BF", boxShadow:'0 4px 6px rgba(50, 50, 93, 0.31)', color:"#fff", border:"none", fontFamily:"Poppins", fontWeight:500, fontSize:14, borderRadius:12}}
              >
                OK
              </button>
            </div>
        </SweetAlert>
      );
    } catch (err) {
      setError(err?.data?.message || "Failed to create loyalty program");
      setError(
        <SweetAlert
             danger
             title="Loyalty Program Not Created!"
             showCancel={false}
             showConfirm={false} 
         >
             Loyalty Program creation failed.
             <div style={{ marginTop: "30px", textAlign: "center" }}>  
                <button
                  onClick={() => {
                    setError(null)
                  }}
                  style={{ paddingBlock:15, paddingInline:48 , backgroundColor:"#5732BF", boxShadow:'0 4px 6px rgba(50, 50, 93, 0.31)', color:"#fff", border:"none", fontFamily:"Poppins", fontWeight:500, fontSize:14, borderRadius:12}}
                >
                  OK
                </button>
              </div>
         </SweetAlert>
      )
    }
  };

  const handleDeactivate = async (e) => {
    e.preventDefault();
    try {
      const response= await deactiveLoyaltyProgram({ merchantId }).unwrap();
      const loyaltyProgramID= response.data.loyalty_program_id;
      setForm(initialState);

      setSuccess(
        <SweetAlert
          success
          title="Loyalty Program Deactivated!"
          showConfirm={false} 
          showCancel={false}
        >
          id: {loyaltyProgramID}
          <div style={{ marginTop: "30px", textAlign: "center" }}>  
            <button
              onClick={() => {
                setSuccess(null);
                navigate("/merchant/dashboard"); 
                window.location.reload();
              }}
              style={{ paddingBlock:15, paddingInline:48 , backgroundColor:"#5732BF", boxShadow:'0 4px 6px rgba(50, 50, 93, 0.31)', color:"#fff", border:"none", fontFamily:"Poppins", fontWeight:500, fontSize:14, borderRadius:12}}
            >
              OK
            </button>
          </div>
        </SweetAlert>
      );
      
    } catch (err) {
      setError(err?.data?.message || "Failed to deactivate loyalty program");
      setError(
        <SweetAlert
             danger
             title="Loyalty Program Not Deactivated!"
             showCancel={false}
             showConfirm={false} 
         >
             Loyalty Program deactivation failed.
             <div style={{ marginTop: "30px", textAlign: "center" }}>  
                <button
                  onClick={() => {
                    setError(null)
                  }}
                  style={{ paddingBlock:15, paddingInline:48 , backgroundColor:"#5732BF", boxShadow:'0 4px 6px rgba(50, 50, 93, 0.31)', color:"#fff", border:"none", fontFamily:"Poppins", fontWeight:500, fontSize:14, borderRadius:12}}
                >
                  OK
                </button>
              </div>
         </SweetAlert>
      )
    }
  }

  return (

    <div className="create-organization content" style={{margin:0, paddingInline:0, paddingBlock:70, height:800, overflow:'hidden', backgroundColor:"#fff"}}>
      {/* {showAlert && (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Terms & Conditions"
          onConfirm={() => {
            if (isChecked) {
              hideAlert()
            }
          }}
          onCancel={() => navigate("/merchant/dashboard")}
          showCancel={false}
          showConfirm={false} 
        >
          <div style={{ 
            marginTop: "10px", 
            marginLeft: "0px", 
            textAlign: "left", 
            display: "flex", 
            alignItems: "flex-start", 
            justifyContent: "center"
          }}>
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              style={{ marginTop: "5px" , marginLeft:'10px'}} // optional: vertically aligns checkbox with text
            />
            <label htmlFor="termsCheckbox" style={{ marginLeft: "5px", flex: 1, textAlign: 'center' }}>
              I accept the <a href={pdf} target="_blank" rel="noopener noreferrer">Terms and Conditions</a> to create a Loyalty Program.
            </label>
          </div>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            
            <button
              className="btn btn-danger"
              onClick={() => navigate("/merchant/dashboard")}
              style={{ marginLeft: "8px", paddingBlock:15, paddingInline:48 }}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={() => {
                if (isChecked) hideAlert();
              }}
              disabled={!isChecked}
              style={{ marginLeft: "30px", paddingBlock:15, paddingInline:48 }}
            >
              I Accept
            </button>
          </div>
        </ReactBSAlert>
      )} */}

      {success}
      {error}
    
      <Row>
        <Col style={{paddingRight:10}} >
          <Card style={{height:500, width: 800, boxShadow:' 0 4px 10px rgba(0, 0, 0, 0.1)', marginInline:450, display: 'flex', flexDirection: 'column', justifyContent:'center', marginBlock:50}}>
            <CardHeader style={{ marginInline: "20px", paddingTop:30 }}>
              <h4 style={{ marginBlock:2, fontSize:18}}>
                  {disabled ? "Loyalty Program" : "Create Loyalty Program"}
              </h4>
              { 
                disabled && <p style={{fontSize:12, paddingTop:5}}>
                 STATUS: <span style={{color: loyaltyProgram?.data?.status === 'active' ? '#21bb21':'#ff6a00', fontWeight:600}}>{loyaltyProgram?.data?.status === 'active' ? 'ACTIVE':'INACTIVE'}</span>
                </p>
              }
            </CardHeader>
            <CardBody style={{marginInline:"20px", marginBlock:0,paddingBottom:0}}>
              <Form onSubmit={disabled ? handleDeactivate : handleSubmit} style={{marginBottom:0, paddingBottom:0}}>
                <Row style={{marginTop: "20px"}}>
                  <Col md="6">
                    <FormGroup>
                      <Label>Program Start Date</Label>
                      <Datetime
                        timeFormat={false}
                        inputProps={{ placeholder: "Choose program start date", disabled }}
                        closeOnSelect
                        value={form.campaign_start_date}
                        required
                        disabled={disabled}
                        dateFormat="DD-MM-YYYY"
                        onChange={(e) => {
                          if (e && e.isValid && e.format) {
                            const isoString = e.set({ hour: 23, minute: 59, second: 59 }).toISOString();
                            setForm((prevState) => ({
                              ...prevState,
                              campaign_start_date: isoString,
                            }));
                          }
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Program End Date</Label>
                      <Datetime
                        timeFormat={false}
                        inputProps={{ placeholder: "Choose program end date", disabled }}
                        closeOnSelect
                        value={form.campaign_end_date}
                        required
                        disabled={disabled}
                        dateFormat="DD-MM-YYYY"
                        onChange={(e) => {
                          if (e && e.isValid && e.format) {
                            const isoString = e.set({ hour: 23, minute: 59, second: 59 }).toISOString();
                            setForm((prevState) => ({
                              ...prevState,
                              campaign_end_date: isoString,
                            }));
                          }
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                      
                <Row style={{marginTop: "10px"}}>
                  <Col md="6">
                    <FormGroup>
                      <Label>Token Expiry Date</Label>
                      <Datetime
                        timeFormat={false}
                        inputProps={{ placeholder: "Choose token expiry date", disabled }}
                        closeOnSelect
                        value={form.expiry}
                        required
                        disabled={disabled}
                        dateFormat="DD-MM-YYYY"
                        onChange={(e) => {
                          if (e && e.isValid && e.format) {
                            const isoString = e.set({ hour: 23, minute: 59, second: 59 }).toISOString();
                            setForm((prevState) => ({
                              ...prevState,
                              expiry: isoString,
                            }));
                          }
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Reward Percentage</Label>
                      <Input
                        type="text"
                        name="loyalty_reward_percentage" 
                        value={
                          form.loyalty_reward_percentage !== "" && form.loyalty_reward_percentage !== undefined
                            ? `${form.loyalty_reward_percentage}%`
                            : ""
                        }
                        onChange={handleChangereward}
                        required
                        disabled={disabled}
                        placeholder="Reward %"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                      
                <Row style={{marginTop: "0px"}}>
                  <Col md="4">
                    <FormGroup>
                      <Label>Wallet ID</Label>
                      <Input type="text" name="merchant_wallet_id" value={WalletID} disabled />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>MCC</Label>
                      <Input type="text" value={mcc} disabled />
                    </FormGroup>
                  </Col>
                  <Col md="4">
                    <FormGroup>
                      <Label>Geography</Label>
                      <Input type="text" value={geo} disabled />
                    </FormGroup>
                  </Col>
                </Row>
                { !disabled && <Row>
                  <Col md="8">
                    <div style={{ 
                      marginTop: "10px", 
                      marginLeft: "0px", 
                      textAlign: "left", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center"
                    }}>
                      <input
                        type="checkbox"
                        id="termsCheckbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                      />
                      <label htmlFor="termsCheckbox" style={{ marginLeft: "10px", flex: 1 , marginTop:7}}>
                        I accept the <a href={pdf} target="_blank" rel="noopener noreferrer" style={{color:"#5732BF"}} >Terms and Conditions</a> to create a Loyalty Program.
                      </label>
                    </div>
                  </Col>
                </Row>}
                
                {/* <Button
                  color={disabled ? "danger" : "primary"}
                  type="submit"
                  disabled={isLoading || loyaltyProgram?.data?.status === "merchant under bank approval" || (!isChecked  && !disabled)}
                  style={{
                    marginTop: disabled ? "40px":"30px",
                    backgroundColor: loyaltyProgram?.data?.status === "merchant under bank approval" ? "red" : "red",
                    cursor: loyaltyProgram?.data?.status === "merchant under bank approval" ? "not-allowed" : "pointer",
                    opacity: loyaltyProgram?.data?.status === "merchant under bank approval" || (!isChecked && !disabled) ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Creating..." : disabled ? "Deactivate Program" : "Create Program"}
                </Button> */}
                {disabled ? (
                  <Button
                    color="danger"
                    type="submit"
                    disabled={
                      deactivateLoading || loyaltyProgram?.data?.status === "merchant under bank approval"
                    }
                    style={{
                      marginTop: "40px",
                      backgroundColor: "red",
                      cursor: loyaltyProgram?.data?.status === "merchant under bank approval" ? "not-allowed" : "pointer",
                      opacity: loyaltyProgram?.data?.status === "merchant under bank approval" ? 0.6 : 1,
                    }}
                  >
                    {deactivateLoading ? "Processing..." : "Deactivate Program"}
                  </Button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !isChecked}
                    style={{
                      fontSize: 14,
                      backgroundColor: "#5732BF",
                      width: "30%",
                      border: "none",
                      color: "white",
                      paddingBlock: 10,
                      borderRadius: 7,
                      fontWeight: 600,
                      marginTop: 30,
                      cursor: !isChecked ? "not-allowed" : "pointer",
                      opacity: !isChecked ? 0.6 : 1,
                      boxShadow:'0 4px 6px rgba(50, 50, 93, 0.31)',
                      transition: "all 0.1s ease",
                      transform: isPressed ? "translateY(2px)" : "translateY(0px)",
                    }} 
                    
                    onMouseDown={() => setIsPressed(true)}
                    onMouseUp={() => setIsPressed(false)}
                    onMouseLeave={() => setIsPressed(false)} 
                    
                    onMouseOver={(e) => {
                      if(isChecked){
                        e.currentTarget.style.backgroundColor = "#4522a6"
                      }
                    }}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5732BF")}
                  >
                    {isLoading ? "Creating..." : "Create Program"}
                  </button>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoyaltyProgramCreatePage; 