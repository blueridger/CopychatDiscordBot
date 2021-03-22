const keep_alive = require('./keep_alive.js')
const config = require('./config.js')
const Discord = require('discord.js');

const client = new Discord.Client();
const token = process.env.DISCORD_BOT_SECRET;

function* batch(arr, n = 1) {
    const l = arr.length
    let i = 0;
    while (i <= l) {
        yield arr.slice(i, Math.min(i + n, l))
        i += n
    }
}

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

client.on('ready', () => {
    console.log("I'm in");
    console.log(client.user.username);
});

client.on('message', async msg => {
    if (msg.author.id === client.user.id) {
        return;
    }
    const mappings = config.CHANNEL_MAPPINGS.filter(m => m.in === msg.channel.id)
    for (const mapping of mappings) {
        let content = msg.url + '\n' +
            msg.author.toString() + ' in ' + msg.channel.toString() + ':\n' +
            msg.content;
        if (config.DISABLE_TAGS) while (content.match(/<@!?[0-9]*>/)) content = content.replace(/<@!?[0-9]*>/, match => {
            return client.users.cache.get(match.match(/<@!?([0-9]*)>/)[1]).username
        });
        msg.guild.channels.cache.get(mapping.out).send(content);
    }
});

client.login(token);