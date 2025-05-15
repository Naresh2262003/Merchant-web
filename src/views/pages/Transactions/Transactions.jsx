import {Row, Col, Card, CardHeader, CardTitle, CardBody, Table, FormGroup, Input, Button } from "reactstrap";
import { useGetTransactionsQuery } from "../../../api/transactionApi";
import LocalStorageManager from "../../../utils/LocalStorageManager.js";
import LongHash from "../../../views/components/LongHash/LongHash";

const Transactions = () => {

    const accountId = LocalStorageManager.getAccountId() || "-";
    const {isLoading, data:transactions, refetch} = useGetTransactionsQuery({ wallet_id: accountId });
    const merchant_txn_headers = [,"Timestamp", "Transaction ID","Rule ID", "Sender", "Tx Amount", "Points Isssued", "Points Redeemed", "R-CBDC Amount"];

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

    // useEffect(() => { 
    //     const interval = setInterval(() => {
    //         refetch();
    //     }
    //     , 2000);
    //     return () => clearInterval(interval);
    // }
    // , [transactions]);

    return (
        <>
            <div className="content transaction_list">
                <Row>
                    <Col xs="12">
                        <Card>
                            <CardHeader>
                                <h4 style={{marginInline:20, marginTop:10}}>
                                    All Transactions
                                </h4>
                            </CardHeader>
                            <CardBody style={{marginLeft:20, marginTop:20}}>
                                <Table responsive className="list-table">
                                    <thead className="text-primary">
                                      {/* Main Header Row */}
                                      <tr>
                                        <th rowSpan="2" className="text-left">Timestamp</th>
                                        <th rowSpan="2" className="text-left">Transaction ID</th>
                                        <th rowSpan="2" className="text-left">Rule ID</th>
                                        <th rowSpan="2" className="text-left">Sender</th>
                                        <th rowSpan="2" className="text-left">Points Issued</th>
                                        <th className="text-left">Tx Amount</th>
                                        <th className="text-left">Points Redeemed</th>
                                        <th className="text-left">R-CBDC Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {
                                        (!transactions || !transactions.transactions || transactions.transactions.length === 0) && (
                                          <tr>
                                            <td colSpan={8} className="text-center">No Records Found</td>
                                          </tr>
                                        )
                                      }
                                      {
                                        transactions?.transactions?.length > 0 &&
                                        transactions.transactions.map((transaction, index) => (
                                          transaction.to === accountId && (
                                            <tr key={index}>
                                              <td className="text-left">{toHumanReadable(transaction.tx_date)}</td>
                                              <td className="text-left">
                                                <LongHash hash={transaction.tx_id} />
                                              </td>
                                              <td className="text-left">
                                                <LongHash hash={transaction.rule_id} />
                                              </td>
                                              <td className="text-left">{transaction.from}</td>
                                              <td className="text-left">{transaction.reward_amount}</td>
                                              <td className="text-left">₹{transaction.tx_amount}</td>
                                              <td className="text-left">{transaction.p_amount}</td>
                                              <td className="text-left">₹{transaction.r_amount}</td>
                                            </tr>
                                          )
                                        ))
                                      }
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Transactions;