// commands/tickets/setup-gui.js
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-gui')
    .setDescription('Send GUI message with ticket button')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const button = new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('🎫 Create Ticket')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content: '**Need help or want to buy something?** Click below to open a ticket!',
      components: [row],
      ephemeral: false
    });
  }
};