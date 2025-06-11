const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-stock')
    .setDescription('View current stock levels for a game')
    .addStringOption(opt =>
      opt.setName('game')
        .setDescription('Select the game')
        .setRequired(true)
        .addChoices(
          { name: 'Dahood', value: 'game1' },
          { name: 'Grow a Garden', value: 'game2' },
          { name: 'Bladeball', value: 'game3' }
        )
    ),

  async execute(interaction) {
    const game = interaction.options.getString('game');
    const stockPath = `./data/stock_${game}.json`;

    if (!fs.existsSync(stockPath)) {
      return interaction.reply(`Stock data for ${game} not found.`);
    }

    const stock = JSON.parse(fs.readFileSync(stockPath));
    if (Object.keys(stock).length === 0) {
      return interaction.reply(`Stock for ${game} is currently empty.`);
    }

    let message = `📦 **Current Stock for ${game.toUpperCase()}:**\n`;
    for (const [item, qty] of Object.entries(stock)) {
      message += `• ${item}: ${qty}\n`;
    }

    await interaction.reply(message);
  }
};
