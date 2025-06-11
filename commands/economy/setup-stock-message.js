const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const stockMsgPath = './data/stockMessages.json'; // plural for multiple games

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-stock-message')
    .setDescription('Create or reset the stock status message for a game in this channel')
    .addStringOption(opt =>
      opt.setName('game')
        .setDescription('Select the game')
        .setRequired(true)
        .addChoices(
          { name: 'Dahood', value: 'game1' },
          { name: 'Grow a Garden', value: 'game2' },
          { name: 'Bladeball', value: 'game3' }
        )),

  async execute(interaction) {
    const game = interaction.options.getString('game');
    const stockPath = `./data/stock_${game}.json`;

    // Initialize stock file if missing
    if (!fs.existsSync(stockPath)) {
      fs.writeFileSync(stockPath, JSON.stringify({}));
    }
    const stock = JSON.parse(fs.readFileSync(stockPath));

    let messageContent = `📦 **Current Stock for ${game.toUpperCase()}:**\n`;
    if (Object.keys(stock).length === 0) {
      messageContent += '_No items in stock._';
    } else {
      // Stock items expected as { itemName: { qty: number, price: number, emoji: string } }
      for (const [item, info] of Object.entries(stock)) {
        const qty = info.qty !== undefined ? info.qty : info;  // fallback for old format
        const price = info.price !== undefined ? ` [$${info.price}]` : '';
        const emoji = info.emoji || '';
        messageContent += `• ${emoji} ${item}: ${qty}${price}\n`;
      }
    }

    // Send stock message to current channel
    const msg = await interaction.channel.send(messageContent);

    // Load or init stockMessages config
    let stockMessages = fs.existsSync(stockMsgPath)
      ? JSON.parse(fs.readFileSync(stockMsgPath))
      : {};

    // Save channel and message ID per game
    stockMessages[game] = {
      channelId: interaction.channel.id,
      messageId: msg.id
    };
    fs.writeFileSync(stockMsgPath, JSON.stringify(stockMessages, null, 2));

    await interaction.reply({ content: `✅ Stock message for **${game}** created in this channel and saved.`, ephemeral: true });
  }
};
