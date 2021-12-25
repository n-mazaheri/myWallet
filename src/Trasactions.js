import React, { Component } from 'react'
import Web3 from 'web3'
import axios from 'axios';
import Table from 'react-bootstrap/Table'



const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/24fa80a982b142cb9407e1c976d238d1"));

class Transactions extends Component {

componentDidUpdate(prevProps,prevStates)
{
  if(this.props.account.localeCompare(prevProps.account)!=0)
  {
  if(this.props.account!=undefined)
  {
    console.log("fgfdghdfghfh"+ this.props.account)

    this.fetchTransactions(this.props.account)
  }  
} 
}
  

  constructor(props) {
    super(props)
    this.state = {data:[]}

  }

fetchTransactions(account) {
  console.log(account)


const URL1='https://api-ropsten.etherscan.io/api?module=account&action=txlist&address='+account+'&startblock=0&endblock=99999999&sort=asc&apikey=ZE1QI5QH8ADCXEN6757VJVITGHSFNUFWDT'
 //const URL2='https://api.etherscan.io/api?module=account&action=txlist&address='+account+'&block=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=ZE1QI5QH8ADCXEN6757VJVITGHSFNUFWDT'

  //const URL = `https://api.etherscan.io/api?module=account&action=txlist&address=0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8&startblock=${startBlock}&endblock=${endBlock}&sort=asc&apikey=ZE1QI5QH8ADCXEN6757VJVITGHSFNUFWDT`
  axios.get(URL1).then((response)=>{
    console.log(response);
    this.setState({data:response.data.result});
  }); 
}

renderTableData() {
  
  return this.state.data.map((block, index) => {
    const mystyle = {
      whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    width: "10px"
    };
     return (
        <tr key={index}>
         
           <td style={mystyle}>{block.from}</td>
           <td style={mystyle}>{block.to}</td>
           <td style={mystyle}>{block.value}</td>
          
        </tr>
     )
  });
}


  render() {
    const mystyle = {
      whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    };

    return (
      <div className="container">
        <Table striped bordered hover style={mystyle}>
  <tbody>
    <tr><th style={mystyle}>from</th><th style={mystyle}>to</th><th style={mystyle}>value</th></tr>
{this.renderTableData()}

  </tbody>
</Table>

      </div>
  );
  }
}

export default Transactions;