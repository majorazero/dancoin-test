const SHA256 = require("crypto-js/sha256");
class CryptoBlock{
    constructor(index, timestamp, data, precedingHash=" ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
    }

    computeHash() {
        return SHA256(`${this.index}${this.precedingHash}${this.timestamp}${JSON.stringify(this.data)}`).toString();
    }
}

class CryptoBlockchain{
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
    }
    startGenesisBlock() {
        return new CryptoBlock(0, Date.now, "First Block of Chain", "0");
    }
    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(newBlock) {
        newBlock.precedingHash=this.obtainLatestBlock().hash;
        newBlock.hash = newBlock.computeHash();
        this.blockchain.push(newBlock);
    }
}

const danCoin = new CryptoBlockchain();
danCoin.addNewBlock(new CryptoBlock(1, Date.now, {sender: "Dan", recipient: "Lulu", quantity: 50}));
danCoin.addNewBlock(new CryptoBlock(2, Date.now, {sender: "Lulu", recipient: "Dan", quantity: 50}));
console.log(JSON.stringify(danCoin, null, 4));