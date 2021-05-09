const vorpal = require('vorpal')();
const BlockChain = require('./mini')
const _blockChain = new BlockChain()
let Table = require('cli-table');

const formatLog = (data) => {
    if(!Array.isArray(data)){
        data = [data]
    }

    let obj = data[0]
    let heads = Object.keys(obj)

    var table = new Table({
        head: heads
      , colWidths: new Array(heads.length).fill(15)
    });
    
    let arr = data.map(i=>{
        return heads.map(k=>{
           return i[k]
        })
    })
    table.push(...arr);
    console.log(table.toString());
}

vorpal
    .command('mine', '挖矿')
    .action(function (args, callback) {
        const newBlock = _blockChain.mine()
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

vorpal.exec('help')
vorpal
    .delimiter('vorpal')
    .show();