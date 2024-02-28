const SHA256 = require("crypto-js/sha256");
class CryptoBlock{
    constructor(index, timestamp, data, precedingHash=" ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.nonce = 0;
        this.hash = this.computeHash();
    }
    proofOfWork(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.computeHash();
        }
    }
    computeHash() {
        return SHA256(`${this.index}${this.precedingHash}${this.timestamp}${JSON.stringify(this.data)}${this.nonce}`).toString();
    }
}

class CryptoBlockchain{
    constructor() {
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 4;
    }
    startGenesisBlock() {
        return new CryptoBlock(0, Date.now, "First Block of Chain", "0");
    }
    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(newBlock) {
        newBlock.precedingHash=this.obtainLatestBlock().hash;
        // newBlock.hash = newBlock.computeHash();
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }
    checkChainValiditiy() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i-1];

            if (currentBlock.hash !== currentBlock.computeHash()) {
                return false;
            }
            if (currentBlock.precedingHash !== precedingBlock.hash) {
                return false;
            }

            return true;
        }
    }
 }

const danCoin = new CryptoBlockchain();
danCoin.addNewBlock(new CryptoBlock(1, Date.now, {sender: "Dan", recipient: "Lulu", quantity: 50}));
danCoin.addNewBlock(new CryptoBlock(2, Date.now, {sender: "Lulu", recipient: "Dan", quantity: 50}));
console.log(JSON.stringify(danCoin, null, 4));
console.log(danCoin.checkChainValiditiy())