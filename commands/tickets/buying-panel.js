// commands/tickets/buying-panel.js
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buying-panel')
    .setDescription('Sends the buying panel with ticket options (admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🛒 BUYING PANEL')
      .setDescription('Click on the button corresponding to the type of ticket you wish to open!')
      .setColor('#0099ff')
      .setThumbnail('https://yourdomain.com/logo.png'); // Replace with your actual logo URL

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticketTypeSelect')
      .setPlaceholder('Select the ticket type...')
      .addOptions([
        {
          label: 'Dahood',
          description: 'Da Hood',
          value: 'game1_ticket',
          emoji: { name: 'DHC', id: '1382420836153294869' }, // No colons
        },
        {
          label: 'GaG',
          description: 'Grow a Garden',
          value: 'game2_ticket',
          emoji: { name: 'FlowerLily', id: '1382420792247320798', animated: false },
        },
        {
          label: 'Blade Ball',
          description: 'Blade Ball',
          value: 'game3_ticket',
          emoji: { name: 'BladeBall', id: '1382420876833591316', animated: false },
        },
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ content: '✅ Buying panel sent to this channel.', ephemeral: true });

    await interaction.channel.send({ embeds: [embed], components: [row] });
  },
};
