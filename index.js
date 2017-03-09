const restify = require('restify');
const discord = require('discord.js');

const bot = new discord.Client({ autoReconnect: true });
const token = process.env.TOKEN;
const secret = process.env.SECRET;
const channelName = process.env.CHANNEL || 'general';
const port = process.env.PORT || 3333;

const server = restify.createServer({ name: 'Discord Jenkins Notify' });

server.pre(restify.CORS());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(port, () => {
    console.log(`${server.name} Listening at ${server.url}`);

    bot.login(token)
        .then(console.log('Bot Logged in.'))
        .catch(error => console.log(error));
});

server.post('/jenkins/:secret', (req, res) => {
    const job = req.body.name;
    const build = req.body.build.number;
    const reqsecret = req.params.secret;
    let status = '';

    if (reqsecret !== secret) {
        return res.send(401, 'Unauthorized');
    }

    // Get all channels where
    const channels = bot.channels;

    channels.forEach(channel => {

        const msg = `The build ${job} #${build} - **${req.body.build.status}**\n${req.body.build.full_url}`;

        if (channel.type === 'text' && channel.name === channelName) {
            channel.sendMessage(msg);
        }
    });

    return res.send('message delivered');
});

