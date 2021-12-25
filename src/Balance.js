import React, { Component } from 'react'
import Web3 from 'web3'
import Table from 'react-bootstrap/Table'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Transactions from './Trasactions.js'
import Transfer from './Transfer.js'

//import data from "tokens.json";


const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/24fa80a982b142cb9407e1c976d238d1'));
class Balance extends Component {
  
  
  constructor(props) {
    super(props)
    this.callBackTransfer = this.callBackTransfer.bind(this)
    this.state = {accounts:[],
    tokens: [],show:false,show2:false,show3:false,errorMessage:"",errorMessage2:"",activeToken:"0"};
let tokens=JSON.parse(window.localStorage.getItem('tokens'));
if(tokens==null)
window.localStorage.setItem('tokens', JSON.stringify([{'symbol':'ETH','icon':'eth.webp','address':'','balance':''}]));

}


componentDidMount()
{
  
  let newTokens1=JSON.parse(window.localStorage.getItem('tokens'))
  let newAccounts=JSON.parse(window.localStorage.getItem('accounts'))
  if(newAccounts==null)
  newAccounts=[];
 this.setState({tokens:newTokens1,accounts:newAccounts},()=>{
  this.getAccountBalance();
 } );
  
  
}
  callBackTransfer(state)
  {
    this.setState({show3:state});
  }

  renderTableData() {
    
    return this.state.tokens.map((token, index) => {
       const { symbol,icon,address,balance } = token //destructuring
       return (
          <tr key={index}>
           
             <td>{symbol}</td>
             <td><Image src={icon} width="20" height="20" roundedCircle /></td>
             <td>{balance}</td>
             <td className='opration'>
            <Button variant="outline-primary" onClick={() => this.removeToken(index)}>Delete</Button>
            </td>
            <td className='opration'>
            <Button variant="outline-primary" onClick={() => {this.setState({show3:true,activeToken:index})}}>Transfer</Button>
            </td>
          </tr>
       )
    });
 }

 renderAccounts()
 {
  return this.state.accounts.map((account, index) => {
    return (
      <option>{account}</option>
    )
 });

 }
 removeToken(index)
 {
   
   let newTokens=this.state.tokens;
   newTokens.splice(index,1);
   this.setState({tokens:newTokens});
   window.localStorage.setItem('tokens', JSON.stringify(newTokens));
   
 }

 getAccountBalance()
 {
   var activeaccount=this.refs.selectAccount.value
   if(activeaccount!=""){
    this.setState({errorMessage2:""});
    const promises = [];
     
    let newtokens=this.state.tokens.slice();
    newtokens.map((token, index) => {
      if(index==0)
      {
        promises.push(web3.eth.getBalance(activeaccount));  
    
  }
  
  else
    {
      
      let tokenAddress = token.address;
      let walletAddress = activeaccount;
  
  // The minimum ABI to get ERC20 Token balance
  let minABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "type": "function"
    }
  ];
  
  let contract = new web3.eth.Contract(minABI,tokenAddress);
  
    promises.push(contract.methods.balanceOf(walletAddress).call());
    }
  
  });
  Promise.all(promises)
  .then((balances)=>{newtokens.map((token, index) => {token.balance=balances[index]});this.setState({tokens:newtokens});}).catch((err)=>{this.setState({errorMessage2:"there is an error:"+err})});
   
   }

  }

checkAndAddToken(newSymbol,newContract)
{
  if(web3.utils.isAddress(newContract))
  { 
    this.setState({show:false})
    this.addToken(newSymbol,newContract);
    this.setState({errorMessage:""})
   
  }
  else{
    this.setState({errorMessage:"This is not a correct address"})

  }
}
checkAndAddAccount(newAccount)
{
  if(web3.utils.isAddress(newAccount))
  { 
    this.setState({show2:false})
    this.addAccount(newAccount);
    this.setState({errorMessage:""})
   
  }
  else{
    this.setState({errorMessage:"This is not a correct address"})

  }
}

