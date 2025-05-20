import React, { useMemo, useState, useEffect } from "react";
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input, Button, Alert} from "reactstrap";
import { Link } from "react-router-dom";
import "./adminfiles.scss"
import SweetAlert from "react-bootstrap-sweetalert";
import { useGetTransactionsQuery } from "../../../api/transactionApi";
import { useGetMerchantsQuery } from "../../../api/merchantApi.js";
import {QRCodeSVG} from 'qrcode.react';
import LocalStorageManager from "../../../utils/LocalStorageManager.js";
import PendingPopup from "../../../views/components/PendingPopup.js"
import Icons from "../../components/Icons.js";

const AdminFiles = () => {

    const merchantId = LocalStorageManager.getMerchantId() || "-";
    const accountId = LocalStorageManager.getAccountId() || "-";
    const mcc = LocalStorageManager.getMCC() || "-";
    const geo = LocalStorageManager.getGeo() || "-";
    const name = LocalStorageManager.getName() || "-";
    const WalletID = LocalStorageManager.getWalletID() || "-";
    const [register, setRegistered]= useState(localStorage.getItem("registered") || '');
    const [status, setStatus] = useState("")

    const [showAlert, setShowAlert]= useState(false);

    const {isLoading, data:transactions, refetch} = useGetTransactionsQuery({ wallet_id: WalletID });
    const { data: merchantInfo } = useGetMerchantsQuery({ merchantID :merchantId})

    const rewardsRedeemed = useMemo(() => {
        return transactions?.transactions?.reduce((acc, txn) => {
            if( txn.to == WalletID){
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

      if(merchantInfo){
        setStatus( merchantInfo &&  merchantInfo.data && merchantInfo?.data.length >= 1 && merchantInfo?.data[0]?.status);
      }

      const interval = setInterval(() => {
          refetch();
      }, 2000);
      return () => clearInterval(interval);
    }
    , [rewardsRedeemed, merchantInfo]);

    return (
        <>
          <div className="content admin_files" style={{margin:0, height:803, backgroundColor:"#fff", paddingInline:0, paddingTop:70, paddingBottom:0, overflow:'hidden'}} >
            { setShowAlert && 
              <PendingPopup show={showAlert} onConfirm={() => {
                setShowAlert(false);
                localStorage.setItem("registered", 'false');
                setRegistered(false);
                }}
              />
            }
              <Row style={{marginInline:100}}>
                  <Col xs="12"   >
                      <Card>
                        <CardHeader>
                            <h4 style={{marginLeft:20, marginTop:20}}>
                                Merchant Summary
                            </h4>
                        </CardHeader>
                        <CardBody style={{marginInline: 20}} >
                          <Row className="mb-4 kpi-row" >
                            <Col md="3">
                              <div className="upload-info">
                                <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', gap:20}}>
                                  <span>
                                    <img width="30" height="30" src="https://img.icons8.com/ios/50/5732BF/receive-cash.png" alt="receive-cash"/>
                                  </span>
                                  <h2>Total Sales</h2>
                                </div>
                                <p>₹{transactions && (transactions.total_rewards_issued + transactions.total_collection) || 0}</p>
                              </div>
                            </Col>
                            <Col md="3">
                              <div className="upload-info">
                                <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', gap:20}}>
                                  <span>
                                    <img width="30" height="30" src="https://img.icons8.com/dotty/80/5732BF/wallet.png" alt="wallet"/>
                                  </span>
                                <h2>Account Balance</h2>
                                </div>
                                <p>₹{transactions && transactions.total_collection || 0}</p>
                              </div>
                            </Col>
                            <Col md="3">
                              <div className="upload-info">
                                <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', gap:20}}>
                                  <span>
                                    <img width="30" height="30" src="https://img.icons8.com/external-icons-smashing-stocks/68/5732BF/external-Cashback-stock-market-icons-smashing-stocks.png" alt="external-Cashback-stock-market-icons-smashing-stocks"/>
                                  </span>
                                <h2>Rewards Redeemed</h2>
                                </div>
                                <p>{rewardsRedeemed || 0}</p>
                              </div>
                            </Col>
                            <Col md="3">
                              <div className="upload-info">
                                <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center', gap:20}}>
                                  <span>
                                    <img width="30" height="30" src="https://img.icons8.com/ios/50/5732BF/time-machine--v1.png" alt="time-machine--v1"/>
                                  </span>
                                <h2>Outstanding Rewards</h2>
                                </div>
                                <p>{transactions && (transactions.total_rewards_issued - rewardsRedeemed) || 0}</p>
                              </div>
                            </Col>
                          </Row>
                          <Row style={{marginBlock:50}}>
                            <Col md="6">
                                <h4 className="mb-3">Merchant Profile</h4>
                                <div className="merchant-profile-box d-flex justify-content-between align-items-center" style={{marginBlock:30}}>
                                  <div className="merchant-details">
                                    <div><strong style={{display:'inline-block', width: 110}}>Name:</strong> {name}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>MCC:</strong> {mcc}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>Wallet ID:</strong> {WalletID}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>Geography:</strong> {geo}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>Merchant ID:</strong> {merchantId}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>Account No:</strong> {accountId}</div>
                                    <div><strong style={{display:'inline-block', width: 110}}>Status:</strong> <span style={{paddingInline:5, paddingBlock:2, backgroundColor: status === "org_active" ? '#21bb21':'#ff6a00' , borderRadius:8, color:'#fff'}}>{status === "org_active" ? "ACTIVE":"INACTIVE"}</span></div>
                                  </div>
                                  <div className="qr-code">
                                    {WalletID && <QRCodeSVG value={WalletID} />}
                                    <div className="text-center mt-2"><strong>{WalletID}</strong></div>
                                  </div>
                                </div>
                            </Col>
                            <Col md="6">
                              <h4 className="mb-3" >Recent Transactions</h4>
                              <Link to="/merchant/transactions" style={{position:'absolute', right:30, top:5, fontWeight:600, color:"#5732BF" }}>See All</Link>
                              <div className="transaction-box" style={{marginTop:30}}>
                                <Table className="list-table" style={{overflow:'hidden'}}>
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
                                      transactions.transactions.filter(txn => txn.to === WalletID)
                                        .slice(0, 5)
                                        .map((txn, index) => (
                                          <tr key={index}>
                                            <td className="text-left">{toHumanReadable(txn.tx_date) || "-"}</td>
                                            <td className="text-left">{txn.from || "-"}</td>
                                            <td className="text-left">₹{txn.tx_amount || "-"}</td>
                                            <td className="text-left">{txn.reward_amount || "0"}</td>
                                          </tr>
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