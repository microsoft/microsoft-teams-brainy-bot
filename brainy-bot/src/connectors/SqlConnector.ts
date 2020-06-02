import {
  User,
  Task,
  Assignment,
  ManagerTeam,
  Feedback,
  Action,
} from "../models/Database";
import {ConnectionPool, Request, NVarChar, Int, DateTime} from "mssql";
import {ConversationReference} from "botbuilder";
import {FormTask} from "../models/FormTask";
import {enUS} from "../resources/Resources";

export class SqlConnector {
  static connectionPool: ConnectionPool;

  static async setConnectionPool() {
    this.connectionPool = await new ConnectionPool({
      user: `${process.env.DB_USERNAME}`,
      password: `${process.env.DB_PASSWORD}`,
      server: `${process.env.DB_SERVERNAME}`,
      database: `${process.env.DB_NAME}`,
      options: {
        encrypt: true,
      },
    }).connect();
  }

  private static async executeSimpleQuery(query: string) {
    const queryDefinition = query;
    const result = (await SqlConnector.connectionPool.query(queryDefinition))
      .recordset;
    return result;
  }

  static async getAllUserprofiles(): Promise<User[]> {
    const userprofiles = await this.executeSimpleQuery(
      "SELECT * from [dbo].[user]"
    );
    return userprofiles;
  }

  static async getConversationReferenceByAadObjectId(
    aadObjectId: string
  ): Promise<Partial<ConversationReference> | undefined> {
    const queryDefinition =
      "SELECT [conversationreference] from [dbo].[user] WHERE aadobjectid = @aadobjectid";
    const request = new Request(SqlConnector.connectionPool);
    request.input("aadobjectid", NVarChar, aadObjectId);
    const userprofile = ((await request.query(queryDefinition))
      .recordset as Array<Pick<User, "conversationreference">>).pop();
    const conversationReference = userprofile?.conversationreference;
    if (conversationReference) {
      return JSON.parse(conversationReference);
    }
    return undefined;
  }

  static async getAadObjectIdAndNameOfAvailableSpecialists(): Promise<
    Array<Pick<User, "aadobjectid" | "name">>
  > {
    const availableSpecialists = (await this.executeSimpleQuery(
      "SELECT a.[aadobjectid], a.[name] FROM [dbo].[user] a INNER JOIN [dbo].[membership] b ON a.aadobjectid = b.useraadobjectid AND b.typeid = 2 AND a.availability = 1"
    )) as Array<Pick<User, "aadobjectid" | "name">>;
    return availableSpecialists;
  }

  static async getManagerTeamId(): Promise<ManagerTeam["teamid"] | undefined> {
    const result = (await this.executeSimpleQuery(
      "SELECT [teamid] from [dbo].[manager_team]"
    )) as Array<Pick<ManagerTeam, "teamid">>;
    const managerTeam = result.pop();
    return managerTeam?.teamid;
  }

  static async getTaskOwnerAadObjectId(
    taskId: number
  ): Promise<Task["owneraadobjectid"] | undefined> {
    const queryDefinition =
      "SELECT owneraadobjectid FROM [dbo].[task] WHERE id = @id";
    const request = new Request(SqlConnector.connectionPool);
    request.input("id", Int, taskId);
    const task = ((await request.query(queryDefinition)).recordset as Array<
      Pick<Task, "owneraadobjectid">
    >).pop();
    return task?.owneraadobjectid;
  }

  static async getLastAssignedSpecialistAadObjectId(
    taskId: number
  ): Promise<Assignment["useraadobjectid"] | undefined> {
    const queryDefinition =
      "SELECT TOP 1 useraadobjectid FROM [dbo].[assignment] WHERE taskid = @taskid ORDER BY created DESC";
    const request = new Request(SqlConnector.connectionPool);
    request.input("taskid", Int, taskId);
    const assignment = ((await request.query(queryDefinition))
      .recordset as Array<Pick<Assignment, "useraadobjectid">>).pop();
    return assignment?.useraadobjectid;
  }

  static async getConversationReferenceByTaskId(
    id: number
  ): Promise<Partial<ConversationReference> | undefined> {
    const queryDefinition =
      "SELECT [conversationreference] from [dbo].[task] WHERE id = @id";
    const request = new Request(SqlConnector.connectionPool);
    request.input("id", Int, id);
    const task = ((await request.query(queryDefinition)).recordset as Array<
      Pick<Task, "conversationreference">
    >).pop();
    if (task?.conversationreference) {
      const conversationreference = JSON.parse(task.conversationreference);
      return conversationreference;
    }
    return undefined;
  }

  static async getUserprofileByAadObjectId(
    aadObjectId: string
  ): Promise<User | undefined> {
    const queryDefinition =
      "SELECT * from [dbo].[user] WHERE aadobjectid = @aadobjectid";
    const request = new Request(SqlConnector.connectionPool);
    request.input("aadobjectid", NVarChar, aadObjectId);
    const userprofile = ((await request.query(queryDefinition))
      .recordset as User[]).pop();
    return userprofile;
  }

