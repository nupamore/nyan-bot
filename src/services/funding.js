const config = require('../../config')
const axios = require('axios')

async function nextFundingFee() {
    const btc = await axios(
        config.api.bybitUrl + '/public/tickers?symbol=BTCUSD',
    )
    const eth = await axios(
        config.api.bybitUrl + '/public/tickers?symbol=ETHUSD',
    )

    return {
        btc: btc.data.result[0].funding_rate * 100,
        eth: eth.data.result[0].funding_rate * 100,
        btcNext: btc.data.result[0].predicted_funding_rate * 100,
        ethNext: eth.data.result[0].predicted_funding_rate * 100,
    }
}

module.exports = {
    nextFundingFee,
}
