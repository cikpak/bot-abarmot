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
		if(linkInfo.link){
			deleteLink(linkInfo.link)
			ctx.editMessageText('Deleted')
		}else{
			ctx.editMessageText("Link doesn't exists")
		}
	}
})

bot.launch()

module.exports = bot


