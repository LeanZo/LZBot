const dotenv = require('dotenv');
dotenv.config();

const translate = require('@vitalets/google-translate-api');
const axios = require('axios');

const { RANDOM_STUFF_API_TOKEN, RAPIDAPI_TOKEN } = process.env;

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        try {

            if (message.author.tag === message.client.user.tag) return;

            console.log(`[${message.createdAt.toLocaleString('pt-BR')}] ${message.author.tag}: ${message.content}`);
            const input = await translate(message.content, { from: 'pt', to: 'en', autoCorrect: true });

            const options = {
                method: 'GET',
                url: 'https://random-stuff-api.p.rapidapi.com/ai',
                params: {
                    msg: input.text,
                    bot_name: 'Carlinha',
                    bot_gender: 'female',
                    bot_master: 'Lucas Lean',
                    bot_age: '20',
                    bot_location: 'Brasil',
                    bot_birth_year: '2002',
                    bot_birth_date: '22st September, 2002',
                    bot_birth_place: 'Brasil',
                    bot_favorite_color: 'Green',
                    bot_favorite_book: 'Harry potter',
                    bot_favorite_band: 'BTS',
                    bot_favorite_artist: 'Jung Kook',
                    bot_favorite_actress: 'Emma Watson',
                    bot_favorite_actor: 'Jim Carrey',
                    id: message.author.id,
                },
                headers: {
                    Authorization: RANDOM_STUFF_API_TOKEN,
                    'X-RapidAPI-Host': 'random-stuff-api.p.rapidapi.com',
                    'X-RapidAPI-Key': RAPIDAPI_TOKEN,
                },
            };

            axios.request(options).then(async function (response) {
                if (response.data.AIResponse !== '') {
                    const output = await translate(response.data.AIResponse, { from: 'en', to: 'pt', autoCorrect: true });

                    await message.author.send({
                        content: output.text,
                    });

                    console.log(`[${new Date().toLocaleString('pt-BR')}] ${message.client.user.tag} -> ${message.author.tag}: ${output.text}`);
                }
            }).catch(function (error) {
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    },
};