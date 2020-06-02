import {enUS} from "../../../resources/Resources";

export const chooseSpecialistCard = (
  opt: {
    taskCustomer: string;
    taskOwnerName: string;
    taskOwnerGivenName: string;
    taskLength: string;
    taskName: string;
    taskType: string;
    taskOwnerAadObjectId: string;
    taskUrl: string;
    taskGoal: string;
    taskRequiredSkills: string;
  },
  availableSpecialists: object[]
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
                text:
                  enUS.adaptiveCards.chooseSpecialistCard
                    .chooseSpecialistTextBlockText,
                wrap: true,
              },
              {
                type: "Input.ChoiceSet",
                id: "specialistAadObjectId",
                style: "compact",
                isMultiSelect: false,
                choices: availableSpecialists,
              },
              {
                type: "Input.Text",
                id: "comment",
                placeholder:
                  enUS.adaptiveCards.optionalCommentTextInputPlaceholder,
                maxLength: 1500,
                isMultiline: true,
              },
            ],
          },
        ],
      },
    ],
    actions: [
      {
        type: "Action.Submit",
        title: enUS.adaptiveCards.submitActionTitle,
        data: {
          ...opt,
          msteams: {
            type: "messageBack",
            displayText: "",
            text: "assignedspecialist",
          },
        },
      },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.2",
  };
  return cardData;
};
