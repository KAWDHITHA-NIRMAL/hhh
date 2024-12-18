// THIS PLUGIN BY Darksadas YT
const config = require('../config');
const { cmd, commands } = require('../command');
const { getBuffer, fetchJson } = require('../lib/functions');

cmd({
    pattern: "movie1",
    alias: ["movi", "tests"],
    use: '.movie <query>',
    react: "🔎",
    desc: "Movie downloader",
    category: "movie",
    filename: __filename

}, async (conn, mek, m, {
    from,
    quoted,
    q,
    reply
}) => {
    try {
        if (!q) return reply('🚩 *Please provide a movie name to search!*');

        let response = await fetchJson(`https://api-vishwa.vercel.app/movie-sinhalasub-search?query=${q}&apikey=alex`);
        const movies = response.data;

        if (movies.length < 1) return await conn.sendMessage(from, { text: "🚩 *No results found!*" }, { quoted: mek });

        const rows = movies.map((movie) => ({
            buttonId: `.infodl1 ${movie.link}`,
            buttonText: { displayText: movie.title },
            type: 1
        }));

        const buttonMessage = {
            image: { url: config.LOGO },
            caption: `*🎥 MOVIE SEARCH 🎥*\n\nResults for "${q}"`,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        };

        return await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '🚩 *Error fetching movie data!*' }, { quoted: mek });
    }
});

cmd({
    pattern: "infodl1",
    alias: ["mdv"],
    use: '.moviedl <url>',
    react: "🎥",
    desc: "Download movies from sinhalasub.lk",
    filename: __filename

}, async (conn, mek, m, {
    from,
    quoted,
    q,
    reply
}) => {
    try {
        if (!q) return reply('🚩 *Please provide a movie URL!*');

        let response = await fetchJson(`https://api-vishwa.vercel.app/movie-sinhalasub-info?url=${q}&apikey=alex`);
        const movieInfo = response;

        if (!movieInfo) return await conn.sendMessage(from, { text: "🚩 *Movie information not found!*" }, { quoted: mek });

        const rows = movieInfo.downloadLinks.map((link) => ({
            buttonId: `.fit ${link.url}±${movieInfo.title} - ${link.quality} - ${link.size}`,
            buttonText: { displayText: `${link.size} - ${link.quality}` },
            type: 1
        }));

        const msg = `*🎥 MOVIE DOWNLOADER 🎥*\n\n` +
            `*Title   ➜* _${movieInfo.title}_\n` +
            `*Release ➜* _${movieInfo.date}_\n` +
            `*Rating  ➜* _${movieInfo.rating}_\n` +
            `*Runtime ➜* _${movieInfo.duration}_\n` +
            `*Director➜* _${movieInfo.author}_\n` +
            `*Country ➜* _${movieInfo.country}_\n`;

        const buttonMessage = {
            image: { url: movieInfo.images[0] || config.LOGO },
            caption: msg,
            footer: config.FOOTER,
            buttons: rows,
            headerType: 4
        };

        return await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '🚩 *Error fetching movie details!*' }, { quoted: mek });
    }
});

cmd({
    pattern: "fit1",
    react: "📥",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, {
    from,
    q,
    reply
}) => {
    try {
        if (!q) return reply('🚩 *Please provide a download link!*');

        const [downloadUrl, fileInfo] = q.split("±");

        const response = await fetchJson(`https://api-vishwa.vercel.app/movie-subz-search?query=${fileInfo}&apikey=alex`);
        const downloadLink = response.downloadLink;

        const msg = `*DOWNLOAD MOVIE*\n\nFile: ${fileInfo}`;
        const buttons = [{
            buttonId: `fitdl ${downloadLink}±${fileInfo}`,
            buttonText: { displayText: "Download Now" },
            type: 1
        }];

        const buttonMessage = {
            image: { url: 'https://telegra.ph/file/091fc81528af5881cdf47.jpg' },
            caption: msg,
            footer: config.FOOTER,
            buttons: buttons,
            headerType: 1
        };

        await conn.buttonMessage(from, buttonMessage, mek);
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '🚩 *Error generating download link!*' }, { quoted: mek });
    }
});
