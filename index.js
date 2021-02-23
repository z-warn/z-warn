import Zwarn from "./src/core/zwarn"
import ZwarnError from "./src/core/error"

import { Application, Router, validate } from '@cfworker/web'
import { Telegraf } from 'telegraf'

const bot = new Telegraf(BOT_TOKEN)
const router = new Router()

router.get('/:token/send',
    validate({
        params: {
            required: ['token'],
            properties: {
                token: {
                    minLength: 30,
                    maxLength: 40
                }
            }
        }
    }),
    async ({ req, res }) => {
        try {
            // 获取参数
            const token = req.params.token
            const params = req.url.searchParams
            const tag = params.get('tag')
            const title = params.get('title')
            const text = params.get('text')
            const mode = params.get('mode')
            const mute = params.get('mute')
            const page_view = params.get('pageview')

            // token 找 信息id
            const info_id = await TOKEN.get(token)
            if (info_id === null) {
                throw new ZwarnError(400, '找不到信息')
            }

            // 获取用户信息
            let zwarn = new Zwarn(info_id)

            // 发送提醒消息
            await zwarn.sendWarn(bot, {
                tag: tag,
                title: title,
                text: text,
                mode: mode,
                mute: mute,
                page_view: page_view
            }).then(data => {
                // 返回结果
                successResponse(data, res)
            })
        } catch (error) {
            errorResponse(error, res)
        }
    }
)

router.post('/:token/send',
    validate({
        params: {
            required: ['token'],
            properties: {
                token: {
                    minLength: 30,
                    maxLength: 40
                }
            }
        }
    }),
    async ({ req, res }) => {
        try {
            // 获取token
            const token = req.params.token

            // 获取参数标题及文字
            const body = await req.body.json()
            if (!body) {
                throw new ZwarnError(400, 'body参数错误')
            }
            const text = body.text
            const tag = body.tag
            const title = body.title
            const mode = body.mode
            const mute = body.mute
            const page_view = body.pageview

            // token 找 信息id
            const info_id = await TOKEN.get(token)
            if (info_id === null) {
                throw new ZwarnError(400, '找不到信息')
            }

            // 获取用户信息
            let zwarn = new Zwarn(info_id)

            // 发送提醒消息
            await zwarn.sendWarn(bot, {
                tag: tag,
                title: title,
                text: text,
                mode: mode,
                mute: mute,
                page_view: page_view
            }).then(data => {
                // 返回结果
                successResponse(data, res)
            })
        } catch (error) {
            errorResponse(error, res)
        }
    }
)

router.get('/creatToken', async ({ req, res }) => {
    try {
        // 生成uuid
        const uuid = await Zwarn.genUUID()

        // 实例化zwarn
        const zwarn = new Zwarn(uuid)

        // 生成更新TOKEN
        const token = await Zwarn.genToken()
        await TOKEN.put(token, zwarn.info_id)
        zwarn.tokens.push({
            token: token,
            is_block: false
        })

        // 更新创建时间
        zwarn.creat_time = new Date().getTime()

        // 更新 KV
        await zwarn.update()

        // 返回结果
        successResponse(token, res)
    } catch (error) {
        errorResponse(error, res)
    }
})

router.get('/:token/addChat',
    validate({
        params: {
            required: ['token'],
            properties: {
                token: {
                    minLength: 30,
                    maxLength: 40
                }
            }
        }
    }),
    async ({ req, res }) => {
        try {
            // 获取token
            const token = req.params.token

            // 获取参数
            const params = req.url.searchParams
            const chat = params.get('chat')
            if (!chat) {
                throw new ZwarnError(400, '参数错误')
            }

            // token 找 信息id
            const info_id = await TOKEN.get(token)
            if (info_id === null) {
                throw new ZwarnError(400, '找不到信息')
            }

            // 获取chat_id
            let chat_info = await bot.telegram.getChat(chat)

            // 获取用户信息
            let zwarn = new Zwarn(info_id)
            // 添加chat
            await zwarn.addChat(chat_info)

            // 返回结果
            successResponse({ target_chats: zwarn.target_chats }, res)
        } catch (error) {
            errorResponse(error, res)
        }
    }
)

router.post('/:token/addChat',
    validate({
        params: {
            required: ['token'],
            properties: {
                token: {
                    minLength: 30,
                    maxLength: 40
                }
            }
        }
    }),
    async ({ req, res }) => {
        try {
            // 获取token
            const token = req.params.token

            // 获取参数
            const params = req.url.searchParams
            const chat = params.get('chat')
            if (!chat) {
                throw new ZwarnError(400, '参数错误')
            }

            // token 找 信息id
            const info_id = await TOKEN.get(token)
            if (info_id === null) {
                throw new ZwarnError(400, '找不到信息')
            }

            // 获取chat_id
            let chat_info = await bot.telegram.getChat(chat)

            // 获取用户信息
            let zwarn = new Zwarn(info_id)
            // 添加chat
            await zwarn.addChat(chat_info)

            // 返回结果
            successResponse({ target_chats: zwarn.target_chats }, res)
        } catch (error) {
            errorResponse(error, res)
        }
    }
)

router.get('/:token/delChat',
    validate({
        params: {
            required: ['token'],
            properties: {
                token: {
                    minLength: 30,
                    maxLength: 40
                }
            }
        }
    }),
    async ({ req, res }) => {
        try {
            // 获取token
            const token = req.params.token

            // 获取参数
            const params = req.url.searchParams
            const chat = params.get('chat')
            if (!chat) {
                throw new ZwarnError(400, '参数错误')
            }

            // token 找 信息id
            const info_id = await TOKEN.get(token)
            if (info_id === null) {
                throw new ZwarnError(400, '找不到信息')
            }

            // 获取chat_id
            let chat_info = await bot.telegram.getChat(chat)

            // 获取用户信息
            let zwarn = new Zwarn(info_id)
            // 删除chat
            await zwarn.delChat(chat_info)

            // 返回结果
            successResponse({ target_chats: zwarn.target_chats }, res)
        } catch (error) {
            errorResponse(error, res)
        }
    }
)

router.post('/:token/delChat',
    validate({
        params: {
            required: ['token'],
            properties: {
                token: {
                    minLength: 30,
                    maxLength: 40
                }
            }
        }
    }),
    async ({ req, res }) => {
        try {
            // 获取token
            const token = req.params.token

            // 获取参数
            const body = await req.body.json()
            if (!body || !body.chat) {
                throw new ZwarnError(400, '参数错误')
            }
            const chat = body.chat

            // token 找 信息id
            const info_id = await TOKEN.get(token)
            if (info_id === null) {
                throw new ZwarnError(400, '找不到信息')
            }

            // 获取chat_id
            let chat_info = await bot.telegram.getChat(chat)

            // 获取用户信息
            let zwarn = new Zwarn(info_id)
            // 删除chat
            await zwarn.delChat(chat_info)

            // 返回结果
            successResponse({ target_chats: zwarn.target_chats }, res)
        } catch (error) {
            errorResponse(error, res)
        }
    }
)


function errorResponse(error, res) {
    if (error.code) {
        res.body = error
        res.status = error.code
    } else {
        res.body = {
            ok: false,
            code: 500,
            message: '内部错误'
        }
        res.status = 500
    }
}

function successResponse(data, res) {
    res.body = {
        ok: true,
        data: data
    }
    res.status = 200
}

new Application().use(router.middleware).listen()
