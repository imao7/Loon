/****************************
引用地址：https://raw.githubusercontent.com/chengkongyiban/Loon/main/js/QX_to_Loon.js

说明
   t&zd; = {  , }  花括号中的逗号
原脚本作者@小白脸 脚本修改@chengkongyiban
感谢@xream 的指导
插件图标用的 @Keikinn 的 StickerOnScreen项目，感谢

***************************/
const ua = $request.headers['User-Agent'] || $request.headers['user-agent']
const isStashiOS = 'undefined' !== typeof $environment && $environment['stash-version'] && ua.indexOf('Macintosh') === -1
const isSurgeiOS = 'undefined' !== typeof $environment && $environment['surge-version'];
const isShadowrocket = 'undefined' !== typeof $rocket;
const isLooniOS = 'undefined' != typeof $loon && /iPhone/.test($loon);

var name = "";
var desc = "";
let req = $request.url.replace(/qx$|qx\?.*/,'');
let urlArg = $request.url.replace(/.+qx(\?.*)/,'$1');
var original = [];//用于获取原文行号
//获取参数
var nName = urlArg.indexOf("n=") != -1 ? (urlArg.split("n=")[1].split("&")[0].split("+")) : null;
var Pin0 = urlArg.indexOf("y=") != -1 ? (urlArg.split("y=")[1].split("&")[0].split("+")).map(decodeURIComponent) : null;
var Pout0 = urlArg.indexOf("x=") != -1 ? (urlArg.split("x=")[1].split("&")[0].split("+")).map(decodeURIComponent) : null;
var iconStatus = urlArg.indexOf("i=") != -1 ? false : true;
var icon = "";
//修改名字和简介
if (nName === null){
    name = req.match(/.+\/(.+)\.(conf|js|snippet|txt)/)?.[1] || '无名';
    desc = name;
}else{
    name = nName[0] != "" ? nName[0] : req.match(/.+\/(.+)\.(conf|js|snippet|txt)/)?.[1];
    desc = nName[1] != undefined ? nName[1] : nName[0];
};
name = "#!name=" + decodeURIComponent(name);
desc = "#!desc=" + decodeURIComponent(desc);

//随机图标开关，不传入参数默认为开
if (iconStatus === false){
    icon = "#!icon=";
}else{
    const stickerStartNum = 1000;
const stickerSum = 335;
let randomStickerNum = parseInt(stickerStartNum + Math.random() * stickerSum).toString();
   icon = "#!icon=" + "https://raw.githubusercontent.com/chengkongyiban/StickerOnScreen/main/Stickers/Sticker_" + randomStickerNum +".png";
};

