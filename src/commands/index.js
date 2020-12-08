function commands(msg) {
    if (msg.content === '늉') msg.channel.send('냥')
    if (msg.content === '영') msg.channel.send('차')
    if (/살까|팔까/.test(msg.content)) {
        msg.channel.send(Math.random() > 0.5 ? 'ㅇㅇ' : 'ㄴㄴ')
    }
    if (msg.content === '자산') require('./info')(msg)
}

module.exports = commands
