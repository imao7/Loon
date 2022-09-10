[Script]
http-response ^https:\/\/api\.(.+)\.(com|net)\/v1\/user\/(info|promote/info) script-path=http://ox.xmkczs.com/quantumultX/plpl.js, requires-body=true, timeout=10, enabled=false, tag=啪哩啪哩解锁会员
cron "0 0/30 8-22 * * ?" script-path=https://raw.githubusercontent.com/I-am-R-E/Functional-Store-Hub/Master/PixivShow/Script/PixivShow.js, tag=PixivShow, img-url=https://raw.githubusercontent.com/I-am-R-E/Functional-Store-Hub/Master/Files/PixivShowICON.png
http-response ^https?:\/\/.*\.com\/api\/app\/user\/info$ script-path=https://raw.githubusercontent.com/yqc007/QuantumultX/master/PornComicsCrack.js, requires-body=true, timeout=10, tag=欲漫涩解锁会员漫画
http-request ^https?:\/\/.*\.com\/api\/app\/media script-path=https://raw.githubusercontent.com/yqc007/QuantumultX/master/PornVideosCrack.js, timeout=10, tag=欲漫涩解锁会员视频
http-response ^https://nz-api.duitang.com/account/me script-path=https://raw.githubusercontent.com/Didiao123456/Loon/master/naiyou.js?token=GHSAT0AAAAAABYTOF4QKBZNASNUFO3DSHRSYY4JYMA, requires-body=true, timeout=10, tag=奶由壁纸VIP
http-response ^https?:\/\/mb3admin.com\/admin\/service\/registration\/validateDevice script-path=https://raw.githubusercontent.com/rartv/SurgeScript/main/EmbyPremiere/EmbyPremiere.js, requires-body=true, timeout=10, tag=EmbyPremiere
http-response ^https?:\/\/i.\.hdslb\.com\/bfs\/subtitle\/.+\.json$ script-path=bilibilicc.js, requires-body=true, timeout=10, tag=哔哩哔哩CC字幕繁体转简体
http-response ^https:\/\/ap(p|i)\.bilibili\.com\/((pgc\/player\/api\/playurl)|(x\/v2\/account\/myinfo\?)|(x\/v2\/account/mine\?)) script-path=https://raw.githubusercontent.com/Sunert/Script/master/Script/Bilibili/BiliHD.js, requires-body=true, timeout=10, tag=哔哩哔哩番剧开启1080P+, img-url=https://raw.githubusercontent.com/Orz-3/face/master/Bili.png
[MITM]
hostname = *,mb3admin.com,%APPEND%,nz-api.duitang.com,tqrbq.mpckv.com,opzzy.kefsww.com,xnour.xonap.com,zjgeo.eqobc.com,mb3admin.com,*.byteoversea.com,*.hdslb.com,api.bilibili.com,app.bilibili.com,%APPEND% *.media.dssott.com,*.media.starott.com,*.api.hbo.com,*.hbomaxcdn.com,*.huluim.com,*.nflxvideo.net,*.cbsaavideo.com,*.cbsivideo.com,*.cloudfront.net,*.akamaihd.net,*.avi-cdn.net,*.youtube.com,api.*.com,api.*.net
