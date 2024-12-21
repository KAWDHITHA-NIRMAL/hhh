const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

// Simple Movie Search and Download Command
cmd({
    pattern: "movieka",
    desc: "Search and download movies with Sinhala subtitles",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return await reply("🚩 *Please provide a movie name!*");

        // Search for the movie on Sinhalasub
        const searchUrl = `https://darksadas-yt-sinhalasub-search.vercel.app/?q=${q}`;
        const searchResult = await fetchJson(searchUrl);

        if (!searchResult.data || searchResult.data.length === 0) {
            return await reply('🚩 *No results found for the movie!*');
        }

        const movie = searchResult.data[0]; // Get the first movie result
        let movieInfo = `🎬 *MOVIE INFO* 🎬\n\n`;
        movieInfo += `🎬 Title: ${movie.Title}\n`;
        movieInfo += `🎬 Year: ${movie.Year}\n`;
        movieInfo += `🎬 Genre: ${movie.Genre}\n`;
        movieInfo += `🎬 Link: ${movie.Link}\n`;

        // Send the movie info and thumbnail
        await conn.sendMessage(from, { image: { url: movie.Image }, caption: movieInfo }, { quoted: mek });

        // Fetch movie details (using the movie URL from Sinhalasub)
        const movieDetailsUrl = `https://darksadas-yt-sinhalasub-info-dl.vercel.app/?url=${movie.Link}`;
        const movieDetails = await fetchJson(movieDetailsUrl);

        if (!movieDetails || !movieDetails.downloadLinks || movieDetails.downloadLinks.length === 0) {
            return await reply('🚩 *No download links found for this movie!*');
        }

        // Display the download options
        let downloadMessage = `🎬 *DOWNLOAD OPTIONS* 🎬\n\n`;
        movieDetails.downloadLinks.forEach((link, index) => {
            downloadMessage += `🔹 Quality: ${link.quality}\n`;
            downloadMessage += `🔹 Size: ${link.size}\n`;
            downloadMessage += `🔹 Download Link: ${link.link}\n\n`;
        });

        // Send the download options
        await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: '🚩 *Error occurred while processing your request!*' }, { quoted: mek });
    }
});
