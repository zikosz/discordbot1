// commands/tickets/ticket-remove.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-remove')
    .setDescription('Delete the current ticket channel'),

  async execute(interaction) {
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
    }
    await interaction.reply('🗑️ Ticket will be deleted in 5 seconds.');
    setTimeout(() => interaction.channel.delete(), 5000);
  }
};
