import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Row, Col, Alert } from "reactstrap";
import { useCreateLoyaltyProgramMutation, useGetLoyaltyProgramsQuery, useDeactiveLoyaltyProgramMutation} from "../../../api/loyaltyApi";
import { useNavigate } from "react-router-dom";
import Datetime from "react-datetime";
import SweetAlert from "react-bootstrap-sweetalert";
import LocalStorageManager from "../../../utils/LocalStorageManager";
import { reverseDate } from "../../../variables/utils";

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
            title="Campaign Created!"
            onConfirm={() => {
                setSuccess(null);
                navigate("/merchant/dashboard"); 
            }}
        >
            Campaign created successfully.
        </SweetAlert>
      );
    } catch (err) {
      setError(err?.data?.message || "Failed to create loyalty program");
      setError(
        <SweetAlert
             danger
             title="Campaign Not Created!"
             onConfirm={() => setError(null)}
         >
             Campaign creation failed.
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
          title="Campaign Deactivated!"
          onConfirm={() => {
            setSuccess(null);
            navigate("/merchant/dashboard"); 
            window.location.reload();
          }}
        >
          Campaign deactivated successfully.
        </SweetAlert>
      );

      
    } catch (err) {
      setError(err?.data?.message || "Failed to deactivate loyalty program");
      setError(
        <SweetAlert
             danger
             title="Campaign Not Deactivated!"
             onConfirm={() => setError(null)}
         >
             Campaign deactivation failed.
         </SweetAlert>
      )
    }
  }



  return (

    <div className="create-organization content">
      {showAlert && (
        <SweetAlert
          title="Terms & Conditions"
          type="warning"
          onConfirm={() => setShowAlert(false)}
          onCancel={() => navigate("/merchant/dashboard")}
          confirmBtnBsStyle="primary"
          cancelBtnBsStyle="danger"
          confirmBtnText="I Accept"
          cancelBtnText="Cancel"
          showCancel
          closeOnClickOutside={false}
        >
          You must accept the Terms and Conditions to create a Loyalty Program.
        </SweetAlert>
      )}

      {success && <Alert color="success">{success}</Alert>}
      {error && <Alert color="danger">{error}</Alert>}
    
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle tag="h4">{disabled ? "" : "Create"} Loyalty Program</CardTitle>
            </CardHeader>
            <CardBody>
              <Form onSubmit={disabled ? handleDeactivate : handleSubmit}>
                <Row style={{marginTop: "20px"}}>
                  <Col md="6">
                    <FormGroup>
                      <Label>Campaign Start Date</Label>
                      <Datetime
                        timeFormat={false}
                        inputProps={{ placeholder: "Choose campaign start date", disabled }}
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
                      <Label>Campaign End Date</Label>
                      <Datetime
                        timeFormat={false}
                        inputProps={{ placeholder: "Choose campaign end date", disabled }}
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
                      <Label>Campaign Expiry Date</Label>
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
                      <Label>Merchant Wallet ID</Label>
                      <Input type="text" name="merchant_wallet_id" value={accountId} disabled />
                    </FormGroup>
                  </Col>
                </Row>
                      
                <Row style={{marginTop: "0px"}}>
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
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Mcc</Label>
                      <Input type="text" value={mcc} disabled />
                    </FormGroup>
                  </Col>
                </Row>
                      
                <Row style={{marginTop: "0px"}}>
                  <Col md="6">
                    <FormGroup>
                      <Label>Geo_id Value</Label>
                      <Input type="text" value={geo} disabled />
                    </FormGroup>
                  </Col>
                      
                  {disabled && (
                    <Col md="6">
                      <FormGroup>
                        <Label>Status</Label>
                        <Input
                          type="text"
                          value={loyaltyProgram?.data?.status || "INACTIVE"}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  )}
                </Row>
                
                <Button
                  color="primary"
                  type="submit"
                  disabled={isLoading || loyaltyProgram?.data?.status === "merchant under bank approval"}
                  style={{
                    marginTop: "40px",
                    // marginLeft: "1200px",
                    marginBottom: "130px",
                    backgroundColor: loyaltyProgram?.data?.status === "merchant under bank approval" ? "#ccc" : undefined,
                    cursor: loyaltyProgram?.data?.status === "merchant under bank approval" ? "not-allowed" : "pointer",
                    opacity: loyaltyProgram?.data?.status === "merchant under bank approval" ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Creating..." : disabled ? "Deactivate" : "Create Program"}
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