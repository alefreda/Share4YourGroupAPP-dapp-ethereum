import Share4YourGroupAPP from '../abis/Share4YourGroupAPP.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
//import loading from './loading'
// import Footer from './Footer'
import Web3 from 'web3';
import './App.css';


//ipfs
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

class App extends Component {

 
  async componentWillMount() {
    //verifico se metamask sia installato 
    //const metamaskIstalled = typeof window.web3 !=='undefined'
    //connette l'app alla blockchain
    await this.loadWeb3()
    await this.connessioneBlockchain()
  }

  //web3 
  async loadWeb3() {
    //verifico che esiste un browser ethereum o metamask


    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      console.log(window.web3)
      await window.ethereum.enable()
    }

    else if (window.web3) {

      window.web3 = new Web3(window.web3.currentProvider)
      console.log(window.web3)
    }
    else {
      window.alert('Error, scarica Metamask')
    }
  }


  async connessioneBlockchain() {
    //connessione web3
    const web3 = window.web3

    // carico l'account con web3, setto la variabile accounts -> è un array
    const accounts = await web3.eth.getAccounts()
    //setto lo stato con l'account
    this.setState({ account: accounts[0] })
    // Network id (ganache -> 5777)
    const networkId = await web3.eth.net.getId()
    // setto network data con il network che truffle memorizza nel json in abis
    const networkData = Share4YourGroupAPP.networks[networkId] 
  
    if(networkData) {
      // Assign contract
      //abi è il json che descrive lo smart contract, adress è l'adress del network che si trova nel file abis
      //creo un web3 contract che prende come parametri i due 
      //istanzio oggetto contratto app
      const contrattoApplicazione = new web3.eth.Contract(Share4YourGroupAPP.abi, networkData.address)
      //memorizzo nello state il contratto
      this.setState({ contrattoApplicazione })
      // file count
      const numero_file = await contrattoApplicazione.methods.numero_file().call()

      // carica i file dal più recente
      for (var i = numero_file; i >= 1; i--) {
        const file = await contrattoApplicazione.methods.files(i).call()
        this.setState({
          listaDocumenti: [...this.state.listaDocumenti, file]
        })
      }
    } else {
      window.alert('Errore nel deploy del contratto')
    }
  }

  // get del doc
  getDocumento = event => {
    event.preventDefault()
    //get doc
    const file = event.target.files[0]
    //reader del doc
    const reader = new window.FileReader()
    //converto in buffer
    //da fixare
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
    }
  }

  caricaDocumento = description => {
    console.log("Sto caricando su IPFS...")

    // Add documento su IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      //console.log('IPFS result', result.size)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })
      // assegno valore per file senza estensione
      if(this.state.type === ''){
        this.setState({type: 'none'})
      }
      //carica su blockchain
      //result - > callback di ipfs 
      this.state.contrattoApplicazione.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error, documento già presente sulla blockchain!')
        this.setState({loading: false})
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      //istanza contratto web3
      contrattoApplicazione: null,
      //array di file
      listaDocumenti: [],
      //per check metamask
      loading: false,
      type: null,
      name: null
    }
    this.caricaDocumento = this.caricaDocumento.bind(this)
    this.getDocumento = this.getDocumento.bind(this)
  }


  //render
  render() {
    return (
      <div>
        
        <Navbar account={this.state.account} />
        { this.state.loading
      
         //
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              listaDoc={this.state.listaDocumenti}
              docProcessato={this.getDocumento}
              caricaDoc={this.caricaDocumento}
            />
        }
        {/* <Footer/> */}
      </div>
    );
  }
}

export default App;