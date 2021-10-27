import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {
  const [storageValue, setStogareValue] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);

  useEffect(()=>{
    const init = async()=>{
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const contract = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
       
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };
    init();
  },[]);
  
  useEffect(()=>{
    const load = async () => {
      await contract.methods.set(7).send({ from: accounts[0]});
      const response = await contract.methods.get().call();
      setStogareValue(response);
    };

    if(typeof(web3) !== 'undefined' && typeof(accounts) !== 'undefined' && typeof(contract) !== 'undefined') {
      load();
    }

  },[web3, accounts, contract])

  if(typeof(web3) == 'undefined'){
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show
        a stored value of 7 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 42</strong> of App.js.
      </p>
      <div>The stored value is: {storageValue}</div>
    </div>
  );
}

export default App;
