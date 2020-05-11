import {FormData} from "../../../../models/FormData";
import {SqlConnector} from "../../../../connectors/SqlConnector";
import {sendActivitiesToUser} from "../../../utils/SendActivities";
import {TurnContext, CardFactory} from "botbuilder";
import {newTaskCard} from "../../../../views/adaptivecards/privatemessage/newTaskCard";
import {User} from "../../../../models/Database";
import {enUS} from "../../../../resources/Resources";

export class AssignedspecialistCase {
  private static specialistIsSelected(specialistUpn: string) {
    if (!(typeof specialistUpn === "undefined")) {
      return true;
    }
    return false;
  }

  private static async taskCanBeAssignedToSpecialist(
    taskId: number,
    specialistUpn: string
  ) {
    const statusTask = await SqlConnector.getStatusIdTask(taskId);
    const availabilitySpecialist = await SqlConnector.getAvailabilityOfUserprofileByUpn(
      specialistUpn
    );
    if (statusTask === 1 && availabilitySpecialist === true) {
      return true;
    }

    return false;
  }

  static async executeCase(
    userProfile: User,
    formData: FormData,
    ctx: TurnContext
  ) {
    await ctx.deleteActivity(ctx.activity.replyToId!);
    if (!this.specialistIsSelected(formData.specialistUpn)) {
      throw Error(enUS.exceptions.information.specialistNotSelected);
    }
    if (
      !(await this.taskCanBeAssignedToSpecialist(
        formData.taskId,
        formData.specialistUpn
      ))
    ) {
      throw Error(enUS.exceptions.information.taskAssignmentNotAllowed);
    }
    const actionId = await SqlConnector.insertAction(
      2,
      userProfile.upn,
      formData.taskId,
      formData.comment
    );
    const specialistName = await SqlConnector.getNameOfUserprofileByUpn(
      formData.specialistUpn
    );
    if (!specialistName) {
      throw Error(enUS.exceptions.error.userNotFound);
    }
    if (formData.comment === "") {
      formData.comment = enUS.noAssignmentComment;
    }
    await ctx.sendActivity({
      textFormat: "markdown",
      text: enUS.assignmentNotification(
        userProfile.givenname,
        specialistName,
        formData.comment
      ),
    });
    await SqlConnector.insertAssignment(
      formData.specialistUpn,
      formData.taskId,
      userProfile.upn,
      actionId
    );
    await SqlConnector.updateTaskStatusId(formData.taskId, 3);
    await sendActivitiesToUser(formData.specialistUpn, [
      {
        attachments: [
          CardFactory.adaptiveCard(
            newTaskCard(formData, userProfile.givenname)
          ),
        ],
      },
    ]);
  }
}
