const roles = [
  { name: 'loyal client ($100)', amount: 100 },
  { name: 'premium client ($200+)', amount: 200 },
  { name: 'Gold Buyer', amount: 500 },
];

for (const role of roles) {
  if (stats[userId].total >= role.amount && !member.roles.cache.some(r => r.name === role.name)) {
    const roleToAdd = interaction.guild.roles.cache.find(r => r.name === role.name);
    if (roleToAdd) await member.roles.add(roleToAdd);
  }
}
