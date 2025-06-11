const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const stockPath = './data/stock.json';
const pricePath = './data/prices.json';
const statsPath = './data/stats.json';
const updateStockMessage = require('../../utils/updateStockMessage');  // <--- ADD THIS

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sold')
    .setDescription('Mark an item as sold and update stats')
    .addUserOption(opt =>
      opt.setName('buyer').setDescription('The buyer').setRequired(true))
    .addStringOption(opt =>
      opt.setName('item').setDescription('Item sold').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('quantity').setDescription('Quantity sold').setRequired(true)),

  async execute(interaction) {
    const buyer = interaction.options.getUser('buyer');
    const item = interaction.options.getString('item');
    const qty = interaction.options.getInteger('quantity');

    let stock = fs.existsSync(stockPath) ? JSON.parse(fs.readFileSync(stockPath)) : {};
    let prices = fs.existsSync(pricePath) ? JSON.parse(fs.readFileSync(pricePath)) : {};
    let stats = fs.existsSync(statsPath) ? JSON.parse(fs.readFileSync(statsPath)) : {};

    if (!stock[item] || stock[item] < qty) {
      return interaction.reply({ content: `❌ Not enough ${item} in stock.`, ephemeral: true });
    }

    const price = prices[item] || 0;
    const total = qty * price;

    stock[item] -= qty;
    stats[buyer.id] = stats[buyer.id] || { total: 0, items: {} };
    stats[buyer.id].total += total;
    stats[buyer.id].items[item] = (stats[buyer.id].items[item] || 0) + qty;

    fs.writeFileSync(stockPath, JSON.stringify(stock, null, 2));
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

    const member = await interaction.guild.members.fetch(buyer.id);
    const roles = [
      { name: 'loyal client ($100)', amount: 100 },
      { name: 'premium client ($200+)', amount: 200 },
      { name: '', amount: 500 }
    ];

    for (const role of roles) {
      const r = interaction.guild.roles.cache.find(x => x.name === role.name);
      if (stats[buyer.id].total >= role.amount && r && !member.roles.cache.has(r.id)) {
        await member.roles.add(r);
      }
    }

    await interaction.reply(`✅ ${buyer.username} bought ${qty}x ${item} for $${total}.`);
const game = interaction.options.getString('game'); // You’ll add this option
const stockPath = `./data/stock_${game}.json`;

// ... then use the `updateStockMessage(client, game)` function
await updateStockMessage(interaction.client, game);

  }
};
