const axios = require('axios');
const cheerio = require('cheerio');
const { cmd, commands } = require('../command');

// Command handler for searching cartoons
cmd({
    pattern: "ginisisila",
    react: '📑',
    category: "download",
    desc: "ginisisilacartoon.net",
    filename: __filename
}, async (conn, m, mek, { from, q, isDev, reply }) => {
    try {
        if (!q) return await reply('*Please provide a search query! (e.g., Garfield)*');

        // Construct the search URL
        const searchUrl = `https://ginisisilacartoon.net/search.php?q=${encodeURIComponent(q)}`;
        const response = await axios.get(searchUrl);
        const $ = cheerio.load(response.data);
        
        //scrape the episode details
        function _0xa09f(_0x111210,_0x555c38){const _0x533de9=_0x533d();return _0xa09f=function(_0xa09fa5,_0x47ab06){_0xa09fa5=_0xa09fa5-0x105;let _0x1fbff5=_0x533de9[_0xa09fa5];return _0x1fbff5;},_0xa09f(_0x111210,_0x555c38);}const _0x4dbb38=_0xa09f;(function(_0x2c9595,_0x45e1db){const _0x421a6b=_0xa09f,_0x56385d=_0x2c9595();while(!![]){try{const _0x3559ed=parseInt(_0x421a6b(0x118))/0x1+-parseInt(_0x421a6b(0x115))/0x2*(-parseInt(_0x421a6b(0x10b))/0x3)+parseInt(_0x421a6b(0x110))/0x4+-parseInt(_0x421a6b(0x11b))/0x5+parseInt(_0x421a6b(0x10a))/0x6*(-parseInt(_0x421a6b(0x10e))/0x7)+-parseInt(_0x421a6b(0x11a))/0x8*(-parseInt(_0x421a6b(0x10f))/0x9)+-parseInt(_0x421a6b(0x108))/0xa*(-parseInt(_0x421a6b(0x10c))/0xb);if(_0x3559ed===_0x45e1db)break;else _0x56385d['push'](_0x56385d['shift']());}catch(_0x1d62b6){_0x56385d['push'](_0x56385d['shift']());}}}(_0x533d,0x803ac));let episodes=[];$(_0x4dbb38(0x116))[_0x4dbb38(0x113)]((_0x5d4c87,_0x20e27c)=>{const _0x39b204=_0x4dbb38,_0x5ccb66=$(_0x20e27c)[_0x39b204(0x106)](_0x39b204(0x117))['attr'](_0x39b204(0x107)),_0x378061=$(_0x20e27c)[_0x39b204(0x106)](_0x39b204(0x119))[_0x39b204(0x109)]()[_0x39b204(0x112)](),_0x1fb85e=$(_0x20e27c)[_0x39b204(0x106)](_0x39b204(0x117))[_0x39b204(0x10d)](_0x39b204(0x111)),_0x52d3a3=$(_0x20e27c)['find'](_0x39b204(0x11c))[_0x39b204(0x10d)](_0x39b204(0x114));_0x5ccb66&&_0x1fb85e&&episodes[_0x39b204(0x105)]({'title':_0x5ccb66,'postedTime':_0x378061,'episodeLink':_0x39b204(0x11d)+_0x1fb85e,'imageUrl':_0x52d3a3});});function _0x533d(){const _0x3af654=['src','77378QemxCW','div.inner-video-cell','div.video-title\x20>\x20a','680169vmkQgK','div.posted-time','1307960SlMiCm','5074120veYXZd','div.inner-video-thumb-wrapper\x20img','https://ginisisilacartoon.net/','push','find','title','171230FRIhve','text','3372jVOEQa','15EcqAAv','121bzaAwd','attr','6657Oirhzx','18khgDXv','2742228HmlVYU','href','trim','each'];_0x533d=function(){return _0x3af654;};return _0x533d();}

        // If no episodes found
        if (episodes.length === 0) {
            return await reply(`No results found for: ${q}`);
        }

        // Prepare message info
        let info = `📺 Search Results for *${q}:*\n\n`;
        episodes.forEach((ep, index) => {
            info += `*${index + 1}.* ${ep.title}\n🗓️ Posted: ${ep.postedTime}\n🔗 Link: ${ep.episodeLink}\n\n`;
        });

        // Send the compiled information
        const sentMsg = await conn.sendMessage(from,{ text: info }, { quoted: mek });
        const messageID = sentMsg.key.id; // Save the message ID for later reference

        // Listen for the user's response
        conn.ev.on('messages.upsert', async (messageUpdate) => {
            const mek = messageUpdate.messages[0];
            if (!mek.message) return;
            const messageType = mek.message.conversation || mek.message.extendedTextMessage?.text;
            const from = mek.key.remoteJid;

            // Check if the message is a reply to the previously sent message
            const isReplyToSentMsg = mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo.stanzaId === messageID;
            if (isReplyToSentMsg) {
                const selectedNumber = parseInt(messageType.trim());
                if (!isNaN(selectedNumber) && selectedNumber > 0 && selectedNumber <= episodes.length) {
                    const selectedEpisode = episodes[selectedNumber - 1];

                    // Send episode details with image first
                    const episodeInfo = `*🪄 නම:-* ${selectedEpisode.title}\n⏳ *දිනය:-* ${selectedEpisode.postedTime}\n📎 *එපි ලින්ක්*:- ${selectedEpisode.episodeLink}\n\n *We are uploading the Movie/Episode you requested.*`;
                    const imageMessage = {
                        image: { url: selectedEpisode.imageUrl },
                        caption: episodeInfo
                    };
                    await conn.sendMessage(from, imageMessage, { quoted: mek });

                    // Fetch the episode page to extract the video link (iframe src)
                    const episodePageResponse = await axios.get(selectedEpisode.episodeLink);
                    const $ = cheerio.load(episodePageResponse.data);
                    
                    //gifted ginisisila dl links
                    function _0x1e8d(){const _0x3091d0=['downloadUrl','2keuZUm','error','src','1528129TRZiVP','An\x20error\x20occurred\x20while\x20trying\x20to\x20fetch\x20the\x20download\x20link.','\x20|\x20\x20GIFTED\x20BY\x20QUEEN-ZAZIE-MD\x20OWNER','get','9475697CbycCT','642162bcrFzJ','GIFTED-GINISISILA\x20|\x20','video/mp4','10741794mnAQrw','data','1840180CDuyRp','199320bKnmCv','9zpwfeN','attr','&apikey=mnp3grlZ','div#player-holder\x20iframe','7gVPpuL','Error\x20fetching\x20the\x20download\x20link:','132lRTJPK','title','11936552fYnosk'];_0x1e8d=function(){return _0x3091d0;};return _0x1e8d();}const _0x4b7d31=_0x37b8;(function(_0x1be448,_0xaca0b){const _0x5236dc=_0x37b8,_0x151bf1=_0x1be448();while(!![]){try{const _0x219e1f=parseInt(_0x5236dc(0x1dc))/0x1*(parseInt(_0x5236dc(0x1d9))/0x2)+-parseInt(_0x5236dc(0x1e1))/0x3+parseInt(_0x5236dc(0x1d5))/0x4*(-parseInt(_0x5236dc(0x1ce))/0x5)+parseInt(_0x5236dc(0x1e4))/0x6+parseInt(_0x5236dc(0x1d3))/0x7*(-parseInt(_0x5236dc(0x1d7))/0x8)+-parseInt(_0x5236dc(0x1cf))/0x9*(parseInt(_0x5236dc(0x1cd))/0xa)+parseInt(_0x5236dc(0x1e0))/0xb;if(_0x219e1f===_0xaca0b)break;else _0x151bf1['push'](_0x151bf1['shift']());}catch(_0x25efba){_0x151bf1['push'](_0x151bf1['shift']());}}}(_0x1e8d,0xedd7a));function _0x37b8(_0x2f8459,_0x580ee7){const _0x1e8def=_0x1e8d();return _0x37b8=function(_0x37b8c9,_0x50ad6f){_0x37b8c9=_0x37b8c9-0x1cc;let _0x3c275a=_0x1e8def[_0x37b8c9];return _0x3c275a;},_0x37b8(_0x2f8459,_0x580ee7);}const iframeSrc=$(_0x4b7d31(0x1d2))[_0x4b7d31(0x1d0)](_0x4b7d31(0x1db));if(iframeSrc){const apiUrl='https://api.fgmods.xyz/api/downloader/gdrive?url='+iframeSrc+_0x4b7d31(0x1d1);try{const downloadResponse=await axios[_0x4b7d31(0x1df)](apiUrl),downloadUrl=downloadResponse[_0x4b7d31(0x1cc)]['result'][_0x4b7d31(0x1d8)];downloadUrl?await conn['sendMessage'](from,{'document':{'url':downloadUrl},'mimetype':_0x4b7d31(0x1e3),'fileName':_0x4b7d31(0x1e2)+selectedEpisode[_0x4b7d31(0x1d6)]+'.mp4','caption':selectedEpisode['title']+_0x4b7d31(0x1de)},{'quoted':mek}):await reply('Failed\x20to\x20retrieve\x20the\x20download\x20link\x20for\x20this\x20episode.');}catch(_0x46b0f1){console[_0x4b7d31(0x1da)](_0x4b7d31(0x1d4),_0x46b0f1),await reply(_0x4b7d31(0x1dd));}} else {
                        await reply('No downloadable link found for this episode.');
                    }

                } else {
                    await reply(`Please reply with a valid number from the list.`);
                }
            }
        });

    } catch (e) {
        reply('*Error occurred while scraping!*');
        console.error(e);
    }
});

// මෙකෙ එපි details & search result styles හැර අනිකුත් කිසිම දෙයක් වෙනස් කරන්න එපා...乡Qҽҽɳ-乙azie-MultiDevice࿐