addAccount(newAccount)
{
  let newAccounts=this.state.accounts;
  newAccounts.push(newAccount);
  this.setState({accounts:newAccounts},()=>{window.localStorage.setItem("accounts",JSON.stringify(newAccounts));
  this.getAccountBalance();});
  


}

addToken(newSymbol,newContract)
 {
   
    let newToken=this.state.tokens;
    newToken.push({symbol:newSymbol,icon:"",address:newContract,balance:""})
    this.setState({tokens:newToken});
    
    window.localStorage.setItem('tokens', JSON.stringify(newToken));
    this.getAccountBalance();
 }



  render() {
    const showing=this.state.show3;
    return (
      <div className="container">
        
        <Form.Label>Select Acount</Form.Label>
       
      <Form.Control as="select" ref="selectAccount" onChange={(event)=>{this.getAccountBalance();}}>
      {this.renderAccounts()}
      </Form.Control>
<br/><br/>
       <Table striped bordered hover>
  <tbody>
    <tr><th>Symbol</th><th>Icon</th><th>Balance</th><th>Delete</th><th>Transfer</th></tr>
    
{this.renderTableData()}

  </tbody>
</Table>
<p className="text-danger">{this.state.errorMessage2}</p>
<br/>
<br/>

<Button variant="outline-primary" className="rounded-pill" onClick={() => this.setState({show:true})}>Add token</Button>{' '}
<Button variant="outline-primary" className="rounded-pill" onClick={() => this.setState({show2:true})}>Add account</Button>{' '}
{ showing 
                    ? <Transfer show={this.state.show3} myf={this.callBackTransfer} accountAddress={this.refs.selectAccount?.value} 
                    contractAddress={this.state.tokens[this.state.activeToken].address} balance={this.state.tokens[this.state.activeToken].balance} 
                    symbol={this.state.tokens[this.state.activeToken].symbol} icon={this.state.tokens[this.state.activeToken].icon} />
                    
                    
                    : null
}

<Modal show={this.state.show} onHide={() => {this.setState({show:false, errorMessage:""});}}>
  <Modal.Header closeButton closeLabel="">
    <Modal.Title>Add Token</Modal.Title>
  </Modal.Header>

  <Modal.Body>
  <div className="form-group">
      <label htmlFor="newSymbol">Symbol</label>
      <input
        type="text"
        className="form-control"
        id="newSymbol"
        ref="newSymbol"
      />
      <label htmlFor="newContract">Contract Address</label>
      <input
        type="text"
        className="form-control"
        id="newContract"
        ref="newContract"
        onChange={()=>{this.setState({errorMessage:""})}}
      />
    <p className="text-danger">{this.state.errorMessage}</p>
    </div>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="outline-primary" className="rounded-pill" onClick={()=>this.setState({show:false,errorMessage:""})}>Close</Button>
    <Button variant="outline-primary" className="rounded-pill" onClick={()=>{this.checkAndAddToken(this.refs.newSymbol.value,this.refs.newContract.value);}}>Save changes</Button>
  </Modal.Footer>
</Modal>


<Modal show={this.state.show2} onHide={() => {this.setState({show2:false, errorMessage:""})}}>
  <Modal.Header closeButton closeLabel="">
    <Modal.Title>Add Account</Modal.Title>
  </Modal.Header>

  <Modal.Body>
  <div className="form-group">
      <label htmlFor="newAccount">Account Address</label>
      <input
        type="text"
        className="form-control"
        id="newAccount"
        ref="newAccount"
      />
    <p className="text-danger">{this.state.errorMessage}</p>
    </div>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="outline-primary" className="rounded-pill" onClick={()=>this.setState({show2:false,errorMessage:""})}>Close</Button>
    <Button variant="outline-primary" className="rounded-pill" onClick={()=>{this.checkAndAddAccount(this.refs.newAccount.value);}}>Save changes</Button>
  </Modal.Footer>
</Modal>
<br/>
<br/>
<h2>The list of trasaction of selected account:</h2>
<br/>
<br/>
{ this.refs.selectAccount!=null 
                    ? <Transactions account={this.refs.selectAccount?.value}/>

                    : null
}


      </div>
  );
  }
}

export default Balance;