!(async () => {
  let body = await http(req);
//判断是否断网
if(body == null){if(isSurgeiOS || isStashiOS){
    $notification.post("重写转换：未获取到body","请检查网络及节点是否畅通","认为是bug?点击通知反馈",{url:"https://t.me/zhangpeifu"})
 $done({ response: { status: 404 ,body:{} } });}else{$notification.post("重写转换：未获取到body","请检查网络及节点是否畅通","认为是bug?点击通知反馈","https://t.me/zhangpeifu")
 $done({ response: { status: 404 ,body:{} } });
}//识别客户端通知
}else{//以下开始重写及脚本转换

original = body.replace(/^ *(#|;|\/\/)/g,'#').replace(/\x20+url\x20+/g," url ").replace(/(^[^#].+)\x20+\/\/.+/g,"$1").split("\n");
    body = body.match(/[^\r\n]+/g);
    
let script = [];
let URLRewrite = [];
let others = [];//不支持的内容
let MITM = "";

body.forEach((x, y, z) => {
    x = x.replace(/^ *(#|;|\/\/)/,'#').replace(/\x20+url\x20+/," url ").replace(/hostname\x20*=/,"hostname=").replace(/(^[^#].+)\x20+\/\/.+/,"$1");
    let type = x.match(
        /\x20url\x20script-|enabled=|\x20url\x20reject|\x20echo-response\x20|\-header\x20|^hostname| url 30|\x20(request|response)-body/
    )?.[0];

//去掉注释
if(Pin0 != null)    {
    for (let i=0; i < Pin0.length; i++) {
  const elem = Pin0[i];
    if (x.indexOf(elem) != -1){
        x = x.replace(/^#/,"")
    }else{};
};//循环结束
}else{};//去掉注释结束

//增加注释
if(Pout0 != null){
    for (let i=0; i < Pout0.length; i++) {
  const elem = Pout0[i];
    if (x.indexOf(elem) != -1 && x.indexOf("hostname=") == -1){
        x = x.replace(/(.+)/,"#$1")
    }else{};
};//循环结束
}else{};//增加注释结束
    
//判断注释
    
    if (x.match(/^[^#]/)){
    var noteK = "";
    }else{
    var noteK = "#";
    };
    
    if (type) {
        switch (type) {
            case " url script-":
//脚本                            
                z[y - 1]?.match(/^#/) && script.push(z[y - 1]);
                let sctype = x.match(' script-response') ? 'response' : 'request';
                
                let rebody = x.match(/\x20script[^\s]*(-body|-analyze)/) ? ', requires-body=true' : '';
                
                let urlInNum = x.replace(/\x20{2,}/g," ").split(" ").indexOf("url");
                
                let ptn = x.replace(/\x20{2,}/g," ").split(" ")[urlInNum - 1].replace(/^#/,"");
                
                let js = x.replace(/\x20{2,}/g," ").split(" ")[urlInNum + 2];
                
                let proto = js.match('proto.js') ? ', binary-body-mode=true' : '';
                
                let scname = js.substring(js.lastIndexOf('/') + 1, js.lastIndexOf('.') );
                
                script.push(
                        `${noteK}http-${sctype} ${ptn} script-path=${js}${rebody}${proto}, tag=${scname}_${y}`
                );
                break;
                
//定时任务

            case "enabled=":
                z[y - 1]?.match(/^#/) && script.push(z[y - 1]);
                
                let cronExp = x.replace(/\x20{2,}/g," ").split(" http")[0].replace(/#/,'');
                
                let cronJs = x.split("://")[1].split(",")[0].replace(/(.+)/,'https://$1');
                
                let croName = x.replace(/\x20/g,"").split("tag=")[1].split(",")[0];
                
                script.push(
                        `${noteK}cron "${cronExp}" script-path=${cronJs}, timeout=60, tag=${croName}`
                );
                break;
                
//reject                

            case " url reject":

                z[y - 1]?.match(/^#/) && URLRewrite.push(z[y - 1]);
                URLRewrite.push(x.replace(/\x20{2,}/g," ").replace(/(^#)?(.*?)\x20url\x20(reject-200|reject-img|reject-dict|reject-array|reject)/, `${noteK}$2 - $3`));
                break;
                
//(request|response)-header
            case "-header ":
                z[y - 1]?.match(/^#/) && script.push(z[y - 1]);
                
                let reHdType = x.match(' response-header ') ? 'response' : 'request';
                
                let reHdPtn = x.replace(/\x20{2,}/g," ").split(" url re")[0].replace(/^#/,"");
                
                let reHdArg1 = x.split(" " + reHdType + "-header ")[1];
                
                let reHdArg2 = x.split(" " + reHdType + "-header ")[2];
                
                script.push(`${noteK}http-${reHdType} ${reHdPtn} script-path=https://raw.githubusercontent.com/xream/scripts/main/surge/modules/replace-header/index.js, tag=replaceHeader_${y}, argument="${reHdArg1}->${reHdArg2}"`);         
                break;
                
            case " echo-response ":
            
                let arg = x.split(" echo-response ")[2];
            
            if(/^(https?|ftp|file):\/\/.*/.test(arg)){
                
                z[y - 1]?.match(/^#/) && script.push(z[y - 1]);
                
                let urlInNum = x.replace(/\x20{2,}/g," ").split(" ").indexOf("url");
                
                let ptn = x.replace(/\x20{2,}/g," ").split(" ")[urlInNum - 1].replace(/^#/,"");
                
                let scname = arg.substring(arg.lastIndexOf('/') + 1, arg.lastIndexOf('.') );
                
                script.push(
                    `${noteK}http-request ${ptn} script-path=https://raw.githubusercontent.com/xream/scripts/main/surge/modules/echo-response/index.js, tag=${scname}_${y}, argument=type=text/json&url=${arg}`)
                
            }else{
let lineNum = original.indexOf(x) + 1;
others.push(lineNum + "行" + x)}
            
                break;

//mitm
            case "hostname":
                MITM = x.replace(/%.*%/g," ").replace(/\x20/g,"").replace(/hostname=(.*)/, `[MITM]\n\nhostname = $1`).replace(/,$/,"");
                break;
                
//302/307       
                
            case " url 30":
            
                z[y - 1]?.match(/^#/) && URLRewrite.push(z[y - 1]);
                    URLRewrite.push(x.replace(/\x20{2,}/g," ").replace(/(^#)?(.*?)\x20url\x20(302|307)\x20(.+)/, `${noteK}$2 $4 $3`));
                break;
        
            default:
//带参数脚本                 

                    z[y - 1]?.match(/^#/) && script.push(z[y - 1]);
                
                let reBdType = x.match(' response-body ') ? 'response' : 'request';
                
                let reBdPtn = x.replace(/\x20{2,}/g," ").split(" url re")[0].replace(/^#/,"");
                let reBdArg1 = x.split(" " + reBdType + "-body ")[1];
                
                let reBdArg2 = x.split(" " + reBdType + "-body ")[2];
                    
                    script.push(
                            `${noteK}http-${reBdType} ${reBdPtn} script-path=https://raw.githubusercontent.com/mieqq/mieqq/master/replace-body.js, requires-body=true, tag=replaceBody_${y}, argument="${reBdArg1}->${reBdArg2}"`,
                    );
                }
        } //switch结束
    
}); //循环结束



script = (script[0] || '') && `[Script]\n\n${script.join("\n\n")}`;

URLRewrite = (URLRewrite[0] || '') && `[Rewrite]\n\n${URLRewrite.join("\n")}`;

others = (others[0] || '') && `${others.join("\n\n")}`;

body = `${name}
${desc}
${icon}


${URLRewrite}


${script}


${MITM}`
        .replace(/t&zd;/g,',')
        .replace(/(#.+\n)\n+/g,'$1')
        .replace(/\n{2,}/g,'\n\n')
        
if (isSurgeiOS || isStashiOS) {
           others !="" && $notification.post("不支持的类型已跳过","第" + others,"点击查看原文，长按可展开查看跳过行",{url:req});
        } else {if (isLooniOS || isShadowrocket) {
       others !="" && $notification.post("不支持的类型已跳过","第" + others,"点击查看原文，长按可展开查看跳过行",req);}};

 $done({ response: { status: 200 ,body:body ,headers: {'Content-Type': 'text/plain; charset=utf-8'} } });
}//判断是否断网的反括号


})()
.catch((e) => {
        $notification.post(`${e}`,'','');
        $done()
    })

function http(req) {
  return new Promise((resolve, reject) =>
    $httpClient.get(req, (err, resp,data) => {
  resolve(data)
  })
)
}