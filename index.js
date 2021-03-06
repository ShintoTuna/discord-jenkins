const restify = require('restify');
const discord = require('discord.js');

const bot = new discord.Client({ autoReconnect: true });
const token = process.env.TOKEN;
const secret = process.env.SECRET;
const channelName = process.env.CHANNEL || 'general';
const port = process.env.PORT || 3333;
const jenkinsHost = process.env.JENKINS_URL || 'http://localhost'

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

    if (reqsecret !== secret) {
        return res.send(401, 'Unauthorized');
    }

    // Get all channels where
    const channels = bot.channels;

    channels.forEach(channel => {

        const msg = `The build ${job} #${build} - **${req.body.build.status}**\n${jenkinsHost}/${req.body.build.url}\n++++++++++++++++++++++++++++++++++++++++++++`;

        if (channel.type === 'text' && channel.name === channelName) {
            channel.sendMessage(msg);
        }
    });

    return res.send('message delivered');
});
