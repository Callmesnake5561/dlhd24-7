const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const DLHD_URL = "https://dlhd.st/24-7-channels.php";
const EPG_URL = "https://epg.iptv-org.com/epg.xml.gz";

async function generatePlaylist() {
    try {
        const { data } = await axios.get(DLHD_URL);

        let playlist = `#EXTM3U url-tvg="${EPG_URL}"\n\n`;

        // DLHD uses: onclick="window.open('STREAM_URL','_blank')"
        const regex = /window\.open\(['"](.+?\.m3u8)['"]/g;
        let match;

        while ((match = regex.exec(data)) !== null) {
            const url = match[1].trim();

            // Extract name from URL
            const nameMatch = url.match(/\/([^\/]+)\.m3u8/);
            const rawName = nameMatch ? nameMatch[1] : "DLHD Channel";

            const cleanName = rawName.replace(/_/g, " ").trim();
            const tvgId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");

            playlist += `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${cleanName}" group-title="DLHD 24/7", ${cleanName}\n`;
            playlist += `${url}\n\n`;
        }

        fs.writeFileSync("playlist.m3u", playlist);
        console.log("Playlist updated successfully.");
    } catch (err) {
        console.error("Error generating playlist:", err);
    }
}

generatePlaylist();
