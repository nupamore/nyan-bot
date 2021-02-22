const config = require('../../config')
const axios = require('axios')

async function nextFundingFee() {
    const btc = await axios({
        baseURL: config.api.bybitUrl,
        url: 'public/funding/prev-funding-rate?symbol=BTCUSD',
    })
    const eth = await axios({
        baseURL: config.api.bybitUrl,
        url: 'public/funding/prev-funding-rate?symbol=ETHUSD',
    })

    return {
        btc: (btc.data.result.funding_rate * 100).toFixed(2) + '%',
        eth: (eth.data.result.funding_rate * 100).toFixed(2) + '%',
    }
}

module.exports = {
    nextFundingFee,
}
