const { nextFundingFee } = require('../services/funding')

module.exports = async function (msg) {
    const { btc, eth, btcNext, ethNext } = await nextFundingFee()
    const txt = `**현재**
BTC: ${btc}
ETH: ${eth}
**예상**
BTC: ${btcNext}
ETH: ${ethNext}
`
    msg.channel.send(txt)
}
