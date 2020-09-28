require('dotenv').config()

const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.TOKEN)
const isValid = require('shortid').isValid
const db = require('./lowdb/index')

const deleteLink = require('./utils/deleteLink')

bot.action(/./g, (ctx) => {
	const linkId = ctx.callbackQuery.data
	if(isValid(linkId)){
		const linkInfo = db.get('links').find({id: linkId}).value()
		deleteLink(linkInfo.link)
		ctx.editMessageText('Deleted')
	}
})

bot.launch()

module.exports = bot


