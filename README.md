# Brainy

| [Documentation](https://github.com/microsoft/microsoft-teams-brainy-bot/wiki) | [Deployment guide](https://github.com/microsoft/microsoft-teams-brainy-bot/wiki/Deployment-Guide) | [Architecture](https://github.com/microsoft/microsoft-teams-brainy-bot/wiki/Architecture) |
| ---- | ---- | ---- |

The Brainy bot is an app template for Microsoft Teams. Finding the right person for a specific task can be a challenge, especially when different roles within an organization must work as a team. Brainy makes the collaboration across these roles more structured and efficient by orchestrating its flow.

The three roles are as follows:

- **Task owner (TO)**: submits a task
- **Task manager (TM)**: assigns task to a task executor or declines it
- **Task executor (TE)**: accepts or declines the task

The Brainy bot enables a fast and simple process flow through the use of customized adaptive cards which embed various user friendly features.

# Main Features

**Task owner components:**

* To submit a new task, the task owner fills in a task form, which includes different types of input fields.

![overview1.gif](https://github.com/microsoft/microsoft-teams-brainy-bot/wiki/.attachments/overview1.gif)

* The TO will be notified once a task has been assigned and accepted.

**Task manager components:**

- The task submitted by the TO is directed to a group where it is reviewed by one or multiple TM.
- The task can be declined with the click of a button; the decline notification and related comment will then land in the TO's chat, after which the task can be modified and re-submitted.
- The TM can assign the task through selecting the desired TE from a drop-down list; TM can also add a comment to offer further guidance to the TE.

![overview2.gif](https://github.com/microsoft/microsoft-teams-brainy-bot/wiki/.attachments/overview2.gif)

**Task executor components:**

* Once the TM assigns a task, a new task notification will be sent to the TE.

![overview3.gif](https://github.com/microsoft/microsoft-teams-brainy-bot/wiki/.attachments/overview3.gif)

- The card received by the TE contains all information submitted by the TO and the TM's comment
- The TE can Accept/Decline, open a chat with the TM/TO and schedule a meeting with the TM/TO through the click of a button

## Legal Notice

This app template is provided under the [MIT License](https://github.com/microsoft/microsoft-teams-brainy-bot/blob/master/LICENSE) terms. In addition to these terms, by using this app template you agree to the following:

- You are responsible for complying with all applicable privacy and security regulations related to use, collection and handling of any personal data by your app. This includes complying with all internal privacy and security policies of your organization if your app is developed to be sideloaded internally within your organization.
- Where applicable, you may be responsible for data related incidents or data subject requests for data collected through your app.
- Any trademarks or registered trademarks of Microsoft in the United States and/or other countries and logos included in this repository are the property of Microsoft, and the license for this project does not grant you rights to use any Microsoft names, logos or trademarks outside of this repository. Microsoft’s general trademark guidelines can be found [here](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx).
- Use of this template does not guarantee acceptance of your app to the Teams app store. To make this app available in the Teams app store, you will have to comply with the [submission and validation process](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/appsource/publish), and all associated requirements such as including your own privacy statement and terms of use for your app.