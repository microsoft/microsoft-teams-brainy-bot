import {enUS} from "./../../../resources/Resources";
export const newTaskCard = (
  opt: {
    taskCustomer: string;
    taskOwnerName: string;
    taskOwnerGivenName: string;
    taskLength: string;
    taskName: string;
    taskType: string;
    taskOwnerUpn: string;
    managerUpn: string;
    taskUrl: string;
    taskGoal: string;
    taskRequiredSkills: string;
    comment: string;
    taskId: number;
  },
  managerGivenName: string
) => {
  const managerChatLink = enUS.adaptiveCards.chatLink(
    opt.managerUpn,
    managerGivenName,
    opt.taskName,
    opt.taskCustomer
  );
  const taskOwnerChatLink = enUS.adaptiveCards.chatLink(
    opt.taskOwnerUpn,
    managerGivenName,
    opt.taskName,
    opt.taskCustomer
  );
  const meetingLink =
    enUS.adaptiveCards.meetingLinkWihoutAttendees(opt.taskCustomer) +
    `&attendees=${opt.taskOwnerUpn}`;

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
            text: enUS.adaptiveCards.newTaskCard.newTaskIntro1TextBlockText,
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
                text: enUS.adaptiveCards.newTaskCard.newTaskIntro2TextBlockText(
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
                text: enUS.adaptiveCards.newTaskCard.endSloganTextBlockText,
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
        title: enUS.adaptiveCards.acceptActionTitle,
        data: {
          ...opt,
          taskOwnerName: opt.taskOwnerName,
          msteams: {
            type: "messageBack",
            displayText: "",
            text: "accept",
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
        type: "Action.ShowCard",
        title: enUS.adaptiveCards.newTaskCard.showManagerCommentActionTitle(
          managerGivenName
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
        type: "Action.ShowCard",
        title: enUS.adaptiveCards.newTaskCard.showMoreOptionsActionTitle,
        card: {
          type: "AdaptiveCard",
          actions: [
            {
              type: "Action.OpenUrl",
              title: enUS.adaptiveCards.chatWithManagerActionTitle(
                managerGivenName
              ),
              url: managerChatLink,
            },
            {
              type: "Action.OpenUrl",
              title: enUS.adaptiveCards.chatWithTaskownerActionTitle(
                opt.taskOwnerGivenName
              ),
              url: taskOwnerChatLink,
            },
            {
              type: "Action.OpenUrl",
              title: enUS.adaptiveCards.meetingActionTitle,
              url: meetingLink,
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
