module.exports.config = {
  name: 'anime',
  version: '1.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: 'Text to Image',
  usage: 'anime [prompt]',
  credits: 'OtinXSandip',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const ass = args.join(' ');

  if (!ass) {
    api.sendMessage("😡 Please provide a prompt", event.threadID, event.messageID);
    return;
  }
  api.setMessageReaction("⏳", event.messageID);

  const startTime = new Date().getTime();

  api.sendMessage("✅ Generating, please wait.", async (err, info) => {
    const lado = `https://sandip-gen.onrender.com/anigen?prompt=${ass}`;
    const puti = await global.utils.getStreamFromURL(lado);
    const bubu = puti.data.url;

    const yourmom = bubu;
    const dick = await global.utils.getStreamFromURL(`https://sandip-gen.onrender.com/imgbb?link=${encodeURIComponent(yourmom)}`);
    const fuck = dick.data.url;

    const endTime = new Date().getTime();
    const timeTaken = (endTime - startTime) / 1000;
    api.sendMessage({
      body: `Here is your imagination 🥰\nTime taken: ${timeTaken} seconds\nDownload link: ${fuck}`,
      attachment: puti
    }, event.threadID);

    let ui = info.messageID;
    api.unsendMessage(ui);
    api.setMessageReaction("✅", event.messageID);
  });
};
