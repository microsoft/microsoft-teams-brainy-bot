import {enUS} from "./../../../resources/Resources";
export const requestDeniedCard = (
  opt: {
    taskOwnerName: string;
    taskOwnerGivenName: string;
    taskCustomer: string;
    taskLengthValue: number;
    taskLengthUnit: string;
    taskName: string;
    taskType: string;
    taskUrl: string;
    taskGoal: string;
    taskRequiredSkills: string;
    comment: string;
  },
  denierName: string
) => {
  const cardData = {
    type: "AdaptiveCard",
    body: [
      {
        type: "Container",
        items: [
          {
            type: "Container",
            items: [
              {
                type: "TextBlock",
                text: enUS.adaptiveCards.requestDeniedCard.requestDeniedTextBlockText(
                  opt.taskName,
                  opt.taskCustomer,
                  denierName
                ),
                wrap: true,
              },
            ],
          },
        ],
      },
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: enUS.adaptiveCards.taskUrlActionTitle,
        url: opt.taskUrl,
      },
      {
        type: "Action.ShowCard",
        title: enUS.adaptiveCards.requestDeniedCard.showDenierCommentActionTitle(
          denierName
        ),
        card: {
          type: "AdaptiveCard",
          body: [
            {
              type: "TextBlock",
              text: opt.comment,
              wrap: true,
            },
          ],
        },
      },
      {
        type: "Action.Submit",
        title: enUS.adaptiveCards.requestDeniedCard.editTaskActionTitle,
        data: {
          ...opt,
          msteams: {
            type: "messageBack",
            displayText: "",
            text: "edittask",
          },
        },
      },
      {
        type: "Action.Submit",
        title: enUS.adaptiveCards.postTaskActionTitle,
        data: {
          msteams: {
            type: "messageBack",
            displayText: enUS.adaptiveCards.postTaskActionDisplayText,
            text: "newtask",
          },
        },
      },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.2",
  };
  return cardData;
};
