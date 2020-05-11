import {CardFactory, TurnContext} from "botbuilder";
import {addTaskCard} from "../../../../views/adaptivecards/privatemessage/addTaskCard";
import {FormData} from "../../../../models/FormData";

export class EdittaskCase {
  static async executeCase(formData: FormData, ctx: TurnContext) {
    await ctx.sendActivity({
      attachments: [CardFactory.adaptiveCard(addTaskCard(formData, ""))],
    });
  }
}
