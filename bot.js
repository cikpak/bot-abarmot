require('dotenv').config()

const Telegraf = require('telegraf')
const isValid = require('shortid').isValid
const db = require('./lowdb/index')
const chatId = process.env.CHAT_ID
const bot = new Telegraf(process.env.TOKEN)
const deleteLink = require('./utils/deleteLink')

const formatMessage = info => {
	const {start, destination, postedDate} = info
	return `
		<b>Route was deleted:</b>\n
		From: <b>${start}</b>
		To: <b>${destination}</b>\n
		Posted: <b>${postedDate}</b>\n
	`
}

bot.action(/./g, (ctx) => {
	const linkId = ctx.callbackQuery.data

	if(isValid(linkId)) {
		const routeInfo = db.get('links').find({id: linkId}).value()

		if(routeInfo) {
			const {searchUrl} = routeInfo
			deleteLink(searchUrl)
			db.get('links').remove({id: linkId}).write()
			ctx.telegram.sendMessage(ctx.from.id, formatMessage(routeInfo), {parse_mode: "HTML",})
		} else {
			ctx.telegram.sendMessage(ctx.from.id, "Link was already unfollowed")
		}
	}
})

bot.launch()
module.exports = bot


