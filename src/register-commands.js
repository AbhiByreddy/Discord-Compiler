require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

//register commands using node src/register-commands.js

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey!',
    },
    {
        name: 'compile',
        description: 'Compiles code snippets',
        options: [
            {
                name: 'language',
                description: 'Compile a language ',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'java-script',
                        value: 'JavaScript',
                        
                    },
                    {
                        name: 'python',
                        value: 'Python',
                        
                    },

                ],
                required: true,
            },
        ]
    },

];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    console.log('Registering slash commands... ')
    //register commands
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.APP_ID, 
                process.env.GUILD_ID),
            {body: commands}
        )

        console.log('Slash commands registered successfully');
        
    } catch (error) {
        console.log('error registering slash commands: ' + error);
    }
})();