const { cmd, commands } = require("../command");
const axios = require("axios");

cmd(
    {
        pattern: "ada",
        alias: ["adanews"],
        desc: "Get the latest Ada news.",
        category: "News",
        react: "📰",
        use: ".ada",
        filename: __filename,
    },
    async (conn, mek, m, { from, reply }) => {
        try {
            const apiUrl = "https://ada-derana-news-api-two.vercel.app";

            // Fetch the news data
            const response = await axios.get(apiUrl);

            // Check the API response status
            if (!response.data.status) {
                return reply(
                    "Failed to fetch the latest Ada news. Please try again later.",
                );
            }

            // Destructure the response data
            const { title, image, date, time, url, desc } =
                response.data.result;

            // Format the news message
            const newsMessage = `📰 *${title}*\n\n${description}\n\n*📅 Date:* ${time}\n🔗 From(${creator})`;

            // Send the news message along with the image
            await conn.sendMessage(from, {
                image: { url: image },
                caption: newsMessage,
            });
        } catch (e) {
            console.error(e);
            reply(`An error occurred: ${e.message}`);
        }
    },
);
