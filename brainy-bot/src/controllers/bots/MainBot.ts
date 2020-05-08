import {
  CardFactory,
  TeamsActivityHandler,
  TeamsChannelAccount,
  TeamsInfo,
  TurnContext,
} from "botbuilder";
import {welcomeTaskownerCard} from "../../views/adaptivecards/privatemessage/welcomeTaskownerCard";
import {sendActivitiesToUser} from "../utils/SendActivities";
import {SqlConnector} from "./../../connectors/SqlConnector";
import {welcomeTeamCard} from "./../../views/adaptivecards/shared/welcomeTeamCard";
import {ManagerBot} from "./manager/ManagerBot";
import {PrivateMessageBot} from "./privatemessage/PrivateMessageBot";
import {enUS} from "../../resources/Resources";

export class MainBot extends TeamsActivityHandler {
  constructor() {
    super();
    this.onMessage(async (ctx: TurnContext, next) => {
      const conversationType = ctx.activity.conversation.conversationType;
      const currentaadObjectId = ctx.activity.from.aadObjectId;
      const userProfile = await SqlConnector.getUserprofileByAadObjectId(
        currentaadObjectId!
      );
      if (!userProfile) {
        throw Error(enUS.exceptions.error.userNotFound);
      }
      let bot = new TeamsActivityHandler();
      switch (conversationType) {
        case "personal":
          bot = new PrivateMessageBot(userProfile);
          break;
        case "channel":
          bot = new ManagerBot(userProfile);
          break;
        default:
          break;
      }
      await bot.run(ctx);
      await next();
    });

    this.onMembersAdded(async (ctx: TurnContext) => {
      const botId = ctx.activity.recipient.id;
      const membersAdded = ctx.activity.membersAdded;
      const conversationType = ctx.activity.conversation.conversationType;

      if (membersAdded) {
        const isBot = (member: TeamsChannelAccount) => member.id === botId;

        const botIsAdded = membersAdded.find(isBot);
        const addedMembers = membersAdded.filter(x => !isBot(x));

        if (botIsAdded && conversationType !== "personal") {
          await ctx.sendActivity({
            attachments: [CardFactory.adaptiveCard(welcomeTeamCard())],
          });
          const conversationMembers = await TeamsInfo.getMembers(ctx);

          for (const conversationMember of conversationMembers) {
            await this.InsertOrUpdateAndWelcomeUser(ctx, conversationMember);
          }
        }

        if (addedMembers) {
          const conversationMembers = await TeamsInfo.getMembers(ctx);
          for (const addedMember of addedMembers) {
            const activityMember = conversationMembers.find(
              member => member.id === addedMember.id
            );
            await this.InsertOrUpdateAndWelcomeUser(ctx, activityMember!);
          }
        }
      }
    });

    this.onMembersRemoved(async (ctx: TurnContext, next) => {
      const membersRemoved = ctx.activity.membersRemoved!;
      for (const removedMember of membersRemoved) {
        await SqlConnector.removeUserByAadObjectId(removedMember.aadObjectId!);
      }
      await next();
    });
  }

  private async InsertOrUpdateAndWelcomeUser(
    ctx: TurnContext,
    member: TeamsChannelAccount
  ) {
    ctx.activity.from.id = member.id;
    ctx.activity.from.aadObjectId = member.aadObjectId;
    const conversationReference = TurnContext.getConversationReference(
      ctx.activity
    );
    const userprofile = await SqlConnector.getUserprofileByUpn(
      member.userPrincipalName!
    );
    if (!userprofile) {
      await SqlConnector.insertUser(
        member.userPrincipalName!,
        member.aadObjectId!,
        member.name,
        member.givenName!,
        member.surname!,
        member.email!,
        JSON.stringify(conversationReference)
      );

      await sendActivitiesToUser(member.userPrincipalName!, [
        {
          attachments: [CardFactory.adaptiveCard(welcomeTaskownerCard())],
        },
      ]);
    } else {
      await SqlConnector.updateUserprofileConversationReference(
        member.userPrincipalName!,
        JSON.stringify(conversationReference)
      );
    }
  }
}
