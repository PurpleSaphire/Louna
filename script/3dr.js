module.exports.config = {
  name: '3dr',
  version: '1.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: 'Text to Image',
  usage: '3dr [prompt]',
  credits: 'MarianCross',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  const permission = ["100095208485891"];
  if (!permission.includes(event.senderID)) {
    api.sendMessage(
      `❌ | Command "3dr" currently unavailable. Buy premium to use the command.`,
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
    const modelParam = '3'; // Utilisation du troisième modèle uniquement
    const apiUrl = `https://turtle-apis.onrender.com/api/sdxl?prompt=${prompt}&model=${modelParam}`;

    const startTime = new Date(); // Heure de début de la génération d'images

    api.sendMessage('Veuillez patienter, ça prend un instant... 🖼️', event.threadID, event.messageID);

    const form = {};
    form.attachment = [];

    // Générer quatre images
    for (let i = 0; i < 4; i++) {
      const response = await global.utils.getStreamFromURL(apiUrl);
      form.attachment.push(response);
    }

    const endTime = new Date(); // Heure de fin de la génération d'images
    const duration = (endTime - startTime) / 1000; // Durée en secondes

    // Créer le message d'attachement avec le nombre de secondes
    const attachmentMessage = `Voici vos images 🎭 (${duration} secondes)`;

    // Envoyer les quatre images avec le message d'attachement
    api.sendMessage({
      body: attachmentMessage,
      attachment: form.attachment
    }, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage('❎ | Sorry, API has a skill issue', event.threadID, event.messageID);
  }
};
