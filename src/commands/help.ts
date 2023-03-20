import type {Command} from "../util/types";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder} from "discord.js";

export default {
    name: 'help',
    description: 'Where am I?',
    async execute(interaction) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Sudoku Bot')
                    .setDescription(`Sudoku bot is a Discord bot that provides a fun and interactive way to play Sudoku on Discord.`)
                    .setColor(Colors.Green)
                    .setFooter({
                        text: "Made by alaninnovates#0123"
                    })
            ],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(new ButtonBuilder()
                            .setLabel("Invite me")
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://discord.com/oauth2/authorize?client_id=1014319893639856248&scope=bot%20applications.commands&permissions=262144"),
                        new ButtonBuilder()
                            .setLabel("Documentation")
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://sudoku.alaninnovates.com"))
            ]
        })
    }
} as Command;