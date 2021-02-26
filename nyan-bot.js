const config = require('./config')
const Discord = require('discord.js')
const client = new Discord.Client()
const commands = require('./src/commands/index')
const scheduler = require('./src/services/scheduler')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    scheduler.kimchiAlert(client)
    scheduler.fundingFee(client)
})

client.on('message', msg => {
    commands(msg)
})

client.login(config.api.discordToken)
