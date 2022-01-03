// Block processor
// Bring in crypto-js library
const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor( timestamp, payerAddr, payeeAddr, amount) {
        this.timestamp = timestamp;
        this.payerAddr = payerAddr;
        this.payeeAddr = payeeAddr;
        this.amount = amount;
    }
}

// defining block class. Includes block signature, constructor that holds parameters, and properties
class Block {
    // the constructor runs when object of class instantiates
    constructor( timestamp, txns, previousHash ) {
        this.timestamp = timestamp;
        this.txns = txns;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    
    // current block definition. Header value for block linking
    calculateHash() {
        return SHA256( this.index + this.previousHash + this.timestamp + JSON.stringify( this.data) + this.nonce ).toString();
    }   
    // mine block security check
    mineBlock( difficulty ) {
        let count = 0;
        while( this.hash.substring( 0, difficulty) !== Array( difficulty + 1 ).join( "0" ) ) {
            this.nonce++;  // '++' is the JavaScript incrementor operator (adds 1 to the nonce integer)
            count++;
            this.hash = this.calculateHash();
        }
        console.log( "Block successfully hashed: (" + count + " iterations).  Hash: " + this.hash );
    }
}
// Blockchain class used for the block linking
class Blockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 3;
        this.unminedTxns = [];
        this.miningReward = 50;
        this.registeredAddresses = ['wallet-Luna', 'wallet-Sora', 'wallet-Mane', 'wallet-Miner4xe'];
        this.createGenesisBlock();
        this.airdropCoins( 100 );
    }
    
    airdropCoins( coins ) {
        for ( const addr of this.registeredAddresses ) {
            let txn = new Transaction( Date.now(), "mint", addr, coins );
            this.unminedTxns.push( txn );
        }
        this.mineCurrentBlock( 'wallet-Miner4xe' );
    }
    // first block in chain creation
    createGenesisBlock() {
        let txn = new Transaction( Date.now(), "mint", "genesis", 0 );
        let block = new Block( Date.now(), [ txn ], "0" );
        this.chain.push( block );
    }
    // function the gets latest block
    getLatestBlock() {
        return this.chain[ this.chain.length - 1 ];
    }
    
    mineCurrentBlock( minerAddr ) {
        // validating every transaction going into the blockchain
        let validatedTxns = [];
        for ( const txn of this.unminedTxns ) {
            if ( txn.payerAddr === "mint" || this.validateTransaction( txn ) ) {
                validatedTxns.push( txn );
            }
        }
        console.log( "transactions validated: " + validatedTxns.length );
        
        let block = new Block( Date.now(), validatedTxns, this.getLatestBlock().hash );
        block.mineBlock( this.difficulty );
        
        console.log( "Current Block successfully mined..." );
        this.chain.push( block );
        
        this.unminedTxns = [
            new Transaction( Date.now(), "mint", minerAddr, this.miningReward )
        ];
    }
    
    validateTransaction( txn ) {
        let payerAddr = txn.payerAddr;
        let balance = this.getAddressBalance( payerAddr );
        if ( balance >= txn.amount ) {
            return true;
        } else {
            return false;
        }
    }
    
    createTransaction( txn ) {
        this.unminedTxns.push( txn );
    }
    
    getAddressBalance( addr ) {
        let balance = 0;
        
        for ( const block of this.chain ) {
            for ( const txn of block.txns ) {
                if ( txn.payerAddr === addr ) {
                    balance -= txn.amount;    
                }
                if ( txn.payeeAddr === addr ) {
                    balance += txn.amount;
                }
            }
        }
        return balance;
    }

    // new function to validate block chain
    isChainValid() {
        for ( let i = 1; i < this.chain.length; i++ ) {
            const currentBlock = this.chain[ i ];
            const previousBlock = this.chain[ i - 1 ];
            
            // validate data integrity
            if ( currentBlock.hash !== currentBlock.calculateHash() ) {
                return false;
            }
            
            // validate hash chain link
            if ( currentBlock.previousHash !== previousBlock.hash ) {
               return false;
            }
        }
        // if true, no manipulated data of bad links
        return true;
    }
}
// creating demo blocks
let demoCoin = new Blockchain();
//coin test
demoCoin.createTransaction( new Transaction( Date.now(), 'wallet-Luna', 'wallet-Sora', 1000 ) );
demoCoin.createTransaction( new Transaction( Date.now(), 'wallet-Sora', 'wallet-Luna', 25 ) );

console.log( "\nMining a block" );
demoCoin.mineCurrentBlock( 'wallet-Miner4xe' );

console.log( "\nBalance: Luna: ", + demoCoin.getAddressBalance( 'wallet-Luna' ) );
console.log( "\nBalance: Sora: ", + demoCoin.getAddressBalance( 'wallet-Sora' ) );
console.log( "\nBalance: Miner4xe: ", + demoCoin.getAddressBalance( 'wallet-Miner4xe' ) );

//2nd block
demoCoin.createTransaction( new Transaction( Date.now(), 'wallet-Luna', 'wallet-Sora', 50 ) );
demoCoin.createTransaction( new Transaction( Date.now(), 'wallet-Sora', 'wallet-Luna', 25 ) );

console.log( "\nMining a block" );
demoCoin.mineCurrentBlock( 'wallet-Miner4xe' );

console.log( "\nBalance: Luna: ", + demoCoin.getAddressBalance( 'wallet-Luna' ) );
console.log( "\nBalance: Sora: ", + demoCoin.getAddressBalance( 'wallet-Sora' ) );
console.log( "\nBalance: Miner4xe: ", + demoCoin.getAddressBalance( 'wallet-Miner4xe' ) );