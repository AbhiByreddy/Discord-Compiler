require('dotenv').config();
const handleMessage = require('./messageHandler');
const compileLangauge = require('./compiler');
const {Client, IntentsBitField, EmbedBuilder} = require ('discord.js');

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
        console.log(`interaction: ${interaction}`);

        const language = interaction.options.get('language').value;
        console.log(`Language: ${language}`);

        const code = interaction.options.get('code').value;
        console.log(`code: ${code}`);

        //set border colors
        let color = 'Random';
        if (language == 'JavaScript'){
            color = 0xffff00;
            thumbnail = 'https://res.cloudinary.com/teepublic/image/private/s--G1qNjKYf--/t_Preview/b_rgb:191919,c_limit,f_auto,h_630,q_90,w_630/v1539273632/production/designs/3302075_0.jpg';
            description = compileLangauge(language, code);
        }else if (language == "Python"){
            color = 0x1e90ff;
            thumbnail = 'https://i0.wp.com/tinkercademy.com/wp-content/uploads/2018/04/python-icon.png?ssl=1';
            description = compileLangauge(language, code);
        }

        //embed docs: https://discordjs.guide/popular-topics/embeds.html#embed-preview
        const embed = new EmbedBuilder()
        .setTitle(`Compiling ${language}`)
        .setThumbnail(thumbnail)
        .setDescription('Compiling description....')
        .setColor(color);
        interaction.reply({embeds: [embed]});
    }
})

//login using the token
client.login(bot_token);

