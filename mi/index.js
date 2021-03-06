//se for usar dê os créditos. Esse bot é uma base simples em pt-br, mas tbm pode ser usada como bot pois está 100% funcional

const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    MessageOptions,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
    mentionedJid,
    processTime,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { getBuffer, h2k, simih, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson, fetchText } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const lolis = require('lolis.life')
const loli = new lolis()
const double = Math.floor(Math.random() * 2) + 1
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
const setting = JSON.parse(fs.readFileSync('./src/settings.json'))
prefix = setting.prefix
blocked = []
ban = []

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Hrs ${pad(minutes)} Min ${pad(seconds)} Seg`
}

async function starts() {
	const SouNoobYT = new WAConnection()
	SouNoobYT.logger.level = 'warn'
	console.log(banner.string)
	SouNoobYT.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})
	fs.existsSync('./BarBar.json') && SouNoobYT.loadAuthInfo('./BarBar.json')
	SouNoobYT.on('connecting', () => {
		start('2', 'Connecting...')
	})
	SouNoobYT.on('open', () => {
		success('2', 'Connected')
	})
	await SouNoobYT.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./BarBar.json', JSON.stringify(SouNoobYT.base64EncodedAuthInfo(), null, '\t'))

	SouNoobYT.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await SouNoobYT.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await SouNoobYT.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Olá @${num.split('@')[0]}\nBem-vindo ao grupo: *${mdata.subject}*`
				let buff = await getBuffer(ppimg)
				SouNoobYT.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await SouNoobYT.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `R.I.P @${num.split('@')[0]}👋`
				let buff = await getBuffer(ppimg)
				SouNoobYT.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	
	SouNoobYT.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	SouNoobYT.on('chat-update', async (mek) => {
		try {
            if (!mek.hasNewMessage) return
            mek = mek.messages.all()[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = setting.apiKey // me chama whatsapp wa.me/11930758170
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('America/Sao_Paulo').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
                        var pes = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : ''
			const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '⌛ Calma aeee ⌛',
				success: '✔️ Sucesso ✔️',
				error: {
					stick: 'Vixi, deu erro tenta de novo',
					Iv: '❌ Link inválido ❌'
				},
				only: {
					group: '❌ Este comando só pode ser usado em grupos! ❌',
					ownerG: '❌ Este comando só pode ser usado pelo dono do grupo! ❌',
					ownerB: '❌ Este comando só pode ser usado pelo meu dono! ❌',
					admin: '❌ Você não é adm! ❌',
					Badmin: '❌ Preciso ser adm! ❌'
				}
			}

			const botNumber = SouNoobYT.user.jid
			const ownerNumber = [`${setting.ownerNumber}@s.whatsapp.net`]
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await SouNoobYT.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isBanned = ban.includes(sender)
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			pushname = SouNoobYT.contacts[sender] != undefined ? SouNoobYT.contacts[sender].vname || SouNoobYT.contacts[sender].notify : undefined
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				SouNoobYT.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				SouNoobYT.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? SouNoobYT.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : SouNoobYT.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}
			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			let authorname = SouNoobYT.contacts[from] != undefined ? SouNoobYT.contacts[from].vname || SouNoobYT.contacts[from].notify : undefined	
			if (authorname != undefined) { } else { authorname = groupName }	
			
			function addMetadata(packname, author) {	
				if (!packname) packname = 'WABot'; if (!author) author = 'MiguiBot';	
				author = author.replace(/[^a-zA-Z0-9]/g, '');	
				let name = `${author}_${packname}`
				if (fs.existsSync(`./src/stickers/${name}.exif`)) return `./src/stickers/${name}.exif`
				const json = {	
					"sticker-pack-name": packname,
					"sticker-pack-publisher": author,
				}
				const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])	
				const bytes = ['0x00', '0x00', '0x16', '0x00', '0x00', '0x00']	
			
				let len = JSON.stringify(json).length	
				let last	

				if (len > 256) {	
					len = len - 256	
					bytes.unshift(0x01)	
				} else {	
					bytes.unshift(0x00)	
				}	

				if (len < 16) {	
					last = len.toString(16)	
					last = "0" + len	
				} else {	
					last = len.toString(16)	
				}	

				const buf2 = Buffer.from(last, "hex")	
				const buf3 = Buffer.from(bytes)	
				const buf4 = Buffer.from(JSON.stringify(json))	

				const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])	

				fs.writeFile(`./src/stickers/${name}.exif`, buffer, (err) => {	
					return `./src/stickers/${name}.exif`	
				})	

			}
			switch(command) {
		                 case 'lista':
					case 'menu':
				    menuimg = fs.readFileSync('./assets/menuimg.jpg')
					SouNoobYT.sendMessage(from, menuimg, image, {quoted: mek, caption: help(prefix), text})
                    lima = fs.readFileSync('./assets/menuv.mp3');
                    SouNoobYT.sendMessage(from, lima, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
					break
				case 'lista':
					case 'help':
				    menuimg = fs.readFileSync('./assets/help.jpg')
					SouNoobYT.sendMessage(from, menuimg, image, {quoted: mek, caption: help(prefix), text})
                    lima = fs.readFileSync('./assets/menuv.mp3');
                    SouNoobYT.sendMessage(from, lima, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
					break
				case 's':
				case 'fga':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await SouNoobYT.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
						
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								SouNoobYT.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else {
						reply(`Coloque na legenda da ft ${prefix}sticker`)
					}
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					setting.prefix = prefix
					fs.writeFileSync('./src/settings.json', JSON.stringify(setting, null, '\t'))
					reply(`Prefixo mudado para : ${prefix}`)
					break
				case 'membros':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*Chamando todos os membros* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
                                case 'tagall2':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `╠➥ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					reply(teks)
					break
                                case 'tagall3':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `╠➥ https://wa.me/${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					SouNoobYT.sendMessage(from, teks, text, {detectLinks: false, quoted: mek})
					break
				case 'teto':
					if (!isOwner) return reply('✋🏻😟🤚🏻')
					anu = await SouNoobYT.chats.all()
					SouNoobYT.setMaxListeners(25)
					for (let _ of anu) {
						SouNoobYT.deleteChat(_.jid)
					}
					reply('Chats limpos')
					break
				case 'bc':
					if (!isOwner) return reply('Você não é o meu dono')
					if (args.length < 1) return reply('.......')
					anu = await SouNoobYT.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await SouNoobYT.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							SouNoobYT.sendMessage(_.jid, buff, image, {caption: `[SouNoobYT falando]\n\n${body.slice(4)}`})
						}
						reply('Feito')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `[ATENÇÃO]\n\n${body.slice(4)}`)
						}
						reply('Feito')
					}
					break
