import React, { useEffect, useState, useMemo } from "react";
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input, Button } from "reactstrap";
import {reverseDate} from "../../../variables/utils.js"
import "./adminfiles.scss"
import { useGetTransactionsQuery } from "../../../api/transactionApi";
import {QRCodeSVG} from 'qrcode.react';
import LocalStorageManager from "../../../utils/LocalStorageManager.js";

const AdminFiles = () => {

    const merchantId = LocalStorageManager.getMerchantId() || "-";
    const accountId = LocalStorageManager.getAccountId() || "-";
    const mcc = LocalStorageManager.getMCC() || "-";
    const geo = LocalStorageManager.getGeo() || "-";
    const name = LocalStorageManager.getName() || "-";

    const {isLoading, data:transactions, refetch} = useGetTransactionsQuery({ wallet_id: accountId });
    const merchant_txn_headers = ["Date", "Rule ID", "From", "To", "Amount", "Reward", "P-CBDC Amount", "R-CBDC Amount"];

    const rewardsRedeemed = useMemo(() => {
        return transactions?.transactions?.reduce((acc, txn) => {
            console.log("in red", txn.from);
            if( txn.to == accountId){
                console.log("in in", txn.from);
                return acc + (txn.p_amount || 0);
            }
            return acc;
        }, 0);
    }, [transactions]);

    console.log("redeemed rewards",rewardsRedeemed);

    // useEffect(() => { 
    //     const interval = setInterval(() => {
    //         refetch();
    //     }
    //     , 5000);
    //     return () => clearInterval(interval);
    // }
    // , [rewardsRedeemed]);

    return (
        <>
            <div className="content admin_files">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <h4 style={{marginLeft:'20px'}}>
                                    Merchant Profile
                                </h4>
                            </CardHeader>
                            <CardBody>
                                <div className="upload-section-container ">
                                  <div className="upload-left">
                                    <div className="upload-info">
                                      <h2>Total Sale</h2>
                                      <p>{transactions && transactions.total_rewards_issued + transactions.total_collection || 0}</p>
                                    </div>
                                    <div className="upload-info">
                                      <h2>Account Balance</h2>
                                      <p>{ transactions && transactions.total_collection|| 0}</p>
                                    </div>
                                  </div>
                                  <div className="upload-left">
                                    <div className="upload-info">
                                      <h2>Rewards Redeemed</h2>
                                      <p>{ rewardsRedeemed|| 0}</p>
                                    </div>
                                    <div className="upload-info">
                                      <h2>Outstanding Rewards</h2>
                                      <p>{transactions && transactions.total_rewards_issued - rewardsRedeemed || 0}</p>
                                    </div>
                                  </div>
                                  <div className="upload-center">
                                      <div className="merchant-info">
                                        <div><strong>Merchant ID:</strong> {merchantId}</div>
                                        <div><strong>Name:</strong> {name}</div>
                                        <div><strong>Wallet ID:</strong> {accountId}</div>
                                        <div><strong>MCC:</strong> {mcc}</div>
                                        <div><strong>Geo ID:</strong> {geo}</div>
                                      </div>
                                   </div>
                                  <div className="upload-right flex flex-col items-center p-2 bg-white rounded-lg shadow-md">
                                    {accountId && <QRCodeSVG value={accountId}  style={{backgroundColor: "#f8f9fa", padding:"10px", boxShadow: "20px"}}/>}
                                    <div className="text-center  qr-code-label "><strong>{accountId}</strong></div>
                                  </div>
                                  </div>
                                <br/>
                                <hr/>
                                <br/>
                                <div className="download-sections">
                                    <h4>
                                        Merchant Transactions
                                    </h4>
                                    <Table responsive className="list-table">
                                        <thead className="text-primary">
                                        <tr>
                                            {
                                                merchant_txn_headers.map((table_header, index) => (
                                                    <th key={index} className="text-left">{table_header}</th>))
                                            }
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            ( !transactions || !transactions.transactions || transactions.transactions.length === 0 ) && (
                                                <tr>
                                                    <td colSpan={7} className="text-center">No Records Found</td>
                                                </tr>
                                            )
                                        }
                                        {
                                            transactions && transactions.transactions &&
                                            transactions.transactions.length > 0 &&
                                            transactions.transactions.map((transaction, index) => (
                                                transaction.to === accountId &&
                                                <tr key={index}>
                                                    <td className="text-left">
                                                        {reverseDate(transaction.tx_date.slice(0,10))}
                                                    </td>
                                                    <td className="text-left">
                                                        {transaction.rule_id || "-"}
                                                    </td>
                                                    <td className="text-left">
                                                        {transaction.from}
                                                    </td>
                                                    <td className="text-left">
                                                        {transaction.to}
                                                    </td>
                                                    <td className="text-left">
                                                        {transaction.tx_amount}
                                                    </td>
                                                    <td className="text-left">
                                                        {transaction.reward_amount}
                                                    </td>
                                                    <td className="text-left">
                                                        {transaction.p_amount}
                                                    </td>
                                                    <td className="text-left">
                                                        {transaction.r_amount}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default AdminFiles;