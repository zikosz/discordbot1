const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  async execute(interaction) {
    const selected = interaction.values[0]; // Game type

    const modal = new ModalBuilder()
      .setCustomId(`ticketModal_${selected}`)
      .setTitle(`🛒 Ticket for ${selected}`);

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
