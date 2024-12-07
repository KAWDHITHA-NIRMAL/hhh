const { cmd } = require("../command");
const axios = require("axios");

cmd(
    {
        pattern: "tvshow",
        alias: ["tvdetails"],
        desc: "Get details of a TV show from CineSub.",
        category: "Entertainment",
        react: "📺",
        use: ".tvshow <url>",
        filename: __filename,
    },
    async (conn, mek, m, { from, args, reply }) => {
        try {
            // Validate input
            if (!args[0]) {
                return reply(
                    "Please provide a valid TV show URL from CineSub. Example:\n.tvshow <url>"
                );
            }

            const apiUrl = "https://api-vishwa.vercel.app/cinesub-tvshow-details";
            const apiKey = "kevin";
            const tvShowUrl = args[0];

            // Fetch TV show details
            const response = await axios.get(apiUrl, {
                params: { url: tvShowUrl, apikey: apiKey },
            });

            // Check if the response is valid
            if (!response.data?.status) {
                return reply(
                    "Failed to fetch TV show details. Please ensure the URL is correct and try again."
                );
            }

            const { title, description, releaseDate, genres, cast, image } =
                response.data.result;

            // Format the TV show details
            const detailsMessage = `
📺 *TV Show Details:*

🎬 *Title:* ${title ?? "N/A"}
📅 *Release Date:* ${releaseDate ?? "N/A"}
🎭 *Genres:* ${
                genres?.length > 0 ? genres.join(", ") : "N/A"
            }
👨‍🎤 *Cast:* ${
                cast?.length > 0 ? cast.join(", ") : "N/A"
            }

📝 *Description:* 
${description ?? "N/A"}

🔗 *Source:* ${tvShowUrl}

*POWERED BY CINESUB*
`;

            // Send TV show details along with the image
            await conn.sendMessage(from, {
                image: { url: image ?? "https://via.placeholder.com/300x400" },
                caption: detailsMessage,
            });
        } catch (error) {
            console.error(error);
            reply(`An error occurred: ${error.message}`);
        }
    }
);
