// commands/stats/stats.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const statsPath = './data/stats.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Show all user stats'),

  async execute(interaction) {
    const stats = fs.existsSync(statsPath) ? JSON.parse(fs.readFileSync(statsPath)) : {};
    let content = '📊 **User Purchase Stats:**\n';

    for (const id in stats) {
      const user = await interaction.guild.members.fetch(id).catch(() => null);
      const name = user ? user.user.username : `Unknown (${id})`;
      content += `• ${name} — $${stats[id].total}\n`;
    }

    await interaction.reply(content.length > 2000 ? content.slice(0, 1997) + '...' : content);
  }
};
