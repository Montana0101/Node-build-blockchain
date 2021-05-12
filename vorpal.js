const vorpal = require('vorpal')();
const BlockChain = require('./mini')
const _blockChain = new BlockChain()
let Table = require('cli-table');

const formatLog = (data) => {
    if (!Array.isArray(data)) {
        data = [data]
    }

    let obj = data[0]
    let heads = Object.keys(obj)

    var table = new Table({
        head: heads
        , colWidths: new Array(heads.length).fill(15)
    });

    let arr = data.map(i => {
        return heads.map(k => JSON.stringify(i[k], null, 1))
    })
    table.push(...arr);
    console.log(table.toString());
}

vorpal
    .command('trans <from> <to> <amount>', '转账')
    .action(function (args, callback) {
        const tarnsObj = _blockChain.transfor(args.from, args.to, args.amount)
        if (tarnsObj) {
            formatLog(tarnsObj)
        }
        callback();
    });


vorpal
    .command('mine <address>', '挖矿')
    .action(function (args, callback) {
        const newBlock = _blockChain.mine(args.address)
        if (newBlock) {
            formatLog(newBlock)
        }
        callback();
    });

vorpal
    .command('chain', '查看区块链')
    .action(function (args, callback) {
        formatLog(_blockChain.blockChain)
        callback();
    });

vorpal
    .command('blance <address>', '查看余额')
    .action(function (args, callback) {
        const blance = _blockChain.blance(args.address)
        if (blance) {
            formatLog({ blance:blance, address: args.address })
        }else{}
        callback();
    });

vorpal
    .command('detail <index>', '查看区块详情')
    .action(function (args, callback) {
        const block = _blockChain.blockChain[args.index]
        this.log(block)
        callback();
    });

vorpal.exec('help')
vorpal
    .delimiter('vorpal')
    .show();