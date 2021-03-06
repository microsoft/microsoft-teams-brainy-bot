import {User} from "../../../../models/Database";
import {FormData} from "../../../../models/FormData";
import {CardFactory, TurnContext, TeamsInfo} from "botbuilder";
import {SqlConnector} from "../../../../connectors/SqlConnector";
import {taskAcceptedCard} from "../../../../views/adaptivecards/privatemessage/taskAcceptedCard";
import {
  sendActivitiesToUser,
  sendActivitiesToConversationReference,
} from "../../../utils/SendActivities";
import {specialistFoundTaskownerCard} from "../../../../views/adaptivecards/privatemessage/specialistFoundTaskownerCard";
import {addTaskFeedbackCard} from "../../../../views/adaptivecards/privatemessage/addTaskFeedbackCard";
import {SharedValidators} from "../../../utils/SharedValidators";
import {enUS} from "../../../../resources/Resources";

export class AcceptCase {
  static async executeCase(
    userProfile: User,
    formData: FormData,
    ctx: TurnContext
  ) {
    if (
      !(await SharedValidators.taskIsPendingSpecialist(formData.taskId)) ||
      !(await SharedValidators.specialistIsCurrentlyAssignedToTask(
        userProfile.aadobjectid,
        formData.taskId
      ))
    ) {
      throw Error(enUS.exceptions.information.taskUnmodifiable);
    }
    await SqlConnector.insertAction(
      3,
      userProfile.aadobjectid,
      formData.taskId
    );
    await ctx.sendActivity({
      attachments: [CardFactory.adaptiveCard(taskAcceptedCard())],
    });
    await sendActivitiesToUser(formData.taskOwnerAadObjectId, [
      {
        attachments: [
          CardFactory.adaptiveCard(
            specialistFoundTaskownerCard({
              taskCustomer: formData.taskCustomer,
              taskName: formData.taskName,
              specialistName: userProfile.name,
              specialistGivenName: userProfile.givenname,
              specialistAadObjectId: userProfile.aadobjectid,
              specialistUpn:
                (await TeamsInfo.getMember(ctx, ctx.activity.from.id))
                  .userPrincipalName || "",
              taskUrl: formData.taskUrl,
            })
          ),
          CardFactory.adaptiveCard(addTaskFeedbackCard(formData.taskId)),
        ],
      },
    ]);
    const conversationReference = await SqlConnector.getConversationReferenceByTaskId(
      formData.taskId
    );
    if (!conversationReference) {
      throw Error(enUS.exceptions.error.taskNotFound);
    }
    await sendActivitiesToConversationReference(conversationReference, [
      {
        textFormat: "markdown",
        text: enUS.acceptNotification(userProfile.name),
      },
    ]);
    await SqlConnector.updateTaskStatusId(formData.taskId, 4);
  }
}
