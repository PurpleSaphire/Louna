module.exports.config = {
  name: 'convertcmd',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: 'Converts a command to the structure of the "parole" command.',
  usage: 'convertcmd [command]',
  credits: 'MarianCross',
  cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
  if (args.length === 0) {
    api.sendMessage('❎ | Please provide a command to convert.', event.threadID, event.messageID);
    return;
  }

  try {
    const code = args.join(' ');
    const command = eval(`(${code})`);

    const convertedCommand = {
      config: {
        name: command.config.name || '',
        version: command.config.version || '',
        role: command.config.role || 0,
        hasPrefix: command.config.hasPrefix || false,
        aliases: command.config.aliases || [],
        description: command.config.description || '',
        usage: command.config.usage || '',
        credits: command.config.credits || '',
        cooldown: command.config.cooldown || 0,
      },
      run: command.run.toString() || '',
    };

    api.sendMessage(JSON.stringify(convertedCommand, null, 2), event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage('❎ | Failed to convert command.', event.threadID, event.messageID);
  }
};
