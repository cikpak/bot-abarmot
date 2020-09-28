const Router = require('express').Router
const router = new Router()
const shortid = require('shortid')

const {Markup} = require('telegraf')
const path = require('path')
const fs = require('fs')

const formatHtmlMessage = require('../utils/formatMessage')
const bot = require('../bot')

const file = path.join(__dirname, '..', 'photo_2020-09-27_02-57-38.jpg')
const chatId = process.env.CHAT_ID

//use json formater
router.use(require('../middleware/formatJson'))

//message inline keyboard

router.post('/route-info', async (req, res, next) => {
	try {
		const {info} = req.body
		const id = shortid.generate()

		db.get('links').push({
			id,
			link: info.searchUrl
		}).write()

		if(info.photos.length) {
			info.photos.map(photo => {
				fs.readFile(file, (err, data) => {
					bot.telegram.sendPhoto(chatId, {source: photo})
				})
			})
		}

		const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
			Markup.callbackButton('Unfollow', id.toString()),
		])

		console.log(inlineMessageRatingKeyboard.inline_keyboard)

		bot.telegram.sendMessage(chatId, formatHtmlMessage(info), {
			parse_mode: "HTML",
			reply_markup: inlineMessageRatingKeyboard
		})

		res.end()
	} catch(e) {
		console.log(e)
		next(e)
	}
})


module.exports = router