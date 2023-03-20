import type {ChatInputCommandInteraction} from "discord.js";
import {EmbedBuilder, Colors} from "discord.js";
import {BoardState} from "../../../../util/BoardState";
import {areBoxesValid, areColumnsValid, areInputsFilled, areRowsValid} from "../../../../util/validate";

const makeInvalidEmbeds = (reason: string) => ({
    embeds: [new EmbedBuilder().setTitle("Invalid sudoku!").setDescription(reason).setColor(Colors.Red)]
})

export const validateCommand = async (interaction: ChatInputCommandInteraction) => {
    const board = BoardState.getBoard(interaction.user.id).state;
    if (!areInputsFilled(board)) {
        await interaction.reply(makeInvalidEmbeds("You haven't fully solved your board yet! Keep trying!"));
        return;
    }
    if (!areRowsValid(board)) {
        await interaction.reply(makeInvalidEmbeds("One or more of your rows aren't valid!"));
        return;
    }
    if (!areColumnsValid(board)) {
        await interaction.reply(makeInvalidEmbeds("One or more of your columns aren't valid!"));
        return;
    }
    if (!areBoxesValid(board)) {
        await interaction.reply(makeInvalidEmbeds("One or more of your boxes aren't valid!"));
        return;
    }
    await interaction.reply({
        embeds: [new EmbedBuilder().setTitle("Yay!").setDescription(":tada: Your board is correct! Good job!").setColor(Colors.Green)]
    });
}