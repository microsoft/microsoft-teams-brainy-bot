import {CardFactory, TurnContext} from "botbuilder";
import {addTaskCard} from "../../../../views/adaptivecards/privatemessage/addTaskCard";
import {SqlConnector} from "../../../../connectors/SqlConnector";
import {confirmTaskCard} from "../../../../views/adaptivecards/privatemessage/confirmTaskCard";
import {qualifyTaskCard} from "../../../../views/adaptivecards/manager/qualifyTaskCard";
import {FormData} from "../../../../models/FormData";
import {FormTask} from "../../../../models/FormTask";
import {sendActivitiesToManagerChannel} from "../../../utils/SendActivities";
import {trackDetailedException} from "../../../utils/trackDetailedException";
import {enUS} from "../../../../resources/Resources";

export class TasksubmitCase {
  private static urlRegex = "^https://.*";

  private static taskIsValid(formData: FormData) {
    const task = new FormTask(
      formData.taskCustomer,
      formData.taskLength,
      formData.taskName,
      formData.taskType,
      formData.taskUrl,
      formData.taskGoal,
      formData.taskRequiredSkills,
      formData.taskOwnerAadObjectId
    );
    const taskValues = Object.values(task);
    if (taskValues.includes("") || taskValues.includes(undefined)) {
      return false;
    }
    const regex = new RegExp(this.urlRegex);
    if (!formData.taskUrl.match(regex)) {
      return false;
    }
    return true;
  }

  static async executeCase(formData: FormData, ctx: TurnContext) {
    formData = this.parseFormDataToAddTaskLength(formData);
    if (!this.taskIsValid(formData)) {
      trackDetailedException(
        new Error(enUS.exceptions.information.newTaskFormDataMissing),
        ctx,
        1
      );
      let attentionText = enUS.exceptions.information.newTaskFormDataMissing;
      const regex = new RegExp(this.urlRegex);
      if (!formData.taskUrl.match(regex)) {
        attentionText +=
          "\n\n" + enUS.exceptions.information.newTaskFormValidUrlMissing;
      }
      trackDetailedException(
        new Error(enUS.exceptions.information.newTaskFormValidUrlMissing),
        ctx,
        1
      );
      await ctx.updateActivity({
        attachments: [
          CardFactory.adaptiveCard(addTaskCard(formData, attentionText)),
        ],
        id: ctx.activity.replyToId,
        type: "message",
      });
      return;
    }
    const task = new FormTask(
      formData.taskCustomer,
      formData.taskLength,
      formData.taskName,
      formData.taskType,
      formData.taskUrl,
      formData.taskGoal,
      formData.taskRequiredSkills,
      formData.taskOwnerAadObjectId
    );
    const taskId = await SqlConnector.insertTask(task);
    formData["taskId"] = taskId;
    await sendActivitiesToManagerChannel(ctx, [
      {
        attachments: [CardFactory.adaptiveCard(qualifyTaskCard(formData))],
      },
    ]);
    await ctx.updateActivity({
      attachments: [CardFactory.adaptiveCard(addTaskCard(formData, "", true))],
      id: ctx.activity.replyToId,
      type: "message",
    });
    await ctx.sendActivity({
      attachments: [CardFactory.adaptiveCard(confirmTaskCard())],
    });
  }

  static parseFormDataToAddTaskLength(formData: FormData) {
    const allowedLengthUnits = ["hour", "day", "week", "month"];
    if (
      formData["taskLengthValue"] > 0 &&
      allowedLengthUnits.includes(formData["taskLengthUnit"])
    ) {
      if (formData["taskLengthValue"] > 1) {
        formData[
          "taskLength"
        ] = `${formData.taskLengthValue} ${formData.taskLengthUnit}s`;
      } else {
        formData[
          "taskLength"
        ] = `${formData.taskLengthValue} ${formData.taskLengthUnit}`;
      }
    }
    return formData;
  }
}
