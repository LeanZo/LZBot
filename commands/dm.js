const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Envia mensagem privada para outra pessoa')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Enviar para um usuário especifico')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('Mensagem que será enviada')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('anônimo')
                .setDescription('Deve informar a origem da mensagem?')),
    async execute(interaction) {
        try {
            const anonymous = (interaction.options.getBoolean('anônimo') ?? true);
            const msg = (interaction.options.getString('mensagem') ?? '');
            const user = interaction.options.getUser('usuário');

            if (msg === '') return;

            await user.send({
                content: (!anonymous ? `${interaction.user.tag} disse:\n` : '') + msg,
            });
        } catch (error) {
            console.log(error);
        }
    },
};