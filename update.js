const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const DLHD_URL = "https://dlhd.st/24-7-channels.php";
const EPG_URL = "https://epg.iptv-org.com/epg.xml.gz";

async function generatePlaylist() {
    try {
        const { data } = await axios.get(DLHD_URL);
        const $ = cheerio.load(data);

        let playlist = "#EXTM3U url-tvg=\"" + EPG_URL + "\"\n\n";

        $("a").each((i, el) => {
            const link = $(el).attr("href");
            const name = $(el).text().trim();

            if (link && link.includes(".m3u8")) {
                const cleanName = name.replace("24/7", "").trim();

                const tvgId = cleanName
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");

                playlist += `#EXTINF:-1 tvg-id="${tvgId}" tvg-name="${cleanName}" group-title="DLHD 24/7", ${cleanName}\n`;
                playlist += `${link}\n\n`;
            }
        });

        fs.writeFileSync("playlist.m3u", playlist);
        console.log("Playlist updated successfully.");
    } catch (err) {
        console.error("Error generating playlist:", err);
    }
}

generatePlaylist();
