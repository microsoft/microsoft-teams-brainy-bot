import {User} from "../../../../models/Database";
import {CardFactory, TurnContext} from "botbuilder";
import {addTaskCard} from "../../../../views/adaptivecards/privatemessage/addTaskCard";

export class NewtaskCase {
  static async executeCase(userProfile: User, ctx: TurnContext) {
    const card = addTaskCard(
      {
        taskOwnerName: userProfile.name,
        taskOwnerGivenName: userProfile.givenname,
      },
      ""
    );
    await ctx.sendActivity({
      attachments: [CardFactory.adaptiveCard(card)],
    });
  }
}
