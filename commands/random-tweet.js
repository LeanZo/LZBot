const dotenv = require('dotenv');
dotenv.config();

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TwitterApi } = require('twitter-api-v2');

const { TWITTER_BEARER_TOKEN } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random-tweet')
        .setDescription('Busca um tweet aleatório')
        .addStringOption(option =>
            option.setName('user')
                .setDescription('User do twitter')
                .setChoices(
                    { name: 'Calinha-chan', value: 'a_carlinha_chan' },
                    { name: 'Kpoper Cansada', value: 'kpoper_cansada' },
                    { name: 'Peep', value: 'Oleelalaaltrue' },
                    { name: 'Scramin', value: 'Scraminn' },
                    { name: 'Arbusto Oliveira', value: 'ArbustoOliveira' },
                    { name: 'Vitor', value: 'vitorarago10' },
                    { name: 'Clinica espiritual telejornal especialista', value: 'rj_paranormal' },
                    { name: 'Andre', value: 'andreporchatt' })
                .setRequired(false))
        .addStringOption(option =>
            option.setName('specific_username')
                .setDescription('Username especifico do twitter')
                .setRequired(false)),
    async execute(interaction) {
        try {
            const username = interaction.options.getString('user') ?? interaction.options.getString('specific_username').replace('@', '');

            const twitterClient = new TwitterApi(TWITTER_BEARER_TOKEN);

            const rwClient = twitterClient.readWrite;

            const user = (await rwClient.v2.userByUsername(username, { 'user.fields': [ 'profile_image_url' ] })).data;

            let tweets = [];
            let timeline = await rwClient.v2.userTimeline(user.id, {
                exclude: ['replies', 'retweets'],
                max_results: 100,
            });
            tweets = [...tweets, ...timeline.tweets];

            while (timeline.tweets.length > 0 && tweets.length < 300 && timeline.meta.next_token) {
                timeline = await rwClient.v2.userTimeline(user.id, {
                    exclude: ['replies', 'retweets'],
                    max_results: 100,
                    pagination_token: timeline.meta.next_token,
                });
                tweets = [...tweets, ...timeline.tweets];
            }

            const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];

            const embed = new MessageEmbed()
                .setColor('#1d9bf0')
                .setTitle(`${user.name} (@${user.username})`)
                .setURL(`https://twitter.com/${user.username}/status/${randomTweet.id}`)
                .setDescription(randomTweet.text)
                .setThumbnail(user.profile_image_url);

            await interaction.reply({
                embeds: [embed],
            });
        } catch (error) {
            console.log(error);
        }
    },
};