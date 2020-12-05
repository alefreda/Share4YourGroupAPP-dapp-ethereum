pragma solidity ^0.5.0;

contract Share4YourGroupAPP {
  string public name = 'Share4YourGroupAPP';
  uint public numero_file = 0;
  mapping(uint => Documento) public files;

  struct Documento {
    uint file_ID;
    string hash_file;
    uint dimensione_file;
    string tipo_file;
    string nome_file;
    string descrizione_file;
    uint timestamp;
    address payable uploader;
  }

  event DocumentoCaricato(
    uint file_ID,
    string hash_file,
    uint dimensione_file,
    string tipo_file,
    string nome_file, 
    string descrizione_file,
    uint timestamp,
    address payable uploader
  );

  constructor() public {
  }

  function uploadFile(string memory hashDocumento, uint dimensioneDocumento, string memory tipoDocumento, string memory nomeDocumento, string memory descrizioneDocumento) public {
    
    //verifico appartenenza doc, se esiste ritorna errore
    require(
    getByHash(hashDocumento) == false,
    "Documento esistente!."
    );
    //verifico i parametri
    require(bytes(hashDocumento).length > 0);
    require(bytes(tipoDocumento).length > 0);
    require(bytes(descrizioneDocumento).length > 0);
    require(bytes(nomeDocumento).length > 0);
    // verifico che uploader address esiste
    require(msg.sender!=address(0));
    require(dimensioneDocumento>0);
    // incrementa il numero
    numero_file ++;
    // aggiungi file al contratto
    files[numero_file] = Documento(numero_file, hashDocumento, dimensioneDocumento, tipoDocumento, nomeDocumento, descrizioneDocumento, now, msg.sender);
    // Trigger 
    emit DocumentoCaricato(numero_file, hashDocumento, dimensioneDocumento, tipoDocumento, nomeDocumento, descrizioneDocumento, now, msg.sender);
  
  }

  //se documento esiste ritorna true 
  //funzione per notarizzazione del documento, lo stesso documento non può essere caricato più volte
  function getByHash(string memory hashDoc) public view returns (bool) {
      for (uint index = 0; index < numero_file; index++) {
        //keccak256 per confrontare le stringhe 
        //keccak256 is a hashing function supported by Solidity, and abi.encodePacked() encodes values via the Application Binary Interface.
        if ( keccak256(abi.encodePacked(hashDoc)) == keccak256(abi.encodePacked(files[index].hash_file))) {
            return true;
        } 
      }
      return false;
    
    }
}