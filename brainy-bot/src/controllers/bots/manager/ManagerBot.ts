import {TurnContext, TeamsActivityHandler, TeamsInfo} from "botbuilder";
import {AssignedspecialistCase} from "./cases/AssignedspecialistCase";
import {AssignspecialistCase} from "./cases/AssignspecialistCase";
import {SqlConnector} from "../../../connectors/SqlConnector";
import {DeclineCase} from "./cases/DeclineCase";
import {FormData} from "../../../models/FormData";
import {User} from "../../../models/Database";
import {telemetryClient} from "../../../app";
import {enUS} from "../../../resources/Resources";

export class ManagerBot extends TeamsActivityHandler {
  userProfile: User;

  constructor(userProfile: User) {
    super();

    this.userProfile = userProfile;

    this.onMessage(async (ctx: TurnContext) => {
      const text = ctx.activity.text.trim();
      const formData = ctx.activity.value as FormData;
      formData["managerAadObjectId"] = this.userProfile.aadobjectid;
      formData["managerUpn"] =
        (await TeamsInfo.getMember(ctx, this.userProfile.aadobjectid))
          .userPrincipalName || "";

      if (!(await this.userIsManager(this.userProfile.aadobjectid))) {
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
          await AssignedspecialistCase.executeCase(
            this.userProfile,
            formData,
            ctx
          );
          break;
        case "decline":
          telemetryClient.trackTrace({
            message: "manager decline event triggered",
          });
          await DeclineCase.executeCase(this.userProfile, formData, ctx);
          break;
        default:
          throw Error(enUS.exceptions.critical.unknownMessage);
      }
    });
  }

  private async userIsManager(managerAadObjectId: string) {
    if (
      (await SqlConnector.getManagerMembershipCount(managerAadObjectId)) === 1
    ) {
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
