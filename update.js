const fs = require("fs");
const axios = require("axios");

const API_URL = "https://dlhd.st/api.php";
const EPG_URL = "https://epg.iptv-org.com/epg.xml.gz";

async function generatePlaylist() {
    try {
        const { data } = await axios.get(API_URL);

        let playlist = `#EXTM3U url-tvg="${EPG_URL}"\n\n`;

        data.forEach(channel => {
            const name = channel.name.trim();
            const url = channel.url.trim();

            const tvgId = name.toLowerCase().replace(/[^a-z0-9]/g, "");

            playlist += `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${name}" group-title="DLHD 24/7", ${name}\n`;
            playlist += `${url}\n\n`;
        });

        fs.writeFileSync("playlist.m3u", playlist);
        console.log("Playlist updated successfully.");
    } catch (err) {
        console.error("Error generating playlist:", err);
    }
}

generatePlaylist();
