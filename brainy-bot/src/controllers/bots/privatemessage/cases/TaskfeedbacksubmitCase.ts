import {User} from "../../../../models/Database";
import {TurnContext} from "botbuilder";
import {SqlConnector} from "../../../../connectors/SqlConnector";
import {FormData} from "../../../../models/FormData";
import {enUS} from "../../../../resources/Resources";

export class TaskfeedbacksubmitCase {
  private static async userIsTaskOwner(
    userAadObjectId: string,
    taskId: number
  ) {
    if (
      (await SqlConnector.getTaskOwnerAadObjectId(taskId)) === userAadObjectId
    ) {
      return true;
    }
    return false;
  }

  private static async taskHasNoFeedback(taskId: number) {
    const taskFeedback = await SqlConnector.getTaskFeedback(taskId);
    if (taskFeedback === undefined) {
      return true;
    }
    return false;
  }

  static async executeCase(
    formData: FormData,
    userProfile: User,
    ctx: TurnContext
  ) {
    if (
      !(await this.userIsTaskOwner(userProfile.aadobjectid, formData.taskId)) ||
      !(await this.taskHasNoFeedback(formData.taskId))
    ) {
      throw Error(enUS.exceptions.information.feedbackSubmissionFailed);
    }
    await SqlConnector.insertFeedback(
      formData.taskId,
      userProfile.aadobjectid,
      formData.comment,
      formData.rating
    );
    await ctx.sendActivity(enUS.feedbackThanks);
  }
}
