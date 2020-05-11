import {enUS} from "./../../../resources/Resources";
export const confirmTaskCard = () => {
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
                  enUS.adaptiveCards.confirmTaskCard.confirmationTextBlockText,
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
