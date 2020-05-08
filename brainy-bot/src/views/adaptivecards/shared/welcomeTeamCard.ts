import {enUS} from "../../../resources/Resources";

export const welcomeTeamCard = () => {
  const cardData = {
    type: "AdaptiveCard",
    body: [
      {
        type: "Container",
        items: [
          {
            type: "Image",
            url: enUS.adaptiveCards.iconImageUrl(),
          },
          {
            type: "TextBlock",
            size: "large",
            weight: "bolder",
            text: enUS.adaptiveCards.genericGreetingText,
          },
          {
            type: "TextBlock",
            text:
              enUS.adaptiveCards.welcomeTeamCard
                .welcomeTeamCardIntroTextBlockText,
            wrap: true,
          },
        ],
      },
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: enUS.adaptiveCards.tourActionTitle,
        url: enUS.adaptiveCards.tourActionUrl(),
      },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.2",
  };
  return cardData;
};
