import {enUS} from "./../../../../resources/Resources";
import {User} from "../../../../models/Database";
import {FormData} from "../../../../models/FormData";
import {TurnContext} from "botbuilder";
import {SqlConnector} from "../../../../connectors/SqlConnector";
import {sendActivitiesToConversationReference} from "../../../utils/SendActivities";
import {SharedValidators} from "../../../utils/SharedValidators";

export class DeclineCase {
  static async executeCase(
    userProfile: User,
    formData: FormData,
    ctx: TurnContext
  ) {
    if (
      !(await SharedValidators.taskIsPendingSpecialist(formData.taskId)) ||
      !(await SharedValidators.specialistIsCurrentlyAssignedToTask(
        userProfile.upn,
        formData.taskId
      ))
    ) {
      throw Error(enUS.exceptions.information.taskUnmodifiable);
    }
    if (!SharedValidators.declineCommentIsValid(formData.comment)) {
      throw Error(enUS.exceptions.information.declineCommentMissing);
    }
    await ctx.sendActivity(enUS.specialistDeclineConfirmation);
    const conversationReference = await SqlConnector.getConversationReferenceByTaskId(
      formData.taskId
    );
    if (!conversationReference) {
      throw Error(enUS.exceptions.error.taskNotFound);
    }
    await sendActivitiesToConversationReference(conversationReference, [
      {
        textFormat: "markdown",
        text: enUS.specialistDeclineNotification(
          userProfile.name,
          formData.comment
        ),
      },
    ]);
    await SqlConnector.updateTaskStatusId(formData.taskId, 1);
    await SqlConnector.insertAction(
      1,
      userProfile.upn,
      formData.taskId,
      formData.comment
    );
  }
}
