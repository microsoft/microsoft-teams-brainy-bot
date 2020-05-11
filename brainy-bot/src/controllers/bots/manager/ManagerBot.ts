import {TurnContext, TeamsActivityHandler} from "botbuilder";
import {AssignedspecialistCase} from "./cases/AssignedspecialistCase";
import {AssignspecialistCase} from "./cases/AssignspecialistCase";
import {SqlConnector} from "../../../connectors/SqlConnector";
import {DeclineCase} from "./cases/DeclineCase";
import {FormData} from "../../../models/FormData";
import {User} from "../../../models/Database";
import {telemetryClient} from "../../../app";
import {enUS} from "../../../resources/Resources";

export class ManagerBot extends TeamsActivityHandler {
  constructor(userProfile: User) {
    super();

    this.onMessage(async (ctx: TurnContext) => {
      const text = ctx.activity.text.trim();
      const formData = ctx.activity.value as FormData;
      formData["managerUpn"] = userProfile.upn;

      if (!(await this.userIsManager(userProfile.upn))) {
        throw Error(enUS.exceptions.warning.managerRoleDenied);
      }

      await this.createTaskConversationReferenceIfUndefined(formData, ctx);

      switch (text.toLowerCase()) {
        case "assignspecialist":
          telemetryClient.trackTrace({
            message: "assignspecialist event triggered",
          });
          await AssignspecialistCase.executeCase(formData, ctx);
          break;
        case "assignedspecialist":
          telemetryClient.trackTrace({
            message: "assignedspecialist event triggered",
          });
          await AssignedspecialistCase.executeCase(userProfile, formData, ctx);
          break;
        case "decline":
          telemetryClient.trackTrace({
            message: "manager decline event triggered",
          });
          await DeclineCase.executeCase(userProfile, formData, ctx);
          break;
        default:
          throw Error(enUS.exceptions.critical.unknownMessage);
      }
    });
  }

  private async userIsManager(managerUpn: string) {
    if ((await SqlConnector.getManagerMembershipCount(managerUpn)) === 1) {
      return true;
    }
    return false;
  }

  private async createTaskConversationReferenceIfUndefined(
    formData: FormData,
    ctx: TurnContext
  ) {
    if (formData.taskId) {
      const conversationreference = await SqlConnector.getConversationReferenceByTaskId(
        formData.taskId
      );
      if (!conversationreference) {
        await SqlConnector.updateTaskConversationReference(
          formData.taskId,
          JSON.stringify(ctx.activity)
        );
      }
    }
  }
}
