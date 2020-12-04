import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'

//contenuto della pagina upload file e tabella 
class Main extends Component {

  render() {
    return (
      <div id="main1">

        <div class="container">

          <div class="container-fluid">

            <div class="jumbotron">
              <h1 class="display-4" id="title">Benvenuto su Share4YourGroup </h1>
              <p class="lead">Condividi documenti e file in modo decentralizzando, questi verranno caricati su IPFS e una blockchain basata su ethereum ne definirà la loro autenticità.</p>
              <p>Ricorda: se condividerai l'hash, il file sarà accessibile a chiunque!</p>
              <p class="lead">

              </p>
            </div>

          </div>





          
            <div className="row">
              <main role="main" className="col-lg-12 ml-auto mr-auto" >
                <div className="content">
                  <p>&nbsp;</p>


                  <div class="form-bg">
                    <div class="container">
                      <div class="row justify-content-center">
                        <div class="col-md-offset-4 col-md-4 col-sm-offset-3 col-sm-6">

                        
                          <form class="form-horizontal" onSubmit={(event) => {
                            event.preventDefault()
                            const description = this.fileDescription.value
                            this.props.caricaDoc(description)
                          }} >
                            <div class="row justify-content-center">
                            <div class="form-icon"><i class="fa fa-key"></i></div>
                            <div class="heading">Condividi il file</div>
                            <span class="sub-heading">Scegli il file da condividere</span>




                            <div className="form-group">
                              <br></br>
                              <input
                                id="fileDescription"
                                type="text"
                                ref={(input) => { this.fileDescription = input }}
                                className="form-control text-monospace"
                                placeholder="inserisci descrizione"
                                required />
                            </div>
                            <input type="file" onChange={this.props.docProcessato} className="text-black text-monospace" />
                            <button type="submit" class="btn btn-default"><b>UPLOAD</b></button>


                            </div>

                          </form>
  

                        </div>
                      </div>
                    </div>
                  </div>

                  <p>&nbsp;</p>



                  <table class="table table-bordered">
                    <thead >
                      <tr >
                        <th scope="col" >id</th>
                        <th scope="col" >Data</th>
                        <th scope="col" >Nome del file/doc</th>
                        <th scope="col" >Descrizione</th>
                        <th scope="col">Tipo</th>
                        <th scope="col" >Dimensione</th>

                        <th scope="col" >Uploader</th>
                        <th scope="col" >Condividi</th>
                      </tr>
                    </thead>
                    {this.props.listaDoc.map((doc, key) => {
                      return (
                        <thead key={key}>
                          <tr>
                            <td>{doc.file_ID}</td>
                            <td>{moment.unix(doc.timestamp).format('h:mm:ss A M/D/Y')}</td>
                            <td>{doc.nome_file}</td>
                            <td>{doc.descrizione_file}</td>
                            <td>{doc.tipo_file}</td>
                            <td>{convertBytes(doc.dimensione_file)}</td>

                            <td>
                              <a
                                href={"https://etherscan.io/address/" + doc.uploader}
                                rel="noopener noreferrer"
                                target="_blank">
                                {doc.uploader.substring(0, 10)}...
                          </a>
                            </td>
                            <td>
                              <a
                                href={"https://ipfs.infura.io/ipfs/" + doc.hash_file}
                                rel="noopener noreferrer"
                                target="_blank">
                                {doc.hash_file.substring(0, 10)}...
                          </a>
                            </td>
                          </tr>
                        </thead>
                      )
                    })}
                  </table>



                </div>
              </main>
            </div>
         




        </div>
      </div>
    );
  }
}

export default Main;