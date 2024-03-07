const axios = require("axios");

module.exports.config = {
  name: "spotify",
  version: "1.0",
  author: "Samir Œ",
  role: 0,
  credits: "MarianCross",
  description: "Get audio from Spotify",
  hasPrefix: false,
  usage: "spotify [track name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ");

  if (!query) {
    api.sendMessage("Please provide a track name.", event.threadID, event.messageID);
    return;
  }

  api.sendMessage("Please wait...⏳", event.threadID, event.messageID);

  const url = `https://api-samir.onrender.com/spotifysearch?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url);
    const tracks = response.data.data;

    if (tracks.length === 0) {
      api.sendMessage("No tracks found for the given query.", event.threadID, event.messageID);
      return;
    }

    const shuffledTracks = tracks.sort(() => Math.random() - 0.5);
    const top6Tracks = shuffledTracks.slice(0, 6);

    const trackInfo = top6Tracks.map((track, index) =>
      `${index + 1}. ${track.title}\nPopularity: ${track.popularity}\nArtist: ${track.artist}`
    ).join("\n\n");

    const thumbnails = top6Tracks.map((track) => track.imageUrl);
    const attachments = await Promise.all(
      thumbnails.map((thumbnail) =>
        global.utils.getStreamFromURL(thumbnail)
      )
    );

    const replyMessage = await api.sendMessage({
      body: `${trackInfo}\n\nType 'next' to see more tracks or reply with a number to choose.`,
      attachment: attachments,
    });

    const data = {
      commandName: this.config.name,
      messageID: replyMessage.messageID,
      tracks: top6Tracks,
      currentIndex: 6,
      originalQuery: query,
    };
    global.GoatBot.onReply.set(replyMessage.messageID, data);
  } catch (error) {
    console.error(error);
    api.sendMessage("Error: " + error, event.threadID);
  }
};
