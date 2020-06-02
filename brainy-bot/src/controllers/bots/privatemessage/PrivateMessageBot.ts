import {User} from "../../../models/Database";
import {TurnContext, TeamsActivityHandler, TeamsInfo} from "botbuilder";
import {NewtaskCase} from "./cases/NewtaskCase";
import {TasksubmitCase} from "./cases/TasksubmitCase";
import {AcceptCase} from "./cases/AcceptCase";
import {DeclineCase} from "./cases/DeclineCase";
import {TaskfeedbacksubmitCase} from "./cases/TaskfeedbacksubmitCase";
import {OptoutCase} from "./cases/OptoutCase";
import {OptinCase} from "./cases/OptinCase";
import {EdittaskCase} from "./cases/EdittaskCase";
import {FormData} from "../../../models/FormData";
import {SqlConnector} from "../../../connectors/SqlConnector";
import {telemetryClient} from "../../../app";
import {enUS} from "../../../resources/Resources";

export class PrivateMessageBot extends TeamsActivityHandler {
  userProfile: User;

  constructor(userProfile: User) {
    super();

    this.userProfile = userProfile;

    this.onMessage(async (ctx: TurnContext) => {
      const text = ctx.activity.text.trim();
      const formData = ctx.activity.value as FormData;

      if (await this.handleTaskOwnerCase(text, ctx, formData)) {
        return;
      }

      if (!(await this.userIsSpecialist(userProfile.aadobjectid))) {
        throw Error(enUS.exceptions.warning.specialistRoleDenied);
      }

      if (await this.handleSpecialistCase(text, ctx, formData)) {
        return;
      }

      throw Error(enUS.exceptions.critical.unknownMessage);
    });
  }

  private async handleTaskOwnerCase(
    text: string,
    ctx: TurnContext,
    formData: FormData
  ): Promise<boolean> {
    switch (text) {
      case "start":
      case "newtask":
        telemetryClient.trackTrace({
          message: "newtask event triggered",
        });
        await NewtaskCase.executeCase(this.userProfile, ctx);
        break;
      case "edittask":
        telemetryClient.trackTrace({
          message: "edittask event triggered",
        });
        delete formData.taskId;
        await EdittaskCase.executeCase(formData, ctx);
        break;
      case "tasksubmit":
        telemetryClient.trackTrace({
          message: "tasksubmit event triggered",
        });
        formData["taskOwnerAadObjectId"] = this.userProfile.aadobjectid;
        formData["taskOwnerUpn"] =
          (await TeamsInfo.getMember(ctx, this.userProfile.aadobjectid))
            .userPrincipalName || "";
        await TasksubmitCase.executeCase(formData, ctx);
        break;
      case "taskfeedbacksubmit":
        telemetryClient.trackTrace({
          message: "taskfeedbacksubmit event triggered",
        });
        await TaskfeedbacksubmitCase.executeCase(
          formData,
          this.userProfile,
          ctx
        );
        break;
      default:
        return false;
    }
    return true;
  }

  private async handleSpecialistCase(
    text: string,
    ctx: TurnContext,
    formData: FormData
  ): Promise<boolean> {
    switch (text) {
      case "accept":
        telemetryClient.trackTrace({
          message: "accept event triggered",
        });
        await AcceptCase.executeCase(this.userProfile, formData, ctx);
        break;
      case "decline":
        telemetryClient.trackTrace({
          message: "specialist decline event triggered",
        });
        await DeclineCase.executeCase(this.userProfile, formData, ctx);
        break;
      case "optout":
        telemetryClient.trackTrace({
          message: "optout event triggered",
        });
        await OptoutCase.executeCase(this.userProfile, ctx);
        break;
      case "optin":
        telemetryClient.trackTrace({
          message: "optin event triggered",
        });
        await OptinCase.executeCase(this.userProfile, ctx);
        break;
      default:
        return false;
    }
    return true;
  }

  private async userIsSpecialist(specialistAadObjectId: string) {
    if (
      (await SqlConnector.getSpecialistMembershipCount(
        specialistAadObjectId
      )) === 1
    ) {
      return true;
    }
    return false;
  }
}
