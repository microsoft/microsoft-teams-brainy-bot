import {enUS} from "../../../resources/Resources";

export const addTaskCard = (
  opt: {
    taskOwnerName: string;
    taskOwnerGivenName: string;
    taskCustomer?: string;
    taskLengthValue?: number;
    taskLengthUnit?: string;
    taskName?: string;
    taskType?: string;
    taskUrl?: string;
    taskGoal?: string;
    taskRequiredSkills?: string;
  },
  attentionText: string,
  formSubmitted?: boolean
) => {
  const cardData = {
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    type: "AdaptiveCard",
    version: "1.2",
    body: [
      {
        type: "ColumnSet",
        columns: [
          {
            type: "Column",
            width: 2,
            items: [
              {
                type: "TextBlock",
                text: enUS.adaptiveCards.genericGreetingText,
                weight: "bolder",
                size: "medium",
              },
              {
                type: "TextBlock",
                text: enUS.adaptiveCards.addTaskCard.intro1TextBlockText,
                isSubtle: true,
                wrap: true,
              },
              {
                type: "TextBlock",
                text: enUS.adaptiveCards.addTaskCard.intro2TextBlockText,
                isSubtle: true,
                wrap: true,
              },
              {
                type: "TextBlock",
                text: "",
                color: "attention",
                wrap: true,
              },
              {
                type: "Input.Text",
                id: "taskCustomer",
                placeholder:
                  enUS.adaptiveCards.addTaskCard
                    .taskCustomerNameTextInputPlaceHolder,
                maxLength: 200,
                value: opt.taskCustomer,
              },
              {
                type: "Input.Text",
                id: "taskName",
                placeholder:
                  enUS.adaptiveCards.addTaskCard.taskNameTextInputPlaceholder,
                maxLength: 200,
                value: opt.taskName,
              },
              {
                type: "Input.Text",
                id: "taskType",
                placeholder:
                  enUS.adaptiveCards.addTaskCard.taskTypeTextInputPlaceholder,
                maxLength: 200,
                value: opt.taskType,
              },
              {
                type: "Input.Text",
                id: "taskUrl",
                placeholder:
                  enUS.adaptiveCards.addTaskCard.taskUrlTextInputPlaceholder,
                maxLength: 500,
                value: opt.taskUrl,
              },
              {
                type: "Input.Text",
                id: "taskGoal",
                placeholder:
                  enUS.adaptiveCards.addTaskCard.taskGoalTextInputPlaceholder,
                maxLength: 200,
                value: opt.taskGoal,
              },
              {
                type: "Input.Text",
                id: "taskRequiredSkills",
                placeholder:
                  enUS.adaptiveCards.addTaskCard
                    .taskSkillsNeededTextInputPlaceholder,
                isMultiline: true,
                maxLength: 1000,
                value: opt.taskRequiredSkills,
              },
              {
                type: "TextBlock",
                text: enUS.adaptiveCards.addTaskCard.taskLengthTextBlockText,
                wrap: true,
              },
              {
                type: "ColumnSet",
                columns: [
                  {
                    type: "Column",
                    width: "stretch",
                    items: [
                      {
                        type: "Input.Number",
                        id: "taskLengthValue",
                        placeholder:
                          enUS.adaptiveCards.addTaskCard
                            .taskLengthValueNumberInputPlaceholder,
                        value: opt.taskLengthValue,
                        max: 100000,
                      },
                    ],
                  },
                  {
                    type: "Column",
                    width: "stretch",
                    items: [
                      {
                        type: "Input.ChoiceSet",
                        id: "taskLengthUnit",
                        placeholder:
                          enUS.adaptiveCards.addTaskCard
                            .taskLengthUnitChoiceSetPlaceholder,
                        choices: [
                          {
                            title:
                              enUS.adaptiveCards.addTaskCard
                                .taskLengthUnitChoiceSetValues.hourTitle,
                            value: "hour",
                          },
                          {
                            title:
                              enUS.adaptiveCards.addTaskCard
                                .taskLengthUnitChoiceSetValues.dayTitle,
                            value: "day",
                          },
                          {
                            title:
                              enUS.adaptiveCards.addTaskCard
                                .taskLengthUnitChoiceSetValues.weekTitle,
                            value: "week",
                          },
                          {
                            title:
                              enUS.adaptiveCards.addTaskCard
                                .taskLengthUnitChoiceSetValues.monthTitle,
                            value: "month",
                          },
                        ],
                        value: opt.taskLengthUnit,
                      },
                    ],
                  },
                ],
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
            text: "tasksubmit",
            value: "submitvalue",
          },
        },
      },
    ],
  };
  if (attentionText) {
    cardData.body[0].columns[0].items[3].text = attentionText;
  }
  if (formSubmitted) {
    delete cardData.actions;
  }
  return cardData;
};
