require('dotenv').config()

const Telegraf = require('telegraf')
const isValid = require('shortid').isValid
const bot = new Telegraf(process.env.TOKEN)
const db = require('./lowdb/index')
const sha1 = require('sha1')

const {deleteConfirmation} = require('./utils/messageHtmlTemplates')
const deleteLink = require('./utils/deleteLink')
const writeLink = require('./utils/writeLink')
const {urlRegex} = require('./utils/regex')
const getLinkFollowers = require('./utils/getLinkFollowers')

bot.start(async (ctx) => {
    try {
        const userId = ctx.from.id
        const users = db.get('users')

        if (!users.find({userId: userId}).value()) {
            const userInfo = {
                userId, links: []
            }
            users.push(userInfo).write()
        }

        ctx.telegram.sendMessage(userId, `Hello <b>${ctx.from.username}</b>, send a link to get live updates!`, {parse_mode: "HTML"})
    } catch (e) {
        console.log(e)
        ctx.telegram.sendMessage(userId, 'Error')
    }
})


bot.hears(urlRegex, async (ctx) => {
    try {
        const userId = ctx.from.id
        const link = ctx.message.text
        const user = db.get('users').find({userId: userId})

        if (user.value().links.includes(link)) {
            return ctx.reply('This link is already in your list!')
        } else {
            let userLinks = user.value().links
            userLinks.push(link)
            user.assign({links: userLinks}).write()
            ctx.reply('Link was added in your list!')
        }

        await writeLink(link)
        const routeInfo = {
            link, userId
        }

        db.get('links').push(routeInfo).write()
    } catch (e) {
        console.error(e)
    }
})


bot.action(/./g, async (ctx) => {
    const linkId = ctx.callbackQuery.data
    const userId = ctx.from.id
    const user = db.get('users').find({userId})

    const userLinks = user.value().links

    const haveLink = userLinks.filter(link => {
        const shaLink = sha1(link)
        return shaLink === linkId
    })

    if (haveLink.length) {
        const link = haveLink[0]

        userLinks.splice(userLinks.indexOf(link), 1)

        user.assign({
            links: userLinks
        }).write()

        ctx.telegram.sendMessage(userId, deleteConfirmation(), {parse_mode: "HTML"})


        const linkFollowers = getLinkFollowers(link)

        if(linkFollowers.length === 0){
            deleteLink(link)
        }


    } else{
        ctx.telegram.sendMessage(userId, "You already unfollowed this link!")
    }
})


bot.launch()

module.exports = bot


