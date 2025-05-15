import React, { useMemo, useState, useEffect } from "react";
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input, Button, Alert} from "reactstrap";
import { Link } from "react-router-dom";
import "./adminfiles.scss"
import SweetAlert from "react-bootstrap-sweetalert";
import { useGetTransactionsQuery } from "../../../api/transactionApi";
import {QRCodeSVG} from 'qrcode.react';
import LocalStorageManager from "../../../utils/LocalStorageManager.js";
import PendingPopup from "../../../views/components/PendingPopup.js"

const AdminFiles = () => {

    const merchantId = LocalStorageManager.getMerchantId() || "-";
    const accountId = LocalStorageManager.getAccountId() || "-";
    const mcc = LocalStorageManager.getMCC() || "-";
    const geo = LocalStorageManager.getGeo() || "-";
    const name = LocalStorageManager.getName() || "-";
    const [register, setRegistered]= useState(localStorage.getItem("registered") || '');

    const [showAlert, setShowAlert]= useState(false);

    const {isLoading, data:transactions, refetch} = useGetTransactionsQuery({ wallet_id: accountId });

    const rewardsRedeemed = useMemo(() => {
        return transactions?.transactions?.reduce((acc, txn) => {
            console.log("in red", txn.from);
            if( txn.to == accountId){
                return acc + (txn.p_amount || 0);
            }
            return acc;
        }, 0);
    }, [transactions]);

    

    function toHumanReadable(isoString){
      const date = new Date(isoString);

      const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
      };

      const parts = new Intl.DateTimeFormat('en-IN', options).formatToParts(date);
      const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));

      return `${partMap.day} ${partMap.month} ${partMap.year}, ${partMap.hour}:${partMap.minute} ${partMap.dayPeriod}`;
    }

    useEffect(() => { 
      if(register === 'true'){
        console.log("registered", register);
        setShowAlert(true);
      }
      const interval = setInterval(() => {
          refetch();
      }, 200000);
      return () => clearInterval(interval);
    }
    , [rewardsRedeemed]);

    return (
        <>
          <div className="content admin_files" >
            { setShowAlert && <PendingPopup show={showAlert} onConfirm={() => {
              setShowAlert(false);
              localStorage.setItem("registered", 'false');
              setRegistered(false);
            }} />}
              <Row>
                  <Col xs="12">
                      <Card style={{height:'680px'}}>
                        <CardHeader>
                            <h4 style={{marginLeft:20, marginTop:20}}>
                                Merchant Summary
                            </h4>
                        </CardHeader>
                        <CardBody style={{marginInline: 20}} >
                          <Row className="mb-4 kpi-row" >
                            <Col md="3">
                              <div className="upload-info">
                                <h2>Total Sales</h2>
                                <p>{transactions && (transactions.total_rewards_issued + transactions.total_collection) || 0}</p>
                              </div>
                            </Col>
                            <Col md="3">
                              <div className="upload-info">
                                <h2>Account Balance</h2>
                                <p>{transactions && transactions.total_collection || 0}</p>
                              </div>
                            </Col>
                            <Col md="3">
                              <div className="upload-info">
                                <h2>Rewards Redeemed</h2>
                                <p>{rewardsRedeemed || 0}</p>
                              </div>
                            </Col>
                            <Col md="3">
                              <div className="upload-info">
                                <h2>Outstanding Rewards</h2>
                                <p>{transactions && (transactions.total_rewards_issued - rewardsRedeemed) || 0}</p>
                              </div>
                            </Col>
                          </Row>
                          <Row style={{marginBlock:50}}>
                            <Col md="6">
                                <h4 className="mb-3">Merchant Profile</h4>
                                <div className="merchant-profile-box d-flex justify-content-between align-items-center" style={{marginBlock:30}}>
                                  <div className="merchant-details">
                                    <div><strong style={{display:'inline-block', width: 110}}>Merchant ID:</strong> {merchantId}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>Name:</strong> {name}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>Wallet ID:</strong> {accountId}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>MCC:</strong> {mcc}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>Geo ID:</strong> {geo}</div>
                                  </div>
                                  <div className="qr-code">
                                    {accountId && <QRCodeSVG value={accountId} />}
                                    <div className="text-center mt-2"><strong>{accountId}</strong></div>
                                  </div>
                                </div>
                            </Col>
                            <Col md="6">
                              <h4 className="mb-3" >Recent Transactions</h4>
                              <Link to="/merchant/transactions" style={{position:'absolute', right:30, top:5, fontWeight:700 }}>See All</Link>
                              <div className="transaction-box" style={{marginTop:30}}>
                                <Table responsive className="list-table">
                                  <thead className="text-primary">
                                    <tr>
                                      <th className="text-left">Timestamp</th>
                                      <th className="text-left">Sender</th>
                                      <th className="text-left">Tx Amount</th>
                                      <th className="text-left">Points Issued</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      (!transactions || !transactions.transactions || transactions.transactions.length === 0) && (
                                        <tr>
                                          <td colSpan={4} className="text-center">No Records Found</td>
                                        </tr>
                                      )
                                    }
                                    {
                                      transactions && transactions.transactions &&
                                      transactions.transactions.length > 0 &&
                                      transactions.transactions.map((txn, index) => (
                                        txn.to === accountId && index < 10 &&  (
                                          <tr key={index}>
                                            <td className="text-left">{toHumanReadable(txn.tx_date) || "-"}</td>
                                            <td className="text-left">{txn.from || "-"}</td>
                                            <td className="text-left">₹{txn.tx_amount || "-"}</td>
                                            <td className="text-left">{txn.reward_amount || "-"}</td>
                                          </tr>
                                        )
                                      ))
                                    }
                                  </tbody>
                                </Table>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                  </Col>
              </Row>
          </div>
        </>
    )
}

export default AdminFiles;