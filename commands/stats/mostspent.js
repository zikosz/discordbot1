// commands/stats/mostspent.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const statsPath = './data/stats.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mostspent')
    .setDescription('Show top spenders leaderboard'),

  async execute(interaction) {
    const stats = fs.existsSync(statsPath) ? JSON.parse(fs.readFileSync(statsPath)) : {};
    const sorted = Object.entries(stats).sort((a, b) => b[1].total - a[1].total).slice(0, 10);
    let leaderboard = '🏆 **Top Spenders**\n';

    for (let i = 0; i < sorted.length; i++) {
      const [id, data] = sorted[i];
      const user = await interaction.guild.members.fetch(id).catch(() => null);
      const name = user ? user.user.username : `Unknown (${id})`;
      leaderboard += `${i + 1}. ${name} — $${data.total}\n`;
    }

    await interaction.reply(leaderboard);
  }
};
