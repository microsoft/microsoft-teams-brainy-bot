import {enUS} from "../../../resources/Resources";

export const specialistFoundTaskownerCard = (opt: {
  taskCustomer: string;
  taskName: string;
  specialistName: string;
  specialistGivenName: string;
  specialistUpn: string;
  taskUrl: string;
}) => {
  const chatLink = enUS.adaptiveCards.chatLink(
    opt.specialistUpn,
    opt.specialistGivenName,
    opt.taskName,
    opt.taskCustomer
  );
  const meetingLink =
    enUS.adaptiveCards.meetingLinkWihoutAttendees(opt.taskCustomer) +
    `&attendees=${opt.specialistUpn}`;

  const cardData = {
    type: "AdaptiveCard",
    body: [
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            size: "medium",
            weight: "bolder",
            text:
              enUS.adaptiveCards.specialistFoundTaskownerCard
                .specialistFoundIntro1TextBlockText,
            wrap: true,
            maxLines: 2,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "Container",
            items: [
              {
                type: "TextBlock",
                text: enUS.adaptiveCards.specialistFoundTaskownerCard.specialistFoundIntro2TextBlockText(
                  opt.specialistName,
                  opt.taskName,
                  opt.taskCustomer
                ),
                wrap: true,
              },
            ],
          },
          {
            type: "Container",
            items: [
              {
                type: "TextBlock",
                text:
                  enUS.adaptiveCards.specialistFoundTaskownerCard
                    .endSloganTextBlockText,
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
        type: "Action.OpenUrl",
        title: enUS.adaptiveCards.chatActionTitle(opt.specialistGivenName),
        url: chatLink,
      },
      {
        type: "Action.OpenUrl",
        title: enUS.adaptiveCards.meetingActionTitle,
        url: meetingLink,
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
