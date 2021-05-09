// 1. 公私钥对
// 2.公钥直接当地址用（或者截取前20位）
// 3.公钥可以通过私钥算出

var EC = require('elliptic').ec;
const fs = require('fs')
// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');

// Generate keys
var keypair = ec.genKeyPair();

const keys = generateKeys()
// console.log('查看数据', keys)

// 1.获取公私钥对（持久化）
function generateKeys() {
    const fileName = './wallet.json'
    try {
        let res = JSON.parse(fs.readFileSync(fileName))
        if (res.prv && res.pub && generatePub(res.prv) == res.pub) {
            keypair = ec.keyFromPrivate(res.prv)

            return res
        } else {
            throw 'not valid wallet.json'
        }
    } catch (err) {
        const res = {
            prv: keypair.getPrivate('hex').toString(),
            pub: keypair.getPublic('hex').toString()
        }
        fs.writeFileSync(fileName, JSON.stringify(res))
        return res
    }
}

function generatePub(prv) {
    // 根据私钥算出公钥
    return ec.keyFromPrivate(prv).getPublic('hex').toString()
}

// 2.签名
function sign({ from, to, amount }) {
    const buffmsg = Buffer.from(`${from}-${to}-${amount}`)
    let signature = Buffer.from(keypair.sign(buffmsg).toDER()).toString('hex')
    return signature
}

// 3.校验
function verify({ from, to, amount, signature }, pub) {
    // 校验是没有私钥的
    const keypairTemp = ec.keyFromPublic(pub,'hex')
    const buffmsg = Buffer.from(`${from}-${to}-${amount}`)
    return keypairTemp.verify(buffmsg, signature)
}

const trans = { from: 'mont', to: 'nana', amount: 77 }
const trans1 = { from: 'mont1', to: 'nana', amount: 77 }
const signature = sign(trans)

trans.signature = signature
const _verify = verify(trans, keys.pub)

// trans1.signature = signature
// const _verify = verify(trans1, keys.pub)
console.log('verfiy',_verify)