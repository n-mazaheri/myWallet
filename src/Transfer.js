import React, { Component } from 'react'
import Web3 from 'web3'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'




const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/24fa80a982b142cb9407e1c976d238d1'));

class Transfer extends Component {
  

  constructor(props) {
    super(props);
    this.state={show1:false, message:""}
  }
  
sendToken(amount,recieverAddress,privateKey,gasLimit,gasPrice) {

  try {

    if(amount<this.props.balance)
    {
    var privKey = new Buffer(privateKey, 'hex');
  if(web3.utils.isAddress(recieverAddress))
  {
    
    var Tx = require('ethereumjs-tx').Transaction;

    var myAddress = this.props.accountAddress;

    var destAddress = recieverAddress;

    var transferAmount = amount;
 
    let abiArray = [
      // transfer
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_value",
                  "type": "uint256"
              }
          ],
          "name": "transfer",
          "outputs": [
              {
                  "name": "success",
                  "type": "bool"
              }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
      }
      ];
     
  
    
     web3.eth.getTransactionCount(myAddress).then((count)=>{
    
    if(this.props.symbol!="ETH")
    {
    var contractAddress = this.props.contractAddress;
    var contract = new web3.eth.Contract(abiArray,contractAddress);
    var rawTransaction = {
        "from": myAddress,
        "nonce": web3.utils.toHex(count),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        "to": contractAddress,
        "value": "0x0",
        "data": contract.methods.transfer(destAddress, transferAmount.toString()).encodeABI(),
        "chainId": 0x03,
        
    };
  }
  else{
    var rawTransaction = {
      "from": myAddress,
      "nonce": web3.utils.toHex(count),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      "to": recieverAddress,
      "value": web3.utils.toHex(transferAmount),
      "chainId": 0x03,
      
  };
  
  }
  
    
  var privKey = new Buffer(privateKey, 'hex');
    var tx = new Tx(rawTransaction,{'chain':'ropsten'});
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    this.setState({show1:true,message:"Please wait for transaction(s)"});
    
 web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
 .on('transactionHash', function(hash){

  
})
.on('receipt', function(receipt){
})
.on('confirmation',(confirmationNumber, receipt)=>{this.setState({show1:false,message:"Transaction Confirmed"}); })
.on('error',(err)=>{this.setState({show1:false,message:("Error in transaction "+err)});})

    });
 
    
  }
  else{
    this.setState({message:"The reciever address in not valid"})
  } 
}
else{
  this.setState({message:"Your balance is less than the transfer amount."})
}  
} 
catch(error)
{
  this.setState({message:error});
}
  }
  render() {
    const showing=this.state.show1;
    return (
      <Modal show={this.props.show} aria-labelledby="contained-modal-title-vcenter" onHide={() => {this.setState({show1:false,message:""});this.props.myf(false)}}>
        <Modal.Header closeButton closeLabel=""> 
          <Modal.Title id="contained-modal-title-vcenter">
            Send Token
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>
              <Col>
              <Image src={this.props.icon} width="20" height="20" roundedCircle /> 
              
              <label>{this.props.symbol}</label>
              <br/>
              </Col>
            </Row>
            <Row>
            <Col>
              <label>Balance: </label> <label >{this.props.balance}</label>
              </Col>
            </Row>

            <Row>
              <Col>
              <label htmlFor="amount">Transfer amount</label>
      <input
        type="number"
        className="form-control"
        id="amount"
        ref="amount"
      />
     </Col>
              
            </Row>

            <Row>
              <Col>
              <label htmlFor="recieverAddress">Reciever public key</label>
      <input
        type="text"
        className="form-control"
        id="recieverAddress"
        ref="recieverAddress"
        
      />
     </Col>
              
            </Row>
            <Row>
              <Col>
            <label htmlFor="privateKey">Sender private key</label>
      <input
        type="password"
        className="form-control"
        id="privateKey"
        ref="privateKey"
        
        
      />
      </Col>
      </Row>

             <Row> 
              <Col>
              <label htmlFor="gasPrice">Gas price</label>
      <input
        type="number"
        className="form-control"
        id="gasPrice"
        ref="gasPrice"
        
      />
              </Col>
              <Col>
              <label htmlFor="gasLimit">Gas limit</label>
      <input
        type="number"
        className="form-control"
        id="gasLimit"
        ref="gasLimit"
        
      />
              </Col>
              
            </Row>
            <Row>
            { showing 
                    ? <Spinner animation="border" variant="primary" />
                    
                    : null
            }
            <p className="text-danger">{this.state.message}</p>
             
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="outline-primary" className="rounded-pill" onClick={()=>{this.setState({show1:false,message:""});this.props.myf(false)}}>Close</Button>
    <Button className="rounded-pill" onClick={()=>{
      this.sendToken(this.refs.amount.value,this.refs.recieverAddress.value,this.refs.privateKey.value,this.refs.gasLimit.value,this.refs.gasPrice.value);
    
    }}>Send</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Transfer;