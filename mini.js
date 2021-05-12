// 迷你区块链
// 区块链的生成，新增，校验
// 交易
// 非对称加密
// 挖矿
// P2P网络

// [
//     {
//         index:0 // 索引  
//         timestamp:时间戳
//         data:区块的具体信息 主要是交易信息
//         hash,当前区块信息的哈希 哈希1
//         prevHash:上一个区块的哈希 哈希0
//         nonce:随机数
//     },
//     {
//         index:1 // 索引  
//         timestamp:时间戳
//         data:区块的具体信息 主要是交易信息
//         hash,当前区块信息的哈希 哈希2
//         prevHash:上一个区块的哈希 哈希1
//         nonce:随机数
//     }
// ]

// 创世区块
const genesis = {
    index: 0,
    data: 'hello world',
    prevHash: '',
    hash: 'eb5213e49c65c6fdfc21bb1d0fa9f0d52538d1b1de844128836a4c40c89465cd',
    timestamp: 1620476906480,
    nonce: 0
}

const crypto = require('crypto')
const dgram = require('dgram')

class BlockChain {
    constructor() {
        this.blockChain = [genesis]

        this.init = 0 // 创世地址
        this.data = []
        this.difficulty = 3

        // 所有的网络节点信息
        this.peers = []
        // 种子节点
        this.seed = {
            port:8001,
            address:'localhost'
        }

        this.udp = dgram.createSocket('udp4')
        this.init
    }

    init(){
        this.bindP2p()
        this.bindExit()
    }

    bindP2p(){
        // 网络发来的消息
        this.udp.on('message',(data,remote)=>{
            const {address,port} = remote 
            const action = JSON.parse(data)
        })
    }

    // 获取最新区块
    getLastBlock() {
        return this.blockChain[this.blockChain.length - 1]
    }

    // 查看余额
    blance(address) {
        let blance = 0
        this.blockChain.forEach(block => {
            if(!Array.isArray(block.data)){
                return
            }
       
            block.data.forEach(obj => {
                if (obj.from == address) {
                    blance -= obj.amount
                }
                if (obj.to == address) {
                    blance += obj.amount
                }
            })
        })
        return blance
    }


    // 转账
    transfor(from, to, amount) {
        // 判断是交易还是挖矿 挖矿不需要校验
        if (from != this.init) {
            const blance = this.blance(from)
            if (blance < amount) {
                console.log('not enough blance', from, blance, amount)
            }
        }
        const transObj = {
            from, to, amount
        }
        this.data.push(transObj)
        return transObj
    }

    // 挖矿
    mine(address) {
        // 生成新区块 一页新的记账加入区块链
        // 不停的计算哈希 直到符合的计算难度 获取记账权
        // 矿工奖励
        this.transfor(this.init, address, 77)
        const block = this.generatedBlock()

        if (this.isValidBlock(block) && this.isValidChain()) {
            this.blockChain.push(block)
            // console.log(block)
            this.data = []
            return block
        } else {
            console.log('Block validation failed')
        }
        return
    }

    // 生成区块
    generatedBlock() {
        const index = this.blockChain.length
        const prevHash = this.getLastBlock().hash
        const data = this.data
        const timestamp = new Date().getTime()
        let nonce = 0
        let hash = this.computedHash(index, prevHash, timestamp, data, nonce)
        while (hash.slice(0, this.difficulty) != '0'.repeat(this.difficulty)) {
            nonce += 1
            hash = this.computedHash(index, prevHash, timestamp, data, nonce)
            // console.log(hash)
        }

        return {
            index,
            data,
            hash,
            prevHash,
            timestamp,
            nonce
        }
    }

    computedHashForValid({ index, prevHash, timestamp, data, nonce }) {
        return this.computedHash(index, prevHash, timestamp, data, nonce)
    }

    // 计算哈希
    computedHash(index, prevHash, timestamp, data, nonce) {
        return crypto.createHash('sha256').update(
            index + prevHash + timestamp + data + nonce
        ).digest('hex')
    }

    // 校验哈希
    isValidaHash() {

    }

    // 校验区块
    isValidBlock(newBlock, lastBlock = this.getLastBlock()) {
        if (newBlock.index <= lastBlock.index) {
            return false
        } else if (newBlock.timestamp <= lastBlock.timestamp) {
            return false
        } else if (newBlock.prevHash != lastBlock.hash) {
            return false
        } else if (newBlock.hash.slice(0, this.difficulty) != '0'.repeat(this.difficulty)) {
            return false
        } else if (newBlock.hash != this.computedHashForValid(newBlock)) {
            return false
        } else {

            return true
        }
    }

    // 校验区块链
    isValidChain(chain = this.blockChain) {
        for (var i = chain.length - 1; i >= 1; i = i - 1) {
            if (!this.isValidBlock(chain[i], chain[i - 1])) {
                return false
            }
        }
        if (JSON.stringify(chain[0]) !== JSON.stringify(genesis)) {
            return false
        }
        return true
    }
}

let block = new BlockChain()

module.exports = BlockChain
block.mine()
// block.blockChain[1].nonce=22
block.mine()

// block.mine()

