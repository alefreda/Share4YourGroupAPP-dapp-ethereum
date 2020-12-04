import React, { Component } from 'react';
//identicon per immagine account
import Identicon from 'identicon.js';


class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-primary p-0 text-monospace">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://www.unibo.it/it/didattica/insegnamenti/insegnamento/2020/448362"
          target="_blank"
          rel="noopener noreferrer"
        >
          Progetto Blockchain
        </a>
        <ul className="navbar-nav px-3">
          <li>
            {/* 
              mostro id dell'account              
              <a target="_blank"
                 alt=""
                 className="text-white"
                 rel="noopener noreferrer"
                 href={"https://etherscan.io/address/" + this.props.account}>
                {this.props.account}
              </a>
            */}  
            <small id="nomeAccount">
            <a target="_blank"
                 alt=""
                 className="text-white"
                 rel="noopener noreferrer"
                 href={"https://etherscan.io/address/" + this.props.account}>
                {this.props.account}
      
              </a>
            </small>
            { this.props.account
            //se trova account crea Identicon 
              ? <img
                  alt=""
                  className='ml-2'
                  width='50'
                  height='50'
                  //creo immagine account con Identicon
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                />
            //altrimenti niente
              : <span></span>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;