require('dotenv').config();
const chokidar = require('chokidar')
const {Markup} = require('telegraf')
const shortid = require('shortid')
const bot = require('./bot')
const fs = require('fs')
const db = require('./lowdb/index')

const chatId = process.env.CHAT_ID
const dir = process.env.DIR

const formatHtmlMessage = require('./utils/formatMessage')
const formatJson = require('./utils/formatJson')


const sendTelegamMessage = info => {
	const id = shortid.generate()

	db.get('links').push({
		id,
		link: info.searchUrl
	}).write()

	if(info.photos.length) {
		try{
			info.photos.map(photo => {
				fs.readFile(photo, (err, data) => {
					bot.telegram.sendPhoto(chatId, {source: photo})
				})
			})
		} catch(e) {
			console.error(e)
		}
	}

	const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
		Markup.callbackButton('Unfollow', id.toString()),
	])

	bot.telegram.sendMessage(chatId, formatHtmlMessage(info), {
		parse_mode: "HTML",
		reply_markup: inlineMessageRatingKeyboard
	})
}


const startWatching = () => {
	const watcher = chokidar.watch(dir, {
		usePolling: false,
	});

	watcher.on('ready', () => {
		watcher.on('add', (path)=> {
			fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
				const info = formatJson(data)
				sendTelegamMessage(info)
			})
		})
	})
}

startWatching();


























