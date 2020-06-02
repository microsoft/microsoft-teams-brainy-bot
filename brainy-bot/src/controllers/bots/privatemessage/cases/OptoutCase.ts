import {User} from "../../../../models/Database";
import {CardFactory, TurnContext} from "botbuilder";
import {optoutCard} from "../../../../views/adaptivecards/privatemessage/optoutCard";
import {SqlConnector} from "../../../../connectors/SqlConnector";

export class OptoutCase {
  static async executeCase(userProfile: User, ctx: TurnContext) {
    await ctx.sendActivity({
      attachments: [CardFactory.adaptiveCard(optoutCard())],
    });
    await SqlConnector.updateUserprofileAvailability(
      userProfile.aadobjectid,
      0
    );
  }
}
