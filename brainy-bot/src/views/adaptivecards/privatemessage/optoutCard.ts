import {enUS} from "../../../resources/Resources";

export const optoutCard = () => {
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
                text: enUS.adaptiveCards.optoutCard.optoutIntroTextBlockText,
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
        title: enUS.adaptiveCards.optoutCard.resumeAvailabilityActionTitle,
        data: {
          msteams: {
            type: "messageBack",
            displayText:
              enUS.adaptiveCards.optoutCard.resumeAvailabilityDisplayText,
            text: "optin",
          },
        },
      },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.2",
  };
  return cardData;
};
