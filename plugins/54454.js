const axios = require('axios');
const { cmd } = require('../command'); 

cmd({
    pattern: "movie2", 
    react: "🎥",  
    desc: "movie search",
    category: "movie",
    filename: __filename,
}, async (conn, mek, m, { from, args, reply }) => {
    try {
       
        const movieName = args.join(" ");
        if (!movieName) {
            return reply("නමක් දිපන් හුත්තො 😂");
        }

        // API endpoint 
        const apiUrl = https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(movieName)};
        
        // API request 
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.status || !data.result || data.result.data.length === 0) {
            return reply(⚠️ *${movieName}* Not founde .);
        }

        
        const movie = data.result.data[0];

        // Reply message 
        const message = 🎬 *${movie.title}*\n\n +
                        ⭐ *IMDb:* ${movie.imdb || "N/A"}\n +
                        🗓 *Year:* ${movie.year}\n +
                        🖇️ *URL:* ${movie.link}\n`;

     
        const posterUrl = movie.image;

        if (posterUrl) {
            await conn.sendMessage(from, {
                image: { url: posterUrl },
                caption: message,
            }, { quoted: mek });
        } else {
            await reply(message);
        }
    } catch (error) {
        console.error("Movie Command Error:", error);
        await reply("Eror!!.");
    }
});
