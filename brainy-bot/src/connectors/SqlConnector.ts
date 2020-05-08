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

  static async getConversationReferenceByUpn(
    upn: string
  ): Promise<Partial<ConversationReference> | undefined> {
    const queryDefinition =
      "SELECT [conversationreference] from [dbo].[user] WHERE upn = @upn";
    const request = new Request(SqlConnector.connectionPool);
    request.input("upn", NVarChar, upn);
    const userprofile = ((await request.query(queryDefinition))
      .recordset as Array<Pick<User, "conversationreference">>).pop();
    const conversationReference = userprofile?.conversationreference;
    if (conversationReference) {
      return JSON.parse(conversationReference);
    }
    return undefined;
  }

  static async getUpnAndNameOfAvailableSpecialists(): Promise<
    Array<Pick<User, "upn" | "name">>
  > {
    const availableSpecialists = (await this.executeSimpleQuery(
      "SELECT a.[upn], a.[name] FROM [dbo].[user] a INNER JOIN [dbo].[membership] b ON a.upn = b.userupn AND b.typeid = 2 AND a.availability = 1"
    )) as Array<Pick<User, "upn" | "name">>;
    return availableSpecialists;
  }

  static async getManagerTeamId(): Promise<ManagerTeam["teamid"] | undefined> {
    const result = (await this.executeSimpleQuery(
      "SELECT [teamid] from [dbo].[manager_team]"
    )) as Array<Pick<ManagerTeam, "teamid">>;
    const managerTeam = result.pop();
    return managerTeam?.teamid;
  }

  static async getTaskOwnerUpn(
    taskId: number
  ): Promise<Task["ownerupn"] | undefined> {
    const queryDefinition = "SELECT ownerupn FROM [dbo].[task] WHERE id = @id";
    const request = new Request(SqlConnector.connectionPool);
    request.input("id", Int, taskId);
    const task = ((await request.query(queryDefinition)).recordset as Array<
      Pick<Task, "ownerupn">
    >).pop();
    return task?.ownerupn;
  }

  static async getLastAssignedSpecialistUpn(
    taskId: number
  ): Promise<Assignment["userupn"] | undefined> {
    const queryDefinition =
      "SELECT TOP 1 userupn FROM [dbo].[assignment] WHERE taskid = @taskid ORDER BY created DESC";
    const request = new Request(SqlConnector.connectionPool);
    request.input("taskid", Int, taskId);
    const assignment = ((await request.query(queryDefinition))
      .recordset as Array<Pick<Assignment, "userupn">>).pop();
    return assignment?.userupn;
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

  static async getUserprofileByUpn(upn: string): Promise<User | undefined> {
    const queryDefinition = "SELECT * from [dbo].[user] WHERE upn = @upn";
    const request = new Request(SqlConnector.connectionPool);
    request.input("upn", NVarChar, upn);
    const userprofile = ((await request.query(queryDefinition))
      .recordset as User[]).pop();
    return userprofile;
  }

  static async getAvailabilityOfUserprofileByUpn(
    upn: string
  ): Promise<User["availability"] | undefined> {
    const queryDefinition =
      "SELECT [availability] from [dbo].[user] WHERE upn = @upn";
    const request = new Request(SqlConnector.connectionPool);
    request.input("upn", NVarChar, upn);
    const userprofiles = (await request.query(queryDefinition))
      .recordset as User[];
    return userprofiles.pop()?.availability;
  }

  static async getNameOfUserprofileByUpn(
    upn: string
  ): Promise<User["name"] | undefined> {
    const queryDefinition = "SELECT [name] from [dbo].[user] WHERE upn = @upn";
    const request = new Request(SqlConnector.connectionPool);
    request.input("upn", NVarChar, upn);
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

  static async getManagerMembershipCount(upn: string): Promise<number> {
    const queryDefinition =
      "SELECT COUNT(*) as count from [dbo].[membership] WHERE userupn = @userupn AND typeid = 1";
    const request = new Request(SqlConnector.connectionPool);
    request.input("userupn", NVarChar, upn);
    const result = (await request.query(queryDefinition)).recordset;
    const count = result.pop().count as number;
    return count;
  }

  static async getSpecialistMembershipCount(upn: string): Promise<number> {
    const queryDefinition =
      "SELECT COUNT(*) as count from [dbo].[membership] WHERE userupn = @userupn AND typeid = 2";
    const request = new Request(SqlConnector.connectionPool);
    request.input("userupn", NVarChar, upn);
    const result = (await request.query(queryDefinition)).recordset;
    const count = result.pop().count as number;
    return count;
  }

  static async updateUserprofileConversationReference(
    upn: string,
    conversationreference: string
  ) {
    const queryDefinition =
      "UPDATE [dbo].[user] SET conversationreference = @conversationreference WHERE upn = @upn";
    const request = new Request(SqlConnector.connectionPool);
    request.input("conversationreference", NVarChar, conversationreference);
    request.input("upn", NVarChar, upn);
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
    upn: string,
    availability: number
  ): Promise<void> {
    const queryDefinition =
      "UPDATE [dbo].[user] SET availability = @availability WHERE upn = @upn";
    const request = new Request(SqlConnector.connectionPool);
    request.input("availability", Int, availability);
    request.input("upn", NVarChar, upn);
    await request.query(queryDefinition);
  }

  static async insertAction(
    actionType: number,
    userUpn: string,
    taskId: number,
    comment?: string
  ): Promise<Action["id"]> {
    const date = new Date();
    let queryDefinition =
      "INSERT [dbo].[action] ([typeid],[taskid],[userupn],[created]) OUTPUT INSERTED.id VALUES (@actiontype,@taskid,@userupn,@date)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("actiontype", Int, actionType);
    request.input("taskid", Int, taskId);
    request.input("userupn", NVarChar, userUpn);
    request.input("date", DateTime, date);
    if (!(comment == null) && !(comment === "")) {
      queryDefinition =
        "INSERT [dbo].[action] ([typeid],[taskid],[userupn],[comment],[created]) OUTPUT INSERTED.id VALUES (@actiontype,@taskid,@userupn,@comment,@date)";
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
    userUpn: string,
    comment: string,
    rating: number
  ): Promise<void> {
    const date = new Date();
    const queryDefinition =
      "INSERT INTO [dbo].[feedback] ([taskid],[userupn],[comment],[rating],[created]) VALUES (@taskid,@userUpn,@comment,@rating,@date)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("taskid", Int, taskId);
    request.input("userupn", NVarChar, userUpn);
    request.input("comment", NVarChar, comment);
    request.input("rating", Int, rating);
    request.input("date", DateTime, date);
    await request.query(queryDefinition);
  }

  static async insertTask(task: FormTask): Promise<Task["id"]> {
    const date = new Date();
    const queryDefinition =
      "INSERT INTO [dbo].[task] ([customer],[name],[type],[length],[url],[goal],[requiredskills],[statusid],[ownerupn],[created]) OUTPUT INSERTED.id VALUES (@customer,@name,@type,@length,@url,@goal,@requiredskills,1,@ownerupn,@date)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("customer", NVarChar, task.customer);
    request.input("name", NVarChar, task.name);
    request.input("type", NVarChar, task.type);
    request.input("length", NVarChar, task.length);
    request.input("url", NVarChar, task.url);
    request.input("goal", NVarChar, task.goal);
    request.input("requiredskills", NVarChar, task.requiredSkills);
    request.input("ownerupn", NVarChar, task.ownerUpn);
    request.input("date", DateTime, date);
    const output = ((await request.query(queryDefinition))
      .recordset as Task[]).pop();
    if (!output?.id) {
      throw Error(enUS.exceptions.critical.genericSqlDatabaseQueryFailure);
    }
    return output.id;
  }

  static async insertAssignment(
    userUpn: string,
    taskId: number,
    managerUpn: string,
    actionId: number
  ): Promise<void> {
    const date = new Date();
    const queryDefinition =
      "INSERT [dbo].[assignment] ([userupn],[taskid],[managerupn],[actionid],[created]) VALUES (@userUpn,@taskId,@managerUpn,@actionid,@date)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("userUpn", NVarChar, userUpn);
    request.input("taskId", Int, taskId);
    request.input("managerUpn", NVarChar, managerUpn);
    request.input("actionid", Int, actionId);
    request.input("date", DateTime, date);
    await request.query(queryDefinition);
  }

  static async insertUser(
    upn: string,
    aadobjectid: string,
    name: string,
    givenname: string,
    surname: string,
    emailaddress: string,
    conversationreference: string
  ): Promise<void> {
    const queryDefinition =
      "INSERT INTO [dbo].[user]([upn],[aadobjectid],[name],[givenname],[surname],[emailaddress],[conversationreference],[availability]) VALUES (@upn,@aadobjectid,@name,@givenname,@surname,@emailaddress,@conversationreference,@availability)";
    const request = new Request(SqlConnector.connectionPool);
    request.input("upn", NVarChar, upn);
    request.input("aadobjectid", NVarChar, aadobjectid);
    request.input("name", NVarChar, name);
    request.input("givenname", NVarChar, givenname);
    request.input("surname", NVarChar, surname);
    request.input("emailaddress", NVarChar, emailaddress);
    request.input("conversationreference", NVarChar, conversationreference);
    request.input("availability", Int, 1);
    await request.query(queryDefinition);
  }

  static async removeUserByAadObjectId(aadObjectId: string): Promise<void> {
    const queryDefinition =
      "DECLARE @userupn nvarchar(250) SELECT @userupn = [upn] FROM [dbo].[user] where aadobjectid = @aadobjectid DELETE FROM [dbo].[user] WHERE upn = @userupn DELETE FROM [dbo].[membership] WHERE userupn = @userupn";
    const request = new Request(SqlConnector.connectionPool);
    request.input("aadobjectid", NVarChar, aadObjectId);
    await request.query(queryDefinition);
  }
}
