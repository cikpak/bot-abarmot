require('dotenv').config();

const chokidar = require('chokidar')
const {Markup} = require('telegraf')
const sha1 = require('sha1')
const bot = require('./bot')
const fs = require('fs')
const db = require('./lowdb/index')

const dir = process.env.DIR

const {orderInfo} = require('./utils/messageHtmlTemplates')
const formatJson = require('./utils/formatJson')
const deleteLink = require('./utils/deleteLink')
const getLinkFollowers = require('./utils/getLinkFollowers')


const sendTelegramMessage = async (userId, info) => {
    if (info.photos.length) {
        try {
            info.photos.map(photo => {
                fs.readFile(photo, (err, data) => {
                    bot.telegram.sendPhoto(userId, {source: photo})
                })
            })
        } catch (e) {
            console.error(e)
        }
    }

    const hashLink = sha1(info.searchUrl)

    const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
        Markup.callbackButton('Unfollow', hashLink),
    ])

    bot.telegram.sendMessage(userId, orderInfo(info), {
        parse_mode: "HTML",
        reply_markup: inlineMessageRatingKeyboard
    })
}

const startWatching = () => {
    const watcher = chokidar.watch(dir, {
        usePolling: false,
    });

    watcher.on('ready', async () => {
        watcher.on('add', (path) => {
            fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
                const info = formatJson(data)
                const linkFollowers = getLinkFollowers(info.searchUrl)

                if (linkFollowers.length) {
                    linkFollowers.map(id => {
                        sendTelegramMessage(id, info)
                    })
                }
            })
        })
    })
}

startWatching();


























