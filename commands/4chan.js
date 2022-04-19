const axios = require('axios').default;
const he = require('he');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('4chan')
        .setDescription('Retorna o primeiro post de um board do 4chan.org (Padrão /b/)')
        .addStringOption(option =>
            option.setName('board')
                .setDescription('Lista de boards para pegar o post')
                .setChoices(
                    { name: 'Anime & Manga', value: 'a' }, { name: 'Adult Cartoons', value: 'aco' },
                    { name: 'Animals & Nature', value: 'an' }, { name: 'Random', value: 'b' },
                    { name: 'Anime/Cute', value: 'c' }, { name: 'Cosplay & EGL', value: 'cgl' },
                    { name: 'Comics & Cartoons', value: 'co' },
                    { name: 'Hentai/Alternative', value: 'd' }, { name: 'Ecchi', value: 'e' },
                    { name: 'Adult GIF', value: 'gif' }, { name: 'Hentai', value: 'h' }, { name: 'Hardcore', value: 'hc' },
                    { name: 'High Resolution', value: 'hr' },
                    { name: 'LGBT', value: 'lgbt' },
                    { name: 'Pony', value: 'mlp' },
                    { name: 'Professional Wrestling', value: 'pw' },
                    { name: 'ROBOT9001', value: 'r9k' }, { name: 'Sexy Beautiful Women', value: 's' },
                    { name: 'Yuri', value: 'u' },
                    { name: 'Pokémon', value: 'vp' },
                    { name: 'Anime/Wallpapers', value: 'w' }, { name: 'Wallpapers/General', value: 'wg' },
                    { name: 'Worksafe GIF', value: 'wsg' }, { name: 'Paranormal', value: 'x' },
                    { name: 'Yaoi', value: 'y' })
                .setRequired(false))
        .addStringOption(option =>
            option.setName('specific-board')
                .setDescription('Board especifico para pegar o post')
                .setRequired(false))
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Enviar para um usuário especifico')),
    async execute(interaction) {
        const board = (interaction.options.getString('specific-board') ?? interaction.options.getString('board') ?? 'b').replaceAll('/', '');
        const user = interaction.options.getUser('usuário');

        axios.get(`https://a.4cdn.org/${board}/1.json`)
            .then(async function (response) {
                let firstThread;

                // Ignores fixed thread
                for (let i = 0; i <= response.data.threads.length; i++) {
                    if (response.data.threads[i].posts[0].closed !== 1) {
                        firstThread = response.data.threads[i].posts[0];
                        break;
                    }
                }

                const threadId = firstThread.no.toString();
                const threadUrl = `https://boards.4chan.org/${board}/thread/${firstThread.no}`;
                const threadDescription = he.decode(firstThread.com).replaceAll('<br>', '\n').replace(/<\/?[^>]+(>|$)/g, '');
                const threadImageUrl = `https://i.4cdn.org/${board}/${firstThread.tim}${firstThread.ext}`;

                const embed = new MessageEmbed()
                    .setColor('#800000')
                    .setTitle(`/${board}/${threadId}`)
                    .setURL(threadUrl)
                    .setDescription(threadDescription)
                    .setImage(threadImageUrl);

                if (user) {
                    await user.send({
                        embeds: [embed],
                    });
                } else {
                    await interaction.reply({
                        embeds: [embed],
                    });
                }

                // Send message to the user who interacted
                // await interaction.user.send({
                //     embeds: [embed],
                // });

                // Alternative way to send messages
                // const attachment = new MessageAttachment(imageUrl);
                // await interaction.reply({
                //     content: `Primeiro post do /b/ (${threadUrl})\n\n${threadDescription}`,
                //     embeds: [embed],
                //     files: [attachment],
                // });
            })
            .catch(function (error) {
                console.log(error);
            });
    },
};