// commands/tickets/ticket-add.js
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-add')
    .setDescription('Open a buy ticket with prompts'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('buyTicketModal')
      .setTitle('🛒 Purchase Ticket');

    const username = new TextInputBuilder()
      .setCustomId('username')
      .setLabel("Your Username")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const payment = new TextInputBuilder()
      .setCustomId('payment')
      .setLabel("Payment Method")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const item = new TextInputBuilder()
      .setCustomId('item')
      .setLabel("Item You Want to Buy")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(username),
      new ActionRowBuilder().addComponents(payment),
      new ActionRowBuilder().addComponents(item)
    );

    await interaction.showModal(modal);
  }
};
