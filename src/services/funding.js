const config = require('../../config')
const axios = require('axios')

async function nextFundingFee() {
    const [ btc,eth,eos ] = await Promise.all([
        axios(
            config.api.bybitUrl + '/public/tickers?symbol=BTCUSD',
        ),
        axios(
            config.api.bybitUrl + '/public/tickers?symbol=ETHUSD',
        ),
        axios(
            config.api.bybitUrl + '/public/tickers?symbol=EOSUSD',
        ),
    ])

    return {
        btc: btc.data.result[0].funding_rate * 100,
        eth: eth.data.result[0].funding_rate * 100,
        eos: eos.data.result[0].funding_rate * 100,
        btcNext: btc.data.result[0].predicted_funding_rate * 100,
        ethNext: eth.data.result[0].predicted_funding_rate * 100,
        eosNext: eos.data.result[0].predicted_funding_rate * 100,
    }
}

module.exports = {
    nextFundingFee,
}
