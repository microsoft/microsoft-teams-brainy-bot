import {enUS} from "../../../resources/Resources";

export const qualifyTaskCard = (opt: {
  taskCustomer: string;
  taskOwnerName: string;
  taskOwnerGivenName: string;
  taskLength: string;
  taskName: string;
  taskType: string;
  taskOwnerAadObjectId: string;
  taskOwnerUpn: string;
  taskUrl: string;
  taskGoal: string;
  taskRequiredSkills: string;
}) => {
  const chatLink = enUS.adaptiveCards.chatLink(
    opt.taskOwnerUpn,
    opt.taskOwnerGivenName,
    opt.taskName,
    opt.taskCustomer
  );

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
            text: enUS.adaptiveCards.genericGreetingText,
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
                text: enUS.adaptiveCards.qualifyTaskCard.qualifyTaskIntroTextBlockText(
                  opt.taskOwnerName
                ),
                wrap: true,
              },
            ],
          },
          {
            type: "FactSet",
            facts: [
              {
                title: enUS.adaptiveCards.taskCustomerFactTitle,
                value: opt.taskCustomer,
              },
              {
                title: enUS.adaptiveCards.taskNameFactTitle,
                value: opt.taskName,
              },
              {
                title: enUS.adaptiveCards.taskTypeFactTitle,
                value: opt.taskType,
              },
              {
                title: enUS.adaptiveCards.taskLengthFactTitle,
                value: opt.taskLength,
              },
              {
                title: enUS.adaptiveCards.taskGoalFactTitle,
                value: opt.taskGoal,
              },
              {
                title: enUS.adaptiveCards.taskRequiredSkillsFactTitle,
                value: opt.taskRequiredSkills,
              },
            ],
          },
          {
            type: "Container",
            items: [
              {
                type: "TextBlock",
                text: enUS.adaptiveCards.qualifyTaskCard.mainTextBox,
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
        title: enUS.adaptiveCards.qualifyTaskCard.assignSpecialistActionTitle,
        data: {
          ...opt,
          msteams: {
            type: "messageBack",
            displayText: "",
            text: "assignspecialist",
          },
        },
      },
      {
        type: "Action.ShowCard",
        title: enUS.adaptiveCards.declineActionTitle,
        card: {
          type: "AdaptiveCard",
          body: [
            {
              type: "Input.Text",
              id: "comment",
              placeholder:
                enUS.adaptiveCards.requiredCommentTextInputPlaceholder,
              maxLength: 1500,
              isMultiline: true,
            },
          ],
          actions: [
            {
              type: "Action.Submit",
              title: enUS.adaptiveCards.confirmDeclineActionTitle,
              data: {
                ...opt,
                msteams: {
                  type: "messageBack",
                  displayText: "",
                  text: "decline",
                },
              },
            },
          ],
        },
      },
      {
        type: "Action.OpenUrl",
        title: enUS.adaptiveCards.taskUrlActionTitle,
        url: opt.taskUrl,
      },
      {
        type: "Action.OpenUrl",
        title: enUS.adaptiveCards.chatActionTitle(opt.taskOwnerGivenName),
        url: chatLink,
      },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.2",
  };
  return cardData;
};
