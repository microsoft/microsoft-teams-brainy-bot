import {TurnContext, Activity, ConversationReference} from "botbuilder";
import {SqlConnector} from "../../connectors/SqlConnector";
import {adapter} from "../../app";
import {enUS} from "../../resources/Resources";

export async function sendActivitiesToUser(
  upn: string,
  activities: Array<Partial<Activity>>
): Promise<void> {
  const conversationReference = await SqlConnector.getConversationReferenceByUpn(
    upn
  );
  if (!conversationReference) {
    throw Error(enUS.exceptions.error.userNotFound);
  }
  await adapter.createConversation(
    conversationReference,
    async (newCtx: TurnContext) => {
      await newCtx.sendActivities(activities);
    }
  );
}

export async function sendActivitiesToConversationReference(
  conversationReference: Partial<ConversationReference>,
  activities: Array<Partial<Activity>>
): Promise<void> {
  await adapter.continueConversation(
    conversationReference,
    async turnContext => {
      await turnContext.sendActivities(activities);
    }
  );
}

export async function sendActivitiesToManagerChannel(
  currentTurnContext: TurnContext,
  activities: Array<Partial<Activity>>
): Promise<void> {
  const currentServiceUrl = currentTurnContext.activity.serviceUrl;
  const currentTenantId = currentTurnContext.activity.conversation.tenantId;
  const teamId = await SqlConnector.getManagerTeamId();
  if (!teamId) {
    throw Error(enUS.exceptions.critical.managerTeamNotFound);
  }
  const conversationReference = {
    conversation: {
      conversationType: "channel",
      id: teamId,
      tenantId: currentTenantId,
      isGroup: true,
      name: "newActivity",
    },
    channelId: "msteams",
    serviceUrl: currentServiceUrl,
  };
  const groupTurnContext = new TurnContext(adapter, conversationReference);
  await groupTurnContext.sendActivities(activities);
}
