const Chance = require('chance');
import ZwarnError from "./error"

class Zwarn {
    constructor(info_id) {
        this.info_id = info_id
        this.is_block = false
        this.user = {}
        this.tokens = []
        this.target_chats = []
        this.creat_time = 0
        this.update_time = 0
        this.put_times = 0
    }

    // 加载KV中信息
    async load() {
        const info_json = await MAIN_INFO.get(this.info_id, "json")
        if (info_json === null) {
            throw new ZwarnError(400, '找不到信息')
        }
        if (info_json.info_id !== this.info_id) {
            throw new ZwarnError(400, '信息验证错误')
        }
        this.tokens = info_json.tokens
        this.user = info_json.user
        this.target_chats = info_json.target_chats
        this.is_block = info_json.is_block
        this.creat_time = info_json.creat_time
        this.update_time = info_json.update_time
        this.put_times = info_json.put_times
    }

    // 更新KV中的信息
    async update() {
        const now = new Date().getTime()
        if (now - this.update_time < 1000) {
            throw new ZwarnError(400, '更新请求太快')
        }
        this.put_times +=1
        if (this.put_times > 51) {
            throw new ZwarnError(400, '您的账号当前达到put请求上限，请不要滥用命令')
        }
        this.update_time = now
        return await MAIN_INFO.put(this.info_id, JSON.stringify(this))
    }

    // 发送提醒
    async sendWarn(bot, tag, title, text) {
        // 加载信息
        await this.load()
        if (this.is_block) {
            throw new ZwarnError(403, '当前禁止发送')
        }

        // 组装消息
        let send_text = ''
        let entities = []
        let length = 0
        if (!text) {
            throw new ZwarnError(400, 'text不能为空')
        }
        if (tag) {
            tag = tag.split(" ").join("")
            send_text = '#' + tag + ' \n'
            length = tag.length + 3
            entities.push({
                "offset": 0,
                "length": tag.length + 1,
                "type": "hashtag"
            })
        }

        if (title) {
            title = title.split(" ").join("")
            send_text = send_text + title+ '\n'
            entities.push({
                "offset": length,
                "length": title.length,
                "type": "bold"
            })
        }
        send_text = send_text + '\n' + text

        // 发送消息
        let data = {}
        data.ok = []
        data.fail = []
        for (const target_chat in this.target_chats) {
            await bot.telegram.sendMessage(this.target_chats[target_chat].id,
                send_text, {
                entities: entities
            }).then(() => {
                data.ok.push({
                    // chat_id: this.target_chats[target_chat],
                    username: this.target_chats[target_chat].username,
                    title: this.target_chats[target_chat].title,
                    type: this.target_chats[target_chat].type,
                    send: true
                })
            }).catch((error) => {
                data.fail.push({
                    // chat_id: this.target_chats[target_chat],
                    username: this.target_chats[target_chat].username,
                    title: this.target_chats[target_chat].title,
                    type: this.target_chats[target_chat].type,
                    send: false,
                    error: error.description
                })
            })
        }
        return data
    }

    // 添加目标chat
    async addChat(chat) {
        // 获取
        await this.load()

        // 本地添加
        this.addChatLocal(chat)

        // 更新KV
        return await this.update()
    }

    addChatLocal(chat) {
        // 验证
        let target_chat = this.target_chats.find(target_chat => {
            return target_chat.id == chat.id
        })
        if (target_chat) {
            throw new ZwarnError(400, 'chat已存在')
        }

        // 更新
        target_chat = {
            id: chat.id,
            username: chat.username,
            title: chat.title,
            type: chat.type
        }
        this.target_chats.push(target_chat)
    }

    // 删除目标chat
    async delChat(chat) {
        // 获取
        await this.load()

        // 本地删除
        this.delChatLocal(chat)

        // 更新KV
        return await this.update()
    }

    delChatLocal(chat) {
        // 验证
        let target_chat_index = this.target_chats.findIndex(target_chat => {
            return target_chat.id == chat.id
        })
        if (target_chat_index < 0) {
            throw new ZwarnError(400, 'chat不存在')
        }

        // 删除 
        this.target_chats.splice(target_chat_index, 1)
    }

    // 生成token
    static async genToken() {
        // 生成
        const chance = new Chance()
        let token = chance.string({
            length: 32,
            pool: 'ABCDEFGHIJKLMNOPQRSTUWXYZ23456789'
        })

        // 检验重复
        const check = await TOKEN.get(token)
        if (check == null) {
            return token
        } else {
            return await this.genToken()
        }
    }

    static async genUUID() {
        // 生成
        const chance = new Chance()
        const uuid = chance.guid()
        return uuid
    }
}

export default Zwarn