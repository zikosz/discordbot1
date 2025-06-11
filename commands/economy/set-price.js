// commands/economy/set-price.js
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const pricePath = './data/prices.json';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-price')
    .setDescription('Set price for an item')
    .addStringOption(opt =>
      opt.setName('item').setDescription('Item name').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('price').setDescription('Price in $').setRequired(true)),

  async execute(interaction) {
    const item = interaction.options.getString('item');
    const price = interaction.options.getInteger('price');

    let prices = fs.existsSync(pricePath) ? JSON.parse(fs.readFileSync(pricePath)) : {};
    prices[item] = price;
    fs.writeFileSync(pricePath, JSON.stringify(prices, null, 2));

    await interaction.reply(`✅ Set price of **${item}** to **$${price}**.`);
  }
};