const { nextFundingFee } = require('../services/funding')
const { fundingPer } = require('../services/util')

module.exports = async function (msg) {
    const { btc, eth, eos, btcNext, ethNext, eosNext } = await nextFundingFee()
    let txt = '```diff\n'
    txt += btc < 0 || eth < 0 ? '-' : '+'
    txt += `바이빗 펀딩피 (현재 -> 예상)
BTC: ${fundingPer(btc)} -> ${fundingPer(btcNext)}
ETH: ${fundingPer(eth)} -> ${fundingPer(ethNext)}
EOS: ${fundingPer(eos)} -> ${fundingPer(eosNext)}
`
    txt += '```'
    msg.channel.send(txt)
}
