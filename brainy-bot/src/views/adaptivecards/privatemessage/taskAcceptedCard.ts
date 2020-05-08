import {enUS} from "../../../resources/Resources";

export const taskAcceptedCard = () => {
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
                  enUS.adaptiveCards.taskAcceptedCard
                    .acceptedIntroTextBlockText,
                wrap: true,
              },
            ],
          },
        ],
      },
    ],
    actions: [
      {
        type: "Action.Submit",
        title: enUS.adaptiveCards.taskAcceptedCard.pauseAvailabilityActionTitle,
        data: {
          msteams: {
            type: "messageBack",
            displayText: "",
            text: "optout",
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
