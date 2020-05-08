import {User} from "../../../../models/Database";
import {TurnContext, CardFactory} from "botbuilder";
import {SqlConnector} from "../../../../connectors/SqlConnector";
import {requestDeniedCard} from "../../../../views/adaptivecards/privatemessage/requestDeniedCard";
import {addTaskFeedbackCard} from "../../../../views/adaptivecards/privatemessage/addTaskFeedbackCard";
import {sendActivitiesToUser} from "../../../utils/SendActivities";
import {FormData} from "../../../../models/FormData";
import {SharedValidators} from "../../../utils/SharedValidators";
import {enUS} from "../../../../resources/Resources";

export class DeclineCase {
  private static async taskCanBeDeclined(taskId: number) {
    const statusTask = await SqlConnector.getStatusIdTask(taskId);
    if (statusTask === 1) {
      return true;
    }
    return false;
  }

  static async executeCase(
    userProfile: User,
    formData: FormData,
    ctx: TurnContext
  ) {
    if (!(await this.taskCanBeDeclined(formData.taskId))) {
      throw Error(enUS.exceptions.information.taskUnmodifiable);
    }
    if (!SharedValidators.declineCommentIsValid(formData.comment)) {
      await ctx.sendActivity(enUS.exceptions.information.declineCommentMissing);
      return;
    }
    await SqlConnector.insertAction(
      1,
      userProfile.upn,
      formData.taskId,
      formData.comment
    );
    await ctx.sendActivity({
      textFormat: "markdown",
      text: enUS.managerDeclineNotification(
        userProfile.givenname,
        formData.comment
      ),
    });
    await sendActivitiesToUser(formData.taskOwnerUpn, [
      {
        attachments: [
          CardFactory.adaptiveCard(
            requestDeniedCard(formData, userProfile.name)
          ),
        ],
      },
      {
        attachments: [
          CardFactory.adaptiveCard(addTaskFeedbackCard(formData.taskId)),
        ],
      },
    ]);
    await SqlConnector.updateTaskStatusId(formData.taskId, 2);
  }
}
