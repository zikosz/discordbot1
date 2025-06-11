const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement')
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('Message to send')
        .setRequired(true)),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channelId = 'YOUR_CHANNEL_ID'; // Replace with your target channel ID

    const channel = await interaction.client.channels.fetch(channelId);

    if (channel && channel.isTextBased()) {
      await channel.send(`📣 Announcement: ${message}`);
      await interaction.reply({ content: '✅ Announcement sent.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Failed to send announcement.', ephemeral: true });
    }
  }
};
