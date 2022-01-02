// Bring in crypto-js library
const SHA256 = require( 'crypto-js/sha256' );

// defining block class. Includes block signature, constructor that holds parameters, and properties
class Block {
    constructor( index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = this.previousHash
    }
    // current block definition. Header value for block linking
    calculateHash() {
        return SHA256( this.index + this.previousHash + this.timestamp + JSON.stringify( this.data)).toString();
    }
}
// Blockchain class used for the block linking
class Blockchain {
    constructor() {
        this.chain = [ this.createGenesisBlock() ];
    }
    // first block in chain creation
    createGenesisBlock() {
        return new Block( 0, "2/01/2022", "Genesis Block", "0");
    }
    // function the gets latest block
    getlatestBlock() {
        return this.chain [ this.chain.length - 1 ];
    }
    // adding new block to previous block hash property to create chain link
    addBlock( newBlock) {
        newBlock.previousHash = this.getlatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push ( newBlock );
    }

    // new function to validate block chain
    isChainValid() {
        for ( let i = 1; i < this.chain.length; i++ ) {
            const currentBlock = this.chain[ i ];
            const previousBlock = this.chain[ i - 1 ];

            // validate data integrity
            if (currentBlock.hash !== currentBlock.calculateHash() ) {
                return false;
            }
            // validate hash chain link
            if ( currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        // if true, no manipulated data of bad links
        return true;
    }
}
// creating demo blocks
let demoChain = new Blockchain();
demoChain.addBlock( new Block( 1, "2/01/2022", {
    amount: 10
} ) );
demoChain.addBlock( new Block( 2, "3/01/2022", {
    amount: 25
} ) );

// console for visual
console.log( JSON.stringify( demoChain, null, 4 ) );

console.log( "Is chain valid? " + demoChain.isChainValid() );