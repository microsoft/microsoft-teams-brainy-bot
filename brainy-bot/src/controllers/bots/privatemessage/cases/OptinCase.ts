import {User} from "../../../../models/Database";
import {TurnContext} from "botbuilder";
import {SqlConnector} from "../../../../connectors/SqlConnector";
import {enUS} from "../../../../resources/Resources";

export class OptinCase {
  static async executeCase(userProfile: User, ctx: TurnContext) {
    await ctx.sendActivity(enUS.optinNotification);
    await SqlConnector.updateUserprofileAvailability(userProfile.upn, 1);
  }
}