  static async getAvailabilityOfUserprofileByAadObjectId(
    aadObjectId: string
  ): Promise<User["availability"] | undefined> {
    const queryDefinition =
      "SELECT [availability] from [dbo].[user] WHERE aadobjectid = @aadobjectid";
    const request = new Request(SqlConnector.connectionPool);
    request.input("aadobjectid", NVarChar, aadObjectId);
    const userprofiles = (await request.query(queryDefinition))
      .recordset as User[];
    return userprofiles.pop()?.availability;
  }

  static async getNameOfUserprofileByAadObjectId(
    aadObjectId: string
  ): Promise<User["name"] | undefined> {
    const queryDefinition =
      "SELECT [name] from [dbo].[user] WHERE aadobjectid = @aadobjectid";
    const request = new Request(SqlConnector.connectionPool);
    request.input("aadobjectid", NVarChar, aadObjectId);
    const userprofiles = (await request.query(queryDefinition))
      .recordset as Array<Pick<User, "name">>;
    return userprofiles.pop()?.name;
  }

  static async getStatusIdTask(
    id: number
  ): Promise<Task["statusid"] | undefined> {
    const queryDefinition =
      "SELECT [statusid] from [dbo].[task] WHERE id = @id";
    const request = new Request(SqlConnector.connectionPool);
    request.input("id", Int, id);
    const task = ((await request.query(queryDefinition)).recordset as Array<
      Pick<Task, "statusid">
    >).pop();
    return task?.statusid;
  }

  static async getTaskFeedback(
    taskId: number
  ): Promise<Pick<Feedback, "comment" | "rating"> | undefined> {
    const queryDefinition =
      "SELECT [comment], [rating] from [dbo].[feedback] WHERE taskid = @taskid";
    const request = new Request(SqlConnector.connectionPool);
    request.input("taskid", Int, taskId);
    const feedback = ((await request.query(queryDefinition)).recordset as Array<
      Pick<Feedback, "comment" | "rating">
    >).pop();
    return feedback;
  }

  static async getManagerMembershipCount(aadObjectId: string): Promise<number> {
    const queryDefinition =
      "SELECT COUNT(*) as count from [dbo].[membership] WHERE useraadobjectid = @useraadobjectid AND typeid = 1";
    const request = new Request(SqlConnector.connectionPool);
    request.input("useraadobjectid", NVarChar, aadObjectId);
    const result = (await request.query(queryDefinition)).recordset;
    const count = result.pop().count as number;
    return count;
  }

  static async getSpecialistMembershipCount(
    aadObjectId: string
  ): Promise<number> {
    const queryDefinition =
      "SELECT COUNT(*) as count from [dbo].[membership] WHERE useraadobjectid = @useraadobjectid AND typeid = 2";
    const request = new Request(SqlConnector.connectionPool);
    request.input("useraadobjectid", NVarChar, aadObjectId);
    const result = (await request.query(queryDefinition)).recordset;
    const count = result.pop().count as number;
    return count;
  }

  static async updateUserprofileConversationReference(
    aadObjectId: string,
    conversationreference: string
  ) {
    const queryDefinition =
      "UPDATE [dbo].[user] SET conversationreference = @conversationreference WHERE aadobjectid = @aadobjectid";
    const request = new Request(SqlConnector.connectionPool);
    request.input("conversationreference", NVarChar, conversationreference);
    request.input("aadobjectid", NVarChar, aadObjectId);
    await request.query(queryDefinition);
  }

  static async updateTaskStatusId(id: number, statusId: number): Promise<void> {
    const queryDefinition =
      "UPDATE [dbo].[task] SET statusId = @statusId WHERE id = @id";
    const request = new Request(SqlConnector.connectionPool);
    request.input("id", Int, id);
    request.input("statusId", Int, statusId);
    await request.query(queryDefinition);
  }

  static async updateTaskConversationReference(
    id: number,
    conversationReference: string
  ): Promise<void> {
    const queryDefinition =
      "UPDATE [dbo].[task] SET conversationreference = @conversationreference WHERE id = @id";
    const request = new Request(SqlConnector.connectionPool);
    request.input("conversationreference", NVarChar, conversationReference);
    request.input("id", Int, id);
    await request.query(queryDefinition);
  }

  static async updateUserprofileAvailability(
    aadObjectId: string,
    availability: number
  ): Promise<void> {
    const queryDefinition =
      "UPDATE [dbo].[user] SET availability = @availability WHERE aadobjectid = @aadobjectid";
    const request = new Request(SqlConnector.connectionPool);
    request.input("availability", Int, availability);
    request.input("aadobjectid", NVarChar, aadObjectId);
    await request.query(queryDefinition);
  }

