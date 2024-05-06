require('dotenv').config();
const handleMessage = require('./messageHandler');
const {Client, IntentsBitField} = require ('discord.js');

//const {BOT_TOKEN} = require ('.env')

//create a client
//an Intent is a set of permissions that your bot uses in order to obtain access to a set of events
//list of intents: https://discord.com/developers/docs/topics/gateway#list-of-intents
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

const bot_token = process.env.DISCORD_TOKEN;


client.on('ready', (c) => {
    console.log( `${c.user.username}` + ' is ready');
})

//message docs: https://discord.com/developers/docs/interactions/message-components#message-components
client.on('messageCreate', (msg) => {
    //dont do anything if author is a bot
    if (msg.author.bot){
        return;
    }

    console.log('message recieved (id):' + msg);
    console.log('message: ' + msg.content);

    reply = handleMessage(msg.content);
    if (reply != null){
        msg.reply(reply);
    }
})
//listen for slash command
client.on('interactionCreate', (interaction) =>{
    //return T/F
    if(!interaction.isChatInputCommand()){
        return;
    }
    console.log(interaction.commandName);
    if (interaction.commandName === 'hey'){
        interaction.reply('hey!');
    }

    if (interaction.commandName === 'compile'){
        const language = interaction.options.get('language').value;
        console.log(language);
        interaction.reply("you have selected " + language);
    }
})

//login using the token
client.login(bot_token);

