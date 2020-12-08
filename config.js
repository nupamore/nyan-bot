require('dotenv').config()

module.exports = {
    channelId: process.env.DISCORD_CHANNEL_ID,
    api: {
        discordToken: process.env.DISCORD_TOKEN,
        upbitUrl: 'https://api.upbit.com/v1',
        upbitAccess: process.env.UPBIT_ACCESS_KEY,
        upbitSecret: process.env.UPBIT_SECRET_KEY,
        binanceAccess: process.env.BINANCE_ACCESS_KEY,
        binanceSecret: process.env.BINANCE_SECRET_KEY,
    },
}
