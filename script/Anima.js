const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'anima',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: 'Generate an image.',
  usage: 'anima <prompt>',
  credits: 'MarianCross',
  cooldown: 20,
};

module.exports.run = async function({ api, event, args }) {
  let waitMessageID;
  try {
    api.setMessageReaction('✅', event.messageID);

    const prompt = args.join(' ');
    const emiApiUrl = 'https://ai-tools.replit.app/emi';

    const waitMessage = await api.sendMessage('Veillez patienter... 🔮', event.threadID);
    waitMessageID = waitMessage.messageID;

    const imagePaths = [];
    for (let i = 0; i < 4; i++) {
      const emiResponse = await axios.get(emiApiUrl, {
        params: { prompt },
        responseType: 'arraybuffer',
      });
      const imagePath = path.join(__dirname, `/cache/${Date.now()}_${i}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(emiResponse.data, 'binary'));
      imagePaths.push(imagePath);
    }

    await api.deleteMessage(waitMessageID);

    const seconds = 4;
    const messageText = `Voici vos images 🏮 (${seconds} secondes)`;
    api.sendMessage({
      body: messageText,
      attachment: imagePaths.map(imagePath => fs.createReadStream(imagePath)),
    }, event.threadID);

  } catch (error) {
    console.error('Error:', error);
    if (waitMessageID) {
      await api.deleteMessage(waitMessageID);
    }
    api.setMessageReaction('❎', event.messageID);
    api.sendMessage('❌ | Une erreur s\'est produite. Veuillez réessayer plus tard.', event.threadID);
  }
};
