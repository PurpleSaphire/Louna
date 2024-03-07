module.exports.config = {
  name: 'sdxl',
  version: '1.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: 'Text to Image',
  usage: 'sdxl [prompt]',
  credits: 'rehat--',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const permission = ["100095208485891"];
  if (!permission.includes(event.senderID)) {
    api.sendMessage(
      `❌ | Command "sdxl" currently unavailable. Buy premium to use the command.`,
      event.threadID,
      event.messageID
    );
    return;
  }

  try {
    const info = args.join(' ');
    const [prompt, model] = info.split('|').map(item => item.trim());
    const text = args.join(" ");
    if (!text) {
      api.sendMessage("❎ | Please provide a prompt", event.threadID, event.messageID);
      return;
    }
    const modelParam = model || '2';
    const apiUrl = `https://turtle-apis.onrender.com/api/sdxl?prompt=${prompt}&model=${modelParam}`;

    api.sendMessage('Please wait...⏳', event.threadID, event.messageID);

    const form = {};
    form.attachment = [];
    form.attachment[0] = await global.utils.getStreamFromURL(apiUrl);

    api.sendMessage(form, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage('❎ | Sorry, API has a skill issue', event.threadID, event.messageID);
  }
};
