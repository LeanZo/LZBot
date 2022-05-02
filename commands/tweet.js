const dotenv = require('dotenv');
dotenv.config();

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TwitterApi } = require('twitter-api-v2');

const {
    TWITTER_API_KEY,
    TWITTER_API_KEY_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET,
} = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tweet')
        .setDescription('Busca um tweet aleatório')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Texto para do twittar')
                .setRequired(true)),
    async execute(interaction) {
        try {
            if (interaction.user.id !== '189451818839965696') {
                await interaction.reply({
                    content: 'Desculpa, minha amiga bruxa disse para eu não fazer isso.',
                });

                return;
            }

            const text = interaction.options.getString('text');

            const twitterClient = new TwitterApi({
                appKey: TWITTER_API_KEY,
                appSecret: TWITTER_API_KEY_SECRET,
                accessToken: TWITTER_ACCESS_TOKEN,
                accessSecret: TWITTER_ACCESS_TOKEN_SECRET,
            });

            const rwClient = twitterClient.readWrite;

            const tweet = await rwClient.v1.tweet(text);

            const embed = new MessageEmbed()
                .setColor('#1d9bf0')
                .setTitle(`${tweet.user.name} (@${tweet.user.screen_name})`)
                .setURL(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                .setDescription(tweet.full_text)
                .setThumbnail(tweet.user.profile_image_url_https);

            await interaction.reply({
                embeds: [embed],
            });
        } catch (error) {
            console.log(error);
        }
    },
};