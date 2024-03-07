const axios = require('axios');

module.exports.config = {
  name: 'niji',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: 'Text to Image',
  usage: 'niji [prompt]',
  credits: 'MarianCross',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const permission = ["100095208485891"];
  if (!permission.includes(event.senderID)) {
    api.sendMessage(
      `❌ | Command "niji" currently unavailable buy premium to use the command.`,
      event.threadID,
      event.messageID
    );
    return;
  }

  try {
    const info = args.join(' ');
    const [prompt] = info.split('|').map(item => item.trim());
    const text = args.join(" ");
    if (!text) {
      api.sendMessage("❎ | Please provide a prompt", event.threadID, event.messageID);
      return;
    }
    const modelParam = '1'; // Utilisation du premier modèle uniquement
    const apiUrl = `https://turtle-apis.onrender.com/api/sdxl?prompt=${encodeURIComponent(prompt)}&model=${modelParam}`;

    api.sendMessage('Please wait...⏳', event.threadID, event.messageID);

    const { data } = await axios.get(apiUrl);
    const form = {
      body: JSON.stringify({ attachment: [{ type: 'image', url: data.imageUrl }] }),
      mentions: [],
    };

    api.sendMessage(form, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage('❎ | Sorry, API has a skill issue', event.threadID, event.messageID);
  }
};
