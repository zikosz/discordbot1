// commands/stats/personalspent.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const statsPath = './data/stats.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('personalspent')
    .setDescription('Show your total spent amount'),

  async execute(interaction) {
    const stats = fs.existsSync(statsPath) ? JSON.parse(fs.readFileSync(statsPath)) : {};
    const userStats = stats[interaction.user.id];
    const total = userStats ? userStats.total : 0;
    await interaction.reply(`💰 You have spent a total of **$${total}**.`);
  }
};