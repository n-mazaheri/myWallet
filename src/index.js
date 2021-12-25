import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Balance from './Balance';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

ReactDOM.render(
  <React.StrictMode>
    <Tabs defaultActiveKey="balance" id="wallet">
  <Tab eventKey="balance" title="Show Balance">
    <Balance />
  </Tab>

</Tabs>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
