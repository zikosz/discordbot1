const {
  Events,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'ticketTypeSelect') {
          const selectedValue = interaction.values[0];

          const modal = new ModalBuilder()
            .setCustomId(`ticketModal_${selectedValue}`)
            .setTitle('Ticket Details');

          const userInfoInput = new TextInputBuilder()
            .setCustomId('userInfo')
            .setLabel('Please provide additional details:')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter any information about your ticket...')
            .setRequired(true);

          const firstActionRow = new ActionRowBuilder().addComponents(userInfoInput);
          modal.addComponents(firstActionRow);

          await interaction.showModal(modal);
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('ticketModal_')) {
          const ticketType = interaction.customId.split('_')[1];
          const userInfo = interaction.fields.getTextInputValue('userInfo');

          await interaction.reply({
            content: `🎫 Ticket created for **${ticketType}** with info:\n${userInfo}`,
            ephemeral: true
          });

          // TODO: Here you can create the ticket channel or notify staff, etc.
        }
      }
    } catch (error) {
      console.error('❌ Interaction failed:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Something went wrong while handling this interaction.',
          ephemeral: true
        });
      }
    }
  }
};