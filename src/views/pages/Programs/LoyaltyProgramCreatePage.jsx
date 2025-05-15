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
  const [deactiveLoyaltyProgram] = useDeactiveLoyaltyProgramMutation();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [merchantId, setMerchantId] = useState(LocalStorageManager.getMerchantId() || "-");
  const { isLoading: loyaltyProgramLoading , data: loyaltyProgram, refetch } = useGetLoyaltyProgramsQuery({ merchantID: merchantId });
  const mcc = LocalStorageManager.getMCC() || "-";
  const geo = LocalStorageManager.getGeo() || "-";
  const accountId = LocalStorageManager.getAccountId() || "-";
  
  const [form, setForm] = useState({
    campaign_end_date: "",
    campaign_start_date: "",
    expiry: "",
    geo_id: geo,
    mcc: mcc,
    merchant_wallet_id: accountId,
    loyalty_reward_percentage: "",
  });

  const [disabled, setDisabled] = useState(false); 
  const navigate = useNavigate();

  const handleChangereward = (e) => {
    const  value = e.target.value;
    setForm((prev) => ({ ...prev, "loyalty_reward_percentage":  Number(value) }));
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
      await createLoyaltyProgram({form, merchantId}).unwrap();
      setForm(initialState);
      await refetch(); 
        
      setSuccess(
        <SweetAlert
            success
            title="Loyalty Program Created!"
            onConfirm={() => {
                setSuccess(null);
                navigate("/merchant/loyalty/create"); 
            }}
        >
            Loyalty Program created successfully.
        </SweetAlert>
      );
    } catch (err) {
      setError(err?.data?.message || "Failed to create loyalty program");
      setError(
        <SweetAlert
             danger
             title="Loyalty Program Not Created!"
             onConfirm={() => setError(null)}
         >
             Loyalty Program creation failed.
         </SweetAlert>
      )
    }
  };

  const handleDeactivate = async (e) => {
    e.preventDefault();
    try {
      await deactiveLoyaltyProgram({ merchantId }).unwrap();
      setForm(initialState);

      setSuccess(
        <SweetAlert
          success
          title="Loyalty Program Deactivated!"
          onConfirm={() => {
            setSuccess(null);
            navigate("/merchant/dashboard"); 
            window.location.reload();
          }}
        >
          Loyalty Program deactivated successfully.
        </SweetAlert>
      );
      
    } catch (err) {
      setError(err?.data?.message || "Failed to deactivate loyalty program");
      setError(
        <SweetAlert
             danger
             title="Loyalty Program Not Deactivated!"
             onConfirm={() => setError(null)}
         >
             Loyalty Program deactivation failed.
         </SweetAlert>
      )
    }
  }



  return (

    <div className="create-organization content" style={{margin:0, paddingInline:10}}>
      {showAlert && (
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
      )}

      {success}
      {error}
    
      <Row>
        <Col>
          <Card style={{height:'700px'}}>
            <CardHeader style={{ marginInline: "20px", marginTop: "10px" }}>
              <h4 style={{ marginBlock:2, fontSize:18}}>
                  {disabled ? "Loyalty Program" : "Create Loyalty Program"}
              </h4>
              { 
                disabled && <p style={{fontSize:12, paddingBlock:5}}>
                 STATUS: <span style={{color: loyaltyProgram?.data?.status === 'active' ? '#21bb21':'#ff6a00', fontWeight:600}}>{loyaltyProgram?.data?.status === 'active' ? 'ACTIVE':'INACTIVE'}</span>
                </p>
              }
            </CardHeader>
            <CardBody style={{marginInline:"20px"}}>
              <Form onSubmit={disabled ? handleDeactivate : handleSubmit}>
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
                        type="number"
                        name="loyalty_reward_percentage"
                        value={form.loyalty_reward_percentage}
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
                      <Input type="text" name="merchant_wallet_id" value={accountId} disabled />
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
                
                <Button
                  color={disabled ? "danger" : "primary"}
                  type="submit"
                  disabled={isLoading || loyaltyProgram?.data?.status === "merchant under bank approval"}
                  style={{
                    marginTop: "40px",
                    backgroundColor: loyaltyProgram?.data?.status === "merchant under bank approval" ? "red" : "red",
                    cursor: loyaltyProgram?.data?.status === "merchant under bank approval" ? "not-allowed" : "pointer",
                    opacity: loyaltyProgram?.data?.status === "merchant under bank approval" ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Creating..." : disabled ? "Deactivate Program" : "Create Program"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoyaltyProgramCreatePage; 