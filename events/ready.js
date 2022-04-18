// When the client is ready, run this code (only once)
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // client.users.fetch('userid', false).then((user) => {
        //     user.send('heloo');
        // });

        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};