import {enUS} from "../../../resources/Resources";

export const addTaskFeedbackCard = (taskId: number) => {
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
                text:
                  enUS.adaptiveCards.addTaskFeedbackCard
                    .feedbackIntroTextBlockText,
                wrap: true,
              },
              {
                type: "Input.Text",
                id: "comment",
                placeholder:
                  enUS.adaptiveCards.optionalCommentTextInputPlaceholder,
                maxLength: 1500,
                isMultiline: true,
              },
              {
                type: "TextBlock",
                text:
                  enUS.adaptiveCards.addTaskFeedbackCard
                    .feedbackRatingTextBlockText,
                wrap: true,
              },
            ],
          },
        ],
      },
    ],
    actions: [
      {
        type: "Action.ShowCard",
        title: enUS.adaptiveCards.addTaskFeedbackCard.negativeRatingActionTitle,
        card: {
          type: "AdaptiveCard",
          actions: [
            {
              type: "Action.Submit",
              title: enUS.adaptiveCards.submitActionTitle,
              data: {
                rating: 1,
                taskId,
                msteams: {
                  type: "messageBack",
                  displayText: "",
                  text: "taskfeedbacksubmit",
                  value: "comment",
                },
              },
            },
          ],
        },
      },
      {
        type: "Action.ShowCard",
        title: enUS.adaptiveCards.addTaskFeedbackCard.neutralRatingActionTitle,
        card: {
          type: "AdaptiveCard",
          actions: [
            {
              type: "Action.Submit",
              title: enUS.adaptiveCards.submitActionTitle,
              data: {
                rating: 2,
                taskId,
                msteams: {
                  type: "messageBack",
                  displayText: "",
                  text: "taskfeedbacksubmit",
                  value: "comment",
                },
              },
            },
          ],
        },
      },
      {
        type: "Action.ShowCard",
        title: enUS.adaptiveCards.addTaskFeedbackCard.positiveRatingActionTitle,
        card: {
          type: "AdaptiveCard",
          actions: [
            {
              type: "Action.Submit",
              title: enUS.adaptiveCards.submitActionTitle,
              data: {
                rating: 3,
                taskId,
                msteams: {
                  type: "messageBack",
                  displayText: "",
                  text: "taskfeedbacksubmit",
                  value: "comment",
                },
              },
            },
          ],
        },
      },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.2",
  };
  return cardData;
};
