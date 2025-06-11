// commands/stats/forcestats.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const statsPath = './data/stats.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forcestats')
    .setDescription('Force refresh roles based on stats')
    .addUserOption(opt =>
      opt.setName('user').setDescription('User to refresh roles for').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const stats = fs.existsSync(statsPath) ? JSON.parse(fs.readFileSync(statsPath)) : {};

    if (!stats[target.id]) return interaction.reply('❌ No stats found for this user.');

    const total = stats[target.id].total;
    const member = await interaction.guild.members.fetch(target.id);
    const roles = [
      { name: 'Bronze Buyer', amount: 50 },
      { name: 'Silver Buyer', amount: 200 },
      { name: 'Gold Buyer', amount: 500 }
    ];

    for (const role of roles) {
      const r = interaction.guild.roles.cache.find(x => x.name === role.name);
      if (total >= role.amount && r && !member.roles.cache.has(r.id)) {
        await member.roles.add(r);
      }
    }

    await interaction.reply(`🔄 Roles updated for **${target.username}**.`);
  }
};
