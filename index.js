require('dotenv').config();
const fs = require('fs');
const {
  Client,
  Collection,
  GatewayIntentBits,
  Events,
  Partials,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel]
});

client.commands = new Collection();

// Select Menu & Button Interaction Handlers
client.on('interactionCreate', async (interaction) => {
  if (interaction.isStringSelectMenu()) {
    const customId = interaction.customId;
    try {
      const handler = require(`./interactions/selectMenu/${customId}`);
      await handler.execute(interaction);
    } catch (error) {
      console.error(`No handler found for select menu with id: ${customId}`);
    }
  } else if (interaction.isButton()) {
    const customId = interaction.customId;
    try {
      const handler = require(`./interactions/buttons/${customId}`);
      await handler.execute(interaction);
    } catch (error) {
      console.error(`No handler found for button with id: ${customId}`);
    }
  }
});

// Load slash commands
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

// Unified interaction handler
client.on(Events.InteractionCreate, async interaction => {
  try {
    const staffRoleId = '1382441005373980865'; // 👈 Replace with your staff role ID

    // Handle ticket creation button
    if (interaction.isButton() && interaction.customId === 'create_ticket') {
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
      return;
    }

    // Handle modal submissions
    if (interaction.isModalSubmit()) {
      let ticketType = "Purchase Ticket";
      let gameSlug = "general";

      if (interaction.customId.startsWith('ticketModal_')) {
        ticketType = interaction.customId.split('_')[1];
        gameSlug = ticketType.toLowerCase().replace(/\s+/g, '-');
      }

      const username = interaction.fields.getTextInputValue('username');
      const payment = interaction.fields.getTextInputValue('payment');
      const item = interaction.fields.getTextInputValue('item');

      const channel = await interaction.guild.channels.create({
        name: `ticket-${gameSlug}-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
          }
        ]
      });

      await channel.send({
        content: ` <@&${staffRoleId}> | <@${interaction.user.id}> opened a **${ticketType}** ticket!\n\n` +
                 `**Username:** ${username}\n` +
                 `**Payment:** ${payment}\n` +
                 `**Item:** ${item}`
      });

      await interaction.reply({ content: `✅ Ticket created: ${channel}`, flags: 64 });
      return;
    }

    // Slash command handler
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction, client);
    }

  } catch (error) {
    console.error("Interaction error:", error);
    if (!interaction.replied) {
      await interaction.reply({ content: "❌ There was an error.", ephemeral: true });
    } else {
      await interaction.followUp({ content: "❌ Error (after reply).", ephemeral: true });
    }
  }
});

// Ensure data folders exist
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync('./data/stock.json')) fs.writeFileSync('./data/stock.json', '{}');

// Bot ready
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD.TOKEN);

