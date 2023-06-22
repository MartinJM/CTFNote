import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
} from "discord.js";
import { Command } from "../command";
import { getUserByToken, setDiscordIdForUser } from "../database/users";

export const LinkUser: Command = {
  name: "link",
  description: "Connect your Discord account to your CTFNote account!",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "token",
      required: true,
      description: "Your CTFNote account token (found in your profile)",
      type: ApplicationCommandOptionType.String,
      minLength: 1,
    },
  ],
  run: async (_client: Client, interaction: CommandInteraction) => {
    const token = interaction.options.get("token", true).value as string;

    const userId = await getUserByToken(token);

    if (!userId) {
      await interaction.editReply({
        content: "No account with such token found that is not already linked!",
      });
      return;
    }

    const discordId = interaction.user.id;

    const success = await setDiscordIdForUser(userId, discordId);

    if (!success) {
      await interaction.editReply({
        content: "Failed to set your Discord ID in the database!",
      });
    } else {
      await interaction.editReply({
        content:
          "Successfully linked your Discord account to your CTFNote account!",
      });
    }
  },
};
