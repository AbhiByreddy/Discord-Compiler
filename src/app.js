require("dotenv").config();
const handleMessage = require("./messageHandler");
const compileLangauge = require("./compiler");
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

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
  ],
});

const bot_token = process.env.DISCORD_TOKEN;

//for buttons
const languages = [
  {
    id: "javascript",
    label: "JavaScript",
    style: "Secondary",
  },

  {
    id: "python",
    label: "Python",
    style: "Primary",
  },
];

client.on("ready", (c) => {
  console.log(`${c.user.username}` + " is ready");
});

//message docs: https://discord.com/developers/docs/interactions/message-components#message-components
client.on("messageCreate", (msg) => {
  //dont do anything if author is a bot
  if (msg.author.bot) {
    return;
  }

  console.log("message recieved (id):" + msg);
  console.log("message: " + msg.content);

  reply = handleMessage(msg.content);
  if (reply != null) {
    msg.reply(reply);
  }
});

//listen for slash command
client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "javascript") {
    }
    console.log("button clicked");
    const modal = new ModalBuilder().setTitle("Enter Code");
    await interaction.showModal(modal);
  }

  //return T/F
  if (!interaction.isChatInputCommand()) {
    return;
  }

  console.log("command: " + interaction.commandName);

  if (interaction.commandName === "hey") {
    interaction.reply("hey!");
  }

  if (interaction.commandName === "compile") {
    try{
    console.log(`interaction: ${interaction}`);


    const language = interaction.options.get("language").value;

    console.log(`Language: ${language}`);

    console.log("before modal");
    //create modal

    console.log("creating modal");
    const modal = new ModalBuilder({
      customId: `myModal-${interaction.user.id}`,
      title: `Input Code`,
    });

    const codeInput = new TextInputBuilder({
      customId: `codeInput`,
      label: "Input your code here!",
      style: TextInputStyle.Paragraph,
    });

    const secondActionRow = new ActionRowBuilder().addComponents(codeInput);

    modal.addComponents(secondActionRow);

    await interaction.showModal(modal);

    //wait for the modal to be subitted
    const filter = (interaction) =>
      interaction.customId === `myModal-${interaction.user.id}`;

    //wait 60 seconds
    interaction
      .awaitModalSubmit({ filter, time: 60_000 })
      .then( async (modalInteraction) => {
        //grab the value from the input box
        const codeValue =
          modalInteraction.fields.getTextInputValue("codeInput");

        //create embed and compile code
        let description = "";
        let color = "Random";
        let languageName = null;

        if (language == "javascript") {
          languageName = 'JavaScript';
          color = 0xffff00;
          thumbnail =
            "https://res.cloudinary.com/teepublic/image/private/s--G1qNjKYf--/t_Preview/b_rgb:191919,c_limit,f_auto,h_630,q_90,w_630/v1539273632/production/designs/3302075_0.jpg";
          description = await compileLangauge(language, codeValue);
        } else if (language == "python") {
          languageName = 'Python';
          color = 0x1e90ff;
          thumbnail =
            "https://i0.wp.com/tinkercademy.com/wp-content/uploads/2018/04/python-icon.png?ssl=1";
          description = await compileLangauge(language, codeValue);
        }

        //embed docs: https://discordjs.guide/popular-topics/embeds.html#embed-preview

        let embed = null;
        if(description[1]){
          //is an error
          embed = new EmbedBuilder()
          .setTitle(`${languageName} - Compile Failed`)
          .setThumbnail(thumbnail)
          .setDescription(description[0].toString())
          .setColor(color);
        }else{
          //is not an error
          embed = new EmbedBuilder()
          .setTitle(`${languageName} - Success!`)
          .setThumbnail(thumbnail)
          .setDescription(description[0].toString())
          .setColor(color);
        }

        modalInteraction.reply({ embeds: [embed] });
      });

    // const code = interaction.options.get('code').value;
    // console.log(`code: ${code}`);

    //set border colors
    }catch (err) {
      console.log('interaction failed.');
      console.log(err);
    }
  }

  if (interaction.commandName === "button") {
    try {
      const row = new ActionRowBuilder();
      languages.forEach((language) => {
        row.components.push(
          new ButtonBuilder()
            .setCustomId(language.id)
            .setLabel(language.label)
            .setStyle(ButtonStyle.Primary)
        );
      });

      await interaction.reply({
        content: "",
        ephemeral: true,
        components: [row],
      });
    } catch (error) {
      console.log(error);
    }
  }
});

//login using the token
client.login(bot_token);
