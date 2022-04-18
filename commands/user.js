const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Informação do usuário'),
    async execute(interaction) {
        await interaction.reply(`User name: ${interaction.user.tag}\nAvatar: ${interaction.user.displayAvatarURL()}`);
    },
};