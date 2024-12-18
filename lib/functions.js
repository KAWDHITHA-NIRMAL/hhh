const axios = require('axios');

/**
 * Fetch buffer from a URL
 * @param {string} url - URL to fetch buffer from
 * @param {Object} [options] - Additional Axios options
 * @returns {Promise<Buffer>}
 */
const getBuffer = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'get',
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1,
            },
            responseType: 'arraybuffer',
            ...options,
        });
        return res.data;
    } catch (e) {
        console.error(`Error fetching buffer from ${url}:`, e);
    }
};

/**
 * Get group admins from participants
 * @param {Array} participants - List of participants
 * @returns {Array} - List of admin IDs
 */
const getGroupAdmins = (participants) => {
    const admins = [];
    for (const participant of participants) {
        if (participant.admin !== null) admins.push(participant.id);
    }
    return admins;
};

/**
 * Generate a random string with extension
 * @param {string} ext - File extension
 * @returns {string}
 */
const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};

/**
 * Format a number into human-readable form (e.g., 1K, 1M)
 * @param {number} value - The number to format
 * @returns {string}
 */
const h2k = (value) => {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    const magnitude = Math.floor(Math.log10(Math.abs(value)) / 3) | 0;
    if (magnitude === 0) return value.toString();
    const scale = Math.pow(10, magnitude * 3);
    const scaled = value / scale;
    let formatted = scaled.toFixed(1);
    if (/\.0$/.test(formatted)) formatted = formatted.slice(0, -2);
    return `${formatted}${suffixes[magnitude]}`;
};

/**
 * Check if a string is a valid URL
 * @param {string} url - The URL string to validate
 * @returns {boolean}
 */
const isUrl = (url) => {
    const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi;
    return regex.test(url);
};

/**
 * Convert a JavaScript object to a formatted JSON string
 * @param {Object} obj - The object to stringify
 * @returns {string}
 */
const Json = (obj) => {
    return JSON.stringify(obj, null, 2);
};

/**
 * Convert seconds to a human-readable runtime format
 * @param {number} seconds - Number of seconds
 * @returns {string}
 */
const runtime = (seconds) => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? `${d} day${d === 1 ? '' : 's'}, ` : '';
    const hDisplay = h > 0 ? `${h} hour${h === 1 ? '' : 's'}, ` : '';
    const mDisplay = m > 0 ? `${m} minute${m === 1 ? '' : 's'}, ` : '';
    const sDisplay = s > 0 ? `${s} second${s === 1 ? '' : 's'}` : '';

    return dDisplay + hDisplay + mDisplay + sDisplay;
};

/**
 * Sleep for a given duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Fetch JSON data from a URL
 * @param {string} url - URL to fetch JSON from
 * @param {Object} [options] - Additional Axios options
 * @returns {Promise<Object>}
 */
const fetchJson = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'GET',
            url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
            },
            ...options,
        });
        return res.data;
    } catch (err) {
        console.error(`Error fetching JSON from ${url}:`, err);
        throw err;
    }
};

module.exports = {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
};
