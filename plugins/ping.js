const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

// Movie Search Command
cmd({
    pattern: "kawwa",
    alias: ["movi", "moviesearch"],
    use: '.movie <query>',
    react: "🔎",
    desc: "Search for Sinhala-subtitled movies.",
    category: "movie",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('🚩 *Please provide a movie name!*');

        const searchUrl = `https://darksadas-yt-sinhalasub-search.vercel.app/?q=${q}`;
        const searchResult = await fetchJson(searchUrl);

        if (!searchResult.data || searchResult.data.length === 0) {
            return await conn.sendMessage(from, { text: "🚩 *I couldn't find anything!*" }, { quoted: mek });
        }

        const msg = `*🎥 MOVIE SEARCH 🎥*\n\n*Results found for:* _${q}_`;
        const rows = searchResult.data.map((movie) => ({
            buttonId: `.infodl ${movie.Link}`,
            buttonText: { displayText: `${movie.Title}` },
            type: 1
        }));

        const buttonMessage = {
            image: { url: config.LOGO },
            caption: msg,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        };
        return await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred while searching!*' }, { quoted: mek });
    }
});

// Movie Info and Download Command
cmd({
    pattern: "infodl",
    alias: ["moviedl"],
    use: '.infodl <url>',
    react: "🎥",
    desc: "Get movie details and download links.",
    category: "movie",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, prefix }) => {
    try {
        if (!q) return await reply('🚩 *Please provide a movie URL!*');

        const infoUrl = `https://darksadas-yt-sinhalasub-info-dl.vercel.app/?url=${q}`;
        const movieDetails = await fetchJson(infoUrl);

        if (!movieDetails || !movieDetails.downloadLinks || movieDetails.downloadLinks.length === 0) {
            return await conn.sendMessage(from, { text: "🚩 *No download links found!*" }, { quoted: mek });
        }

        const msg = `
*🎥 MOVIE DETAILS 🎥*

*Title:* ${movieDetails.title}
*Release Date:* ${movieDetails.date}
*Rating:* ${movieDetails.rating}
*Runtime:* ${movieDetails.duration}
*Director:* ${movieDetails.author}
*Country:* ${movieDetails.country}
        `;

        const rows = movieDetails.downloadLinks.map((link) => ({
            buttonId: `${prefix}mn ${link.link}±${movieDetails.title} - ${link.quality} - ${link.size}`,
            buttonText: { displayText: `${link.size} - ${link.quality}` },
            type: 1
        }));

        const buttonMessage = {
            image: { url: movieDetails.images[0] || config.LOGO },
            caption: msg,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        };
        return await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred while fetching details!*' }, { quoted: mek });
    }
});

// File Download Command
cmd({
    pattern: "mn",
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('🚩 *Please provide valid input!*');

        const [url, details] = q.split("±");
        const downloadData = await fetchJson(`https://darksadas-yt-sinhalasub-dl.vercel.app/?url=${url}`);

        if (!downloadData || !downloadData.downloadLink) {
            return await conn.sendMessage(from, { text: '🚩 *Download failed!*' }, { quoted: mek });
        }

        const downloadLink = `https://pixeldrain.com/api/file/${downloadData.downloadLink.split("https://pixeldrain.com/u/")[1]}`;
        const buttons = [
            { buttonId: `.fit ${downloadLink}±${details}`, buttonText: { displayText: "Download Now" }, type: 1 }
        ];

        const msg = `*Download available:*\n\n${details}`;
        const buttonMessage = {
            caption: msg,
            footer: config.FOOTER,
            buttons,
            headerType: 1
        };
        return await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
        console.error(e);
        reply('🚩 *Error occurred while processing download!*');
    }
});

// Final File Sending
cmd({
    pattern: "fit",
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply('🚩 *Invalid download request!*');

        const [url, details] = q.split("±");
        const response = await fetch(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(await response.arrayBuffer());

        const message = {
            document: buffer,
            mimetype: "video/mp4",
            fileName: `${details}.mp4`,
            caption: `🎬 *${details}*\n\n*Download complete!*`
        };

        await conn.sendMessage(from, message);
    } catch (e) {
        console.error(e);
        reply('🚩 *Error occurred while downloading the file!*');
    }
});
