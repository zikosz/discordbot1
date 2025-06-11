const fs = require('fs');

async function updateStockMessage(client, game) {
  const stockPath = `./data/stock_${game}.json`;
  const configPath = './data/stockMessages.json';

  if (!fs.existsSync(stockPath) || !fs.existsSync(configPath)) return;

  const stock = JSON.parse(fs.readFileSync(stockPath));
  const config = JSON.parse(fs.readFileSync(configPath));
  const { channelId, messageId } = config[game] || {};
  if (!channelId || !messageId) return;

  const channel = await client.channels.fetch(channelId).catch(() => null);
  if (!channel) return;

  const message = await channel.messages.fetch(messageId).catch(() => null);
  if (!message) return;

  let content = `__# :pinkstar~1: ${game.toUpperCase()} :pinkstar~1:__\n\n`;

  for (const [category, items] of Object.entries(stock)) {
    content += `> # ${category.toUpperCase()}\n`;
    for (const [item, info] of Object.entries(items)) {
      const emoji = info.emoji || '';
      const qty = info.qty !== undefined ? ` ${info.qty}x` : '';
      const price = info.price !== undefined ? ` \`[$${info.price}]\`` : '';
      content += `> **${emoji} ${item}${qty}**${price}\n`;
    }
    content += '\n';
  }

  await message.edit(content);
}

module.exports = updateStockMessage;