case 'promover':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admin)
if (!isBotGroupAdmins) return reply(mess.only.Badmin)
if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
if (mentioned.length > 1) {
teks = 'Membro promovido\n'
for (let _ of mentioned) {
teks += `@${_.split('@')[0]}\n`
}
mentions(from, mentioned, true)
SouNoobYT.groupRemove(from, mentioned)
} else {
mentions(`Sucesso: @${mentioned[0].split('@')[0]} Promovido para adm!`, mentioned, true)
SouNoobYT.groupMakeAdmin(from, mentioned)
}
break
										case 'notif':
											SouNoobYT.updatePresence(from, Presence.composing)
											if (!isGroup) return reply(mess.only.group)
											if (!isGroupAdmins) return reply(mess.only.admin)
											teks = body.slice(6)
											group = await SouNoobYT.groupMetadata(from);
											member = group['participants']
											jids = [];
											member.map(async adm => {
												jids.push(adm.id.replace('c.us', 's.whatsapp.net'));
											})
											options = {
												text: teks,
												contextInfo: { mentionedJid: jids },
												quoted: mek
											}
											await SouNoobYT.sendMessage(from, options, text)
											break
				case 'lindo':	
			        case 'feio':
	            	if (args.length < 1) return reply('marque seus amigos!')
					rate = body.slice(1)
					const ti =['4','9','17','28','34','48','59','62','74','83','97','100','29','94','75','82','41','39']
					const kl = ti[Math.floor(Math.random() * ti.length)]
					SouNoobYT.sendMessage(from, 'O quão você é: *'+rate+'*\n\nSua porcentagem😎👉 : '+ kl+'%', text, {pushname})
					break
						case 'fechar':
							SouNoobYT.updatePresence(from, Presence.composing)
							if (!isGroup) return reply(mess.only.group)
							if (!isGroupAdmins) return reply(mess.only.admin)
							if (!isBotGroupAdmins) return reply(mess.only.Badmin)
							var nomor = mek.participant
							const close = {
								text: `O adm @${nomor.split("@s.whatsapp.net")[0]}\nfechou o grupo`,
								contextInfo: { mentionedJid: [nomor] }
							}
							SouNoobYT.groupSettingChange(from, GroupSettingChange.messageSend, true);
							reply(close)
							break
						case 'abrir':
							SouNoobYT.updatePresence(from, Presence.composing)
							if (!isGroup) return reply(mess.only.group)
							if (!isGroupAdmins) return reply(mess.only.admin)
							if (!isBotGroupAdmins) return reply(mess.only.Badmin)
							open = {
								text: `O adm @${sender.split("@")[0]}\nabriu o grupo`,
								contextInfo: { mentionedJid: [sender] }
							}
							SouNoobYT.groupSettingChange(from, GroupSettingChange.messageSend, false)
							SouNoobYT.sendMessage(from, open, text, { quoted: mek })
							break
                                        case 'play':   
					if (isBanned) return reply(nad.baned())
					reply(mess.wait)
					play = body.slice(5)
					anu = await fetchJson(`https://api.zeks.xyz/api/ytplaymp3?q=${play}&apikey=apivinz`)
					if (anu.error) return reply(anu.error)
					infomp3 = `*Achei rsrsrsr*\n\n*Divirta-se!!!*\nTitulo : ${anu.result.title}\nFonte : ${anu.result.source}\nTamanho : ${anu.result.size}\n\n*ESPERE ENVIANDO POR FAVOR, AGUARDE\n\n *MIGUI NO TOPO*`
					buffer = await getBuffer(anu.result.thumbnail)
					 lagu = await getBuffer(anu.result.url_audio)
				     SouNoobYT.sendMessage(from, buffer, image, {quoted: mek, caption: infomp3})
					SouNoobYT.sendMessage(from, lagu, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					  break
                                        case 'yt':
					if (args.length < 1) return reply('Preciso do link!')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Migui está baixando seu Vídeo* 📸`
					thumb = await getBuffer(anu.thumb)
					SouNoobYT.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					SouNoobYT.sendMessage(from, buffer, video, {mimetype: 'video/mp4', filename: `${anu.title}`, quoted: mek})
					break
					case 'tk':
					if (args.length < 1) return reply('Preciso de um link Tik Tok!')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					anu = await fetchJson(`https://api.zeks.xyz/api/tiktok?url=${args[0]}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Migui está baixando seu Tico e Teco* 🤢`
					thumb = await getBuffer(anu.thumb)
					SouNoobYT.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					SouNoobYT.sendMessage(from, buffer, video, {mimetype: 'video/mp4', filename: `${anu.title}`, quoted: mek})
				        case 'demitir':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Membro demitido\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						SouNoobYT.groupRemove(from, mentioned)
					} else {
						mentions(`Sucesso: @${mentioned[0].split('@')[0]} Foi demitido`, mentioned, true)
						SouNoobYT.groupDemoteAdmin(from, mentioned)
					}
					break
					case 'delete':
						case 'del':
							if (!isGroup) return reply(mess.only.group)
							if (!isGroupAdmins) return reply(mess.only.admin)
							SouNoobYT.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
							break
				case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Removendo:\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						SouNoobYT.groupRemove(from, mentioned)
					} else {
						mentions(`Você foi expulso: @${mentioned[0].split('@')[0]}`, mentioned, true)
						SouNoobYT.groupRemove(from, mentioned)
					}
					break
			
                case 'link':
                    if (!isGroup) return reply(mess.only.group)
                    if (!isGroupAdmins) return reply(mess.only.admin)
                    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                    linkgc = await SouNoobYT.groupInviteCode(from)
                    reply('https://chat.whatsapp.com/'+linkgc)
                    break
                case 'sair':
                    if (!isGroup) return reply(mess.only.group)
                    if (isGroupAdmins || isOwner) {
                    	SouNoobYT.groupLeave(from)
                    } else {
                        reply(mess.only.admin)
                    }
                    break
				case 'img':
					if (!isGroup) return reply(mess.only.group)
					if (!isQuotedSticker) return reply('❌ marque um sticker ❌')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await SouNoobYT.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Só sticker sem movimento ❌')
						buffer = fs.readFileSync(ran)
						SouNoobYT.sendMessage(from, buffer, image, {quoted: mek, caption: 'a'})
						fs.unlinkSync(ran)
					})
					break

				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('1 ativar 0 desligar')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('Já ativo')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Ativado com sucesso ✔️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Desativado com sucesso ✔️')
					} else {
						reply('1 para ativar, 0 para desativar')
					}
                                      break
				default:
		if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[WARN]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
