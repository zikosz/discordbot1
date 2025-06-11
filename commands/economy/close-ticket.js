const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close-ticket')
    .setDescription('Close the current ticket by locking it and deleting after 10 seconds'),

  async execute(interaction) {
    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
    }

    // Lock the channel by disabling send messages for @everyone
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
      ViewChannel: true
    });

    await interaction.reply('🔒 Ticket has been closed. This channel will be deleted in 10 seconds.');

    // Delete the channel after 10 seconds (10000 ms)
    setTimeout(() => {
      interaction.channel.delete().catch(console.error);
    }, 10000);
  }
};
