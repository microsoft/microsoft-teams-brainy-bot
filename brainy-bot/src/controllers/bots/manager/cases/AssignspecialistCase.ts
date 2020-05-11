import {CardFactory, TurnContext} from "botbuilder";
import {chooseSpecialistCard} from "../../../../views/adaptivecards/manager/chooseSpecialistCard";
import {SqlConnector} from "../../../../connectors/SqlConnector";
import {FormData} from "../../../../models/FormData";
import {enUS} from "../../../../resources/Resources";

export class AssignspecialistCase {
  static async executeCase(formData: FormData, ctx: TurnContext) {
    delete formData.specialistUpn;
    const specialists = await SqlConnector.getUpnAndNameOfAvailableSpecialists();
    const formattedSpecialists = [];
    for (const specialist of specialists) {
      formattedSpecialists.push({
        title: specialist.name,
        value: specialist.upn,
      });
    }
    if (formattedSpecialists.length > 0) {
      await ctx.sendActivity({
        attachments: [
          CardFactory.adaptiveCard(
            chooseSpecialistCard(formData, formattedSpecialists)
          ),
        ],
      });
    } else {
      await ctx.sendActivity(
        enUS.exceptions.information.noAvailableSpecialists
      );
    }
  }
}
