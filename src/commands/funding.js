const { nextFundingFee } = require('../services/funding')

module.exports = async function (msg) {
    const { btc, eth } = await nextFundingFee()
    const txt = `**바이빗 펀딩피**
BTC: ${btc}
ETH: ${eth}`

    msg.channel.send(txt)
}