  static async insertAction(
    actionType: number,
    userAadObjectId: string,
    taskId: number,
    comment?: string
  ): Promise<Action["id"]> {
    const date = new Date();
    let queryDefinition =
      "INSERT [dbo].[action] ([typeid],[taskid],[useraadobjectid],[created]) OUTPUT INSERTED.id VALUES (@actiontype,@taskid,@useraadobjectid,@date)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("actiontype", Int, actionType);
    request.input("taskid", Int, taskId);
    request.input("useraadobjectid", NVarChar, userAadObjectId);
    request.input("date", DateTime, date);
    if (!(comment == null) && !(comment === "")) {
      queryDefinition =
        "INSERT [dbo].[action] ([typeid],[taskid],[useraadobjectid],[comment],[created]) OUTPUT INSERTED.id VALUES (@actiontype,@taskid,@useraadobjectid,@comment,@date)";
      request.input("comment", NVarChar, comment);
    }
    const action = ((await request.query(queryDefinition))
      .recordset as Action[]).pop();
    if (!action?.id) {
      throw Error(enUS.exceptions.critical.genericSqlDatabaseQueryFailure);
    }
    return action.id;
  }

  static async insertFeedback(
    taskId: number,
    userAadObjectId: string,
    comment: string,
    rating: number
  ): Promise<void> {
    const date = new Date();
    const queryDefinition =
      "INSERT INTO [dbo].[feedback] ([taskid],[useraadobjectid],[comment],[rating],[created]) VALUES (@taskid,@userAadObjectId,@comment,@rating,@date)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("taskid", Int, taskId);
    request.input("useraadobjectid", NVarChar, userAadObjectId);
    request.input("comment", NVarChar, comment);
    request.input("rating", Int, rating);
    request.input("date", DateTime, date);
    await request.query(queryDefinition);
  }

  static async insertTask(task: FormTask): Promise<Task["id"]> {
    const date = new Date();
    const queryDefinition =
      "INSERT INTO [dbo].[task] ([customer],[name],[type],[length],[url],[goal],[requiredskills],[statusid],[owneraadobjectid],[created]) OUTPUT INSERTED.id VALUES (@customer,@name,@type,@length,@url,@goal,@requiredskills,1,@owneraadobjectid,@date)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("customer", NVarChar, task.customer);
    request.input("name", NVarChar, task.name);
    request.input("type", NVarChar, task.type);
    request.input("length", NVarChar, task.length);
    request.input("url", NVarChar, task.url);
    request.input("goal", NVarChar, task.goal);
    request.input("requiredskills", NVarChar, task.requiredSkills);
    request.input("owneraadobjectid", NVarChar, task.ownerAadObjectId);
    request.input("date", DateTime, date);
    const output = ((await request.query(queryDefinition))
      .recordset as Task[]).pop();
    if (!output?.id) {
      throw Error(enUS.exceptions.critical.genericSqlDatabaseQueryFailure);
    }
    return output.id;
  }

  static async insertAssignment(
    userAadObjectId: string,
    taskId: number,
    managerAadObjectId: string,
    actionId: number
  ): Promise<void> {
    const date = new Date();
    const queryDefinition =
      "INSERT [dbo].[assignment] ([useraadobjectid],[taskid],[manageraadobjectid],[actionid],[created]) VALUES (@userAadObjectId,@taskId,@managerAadObjectId,@actionid,@date)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("userAadObjectId", NVarChar, userAadObjectId);
    request.input("taskId", Int, taskId);
    request.input("managerAadObjectId", NVarChar, managerAadObjectId);
    request.input("actionid", Int, actionId);
    request.input("date", DateTime, date);
    await request.query(queryDefinition);
  }

  static async insertUser(
    aadObjectId: string,
    name: string,
    givenname: string,
    conversationreference: string
  ): Promise<void> {
    const queryDefinition =
      "INSERT INTO [dbo].[user]([aadobjectid],[name],[givenname],[conversationreference],[availability]) VALUES (@aadobjectid,@name,@givenname,@conversationreference,@availability)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("aadobjectid", NVarChar, aadObjectId);
    request.input("name", NVarChar, name);
    request.input("givenname", NVarChar, givenname);
    request.input("conversationreference", NVarChar, conversationreference);
    request.input("availability", Int, 1);
    await request.query(queryDefinition);
  }

  static async removeUserByAadObjectId(aadObjectId: string): Promise<void> {
    const queryDefinition =
      "DECLARE @useraadobjectid nvarchar(250) SELECT @useraadobjectid = [aadobjectid] FROM [dbo].[user] where aadobjectid = @aadobjectid DELETE FROM [dbo].[user] WHERE aadobjectid = @useraadobjectid DELETE FROM [dbo].[membership] WHERE useraadobjectid = @useraadobjectid";
    const request = new Request(SqlConnector.connectionPool);
    request.input("aadobjectid", NVarChar, aadObjectId);
    await request.query(queryDefinition);
  }
}
