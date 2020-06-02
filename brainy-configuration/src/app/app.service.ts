import { User } from "./../models/User";
import { UserMembership } from "./../models/UserMembership";
import { Membership } from "./../models/Membership";
import { ManagerTeam } from "./../models/ManagerTeam";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { LoggedInUser } from "src/models/LoggedInUser";

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor(private http: HttpClient) {}
  async getManagerTeam(): Promise<ManagerTeam> {
    return this.http.get<ManagerTeam>("/api/managerteam").toPromise();
  }
  async getLoggedInUser(): Promise<LoggedInUser> {
    return this.http.get<LoggedInUser>("/whoami").toPromise();
  }
  async getUserMemberships() {
    const memberships = await this.http
      .get<Membership[]>("/api/memberships")
      .toPromise();
    const users = await this.http.get<User[]>("/api/users").toPromise();
    const userMemberships: UserMembership[] = [];
    users.forEach((user) => {
      userMemberships.push({
        aadobjectid: user.aadobjectid,
        name: user.name,
        manager: memberships.some(
          (membership) =>
            membership.useraadobjectid === user.aadobjectid &&
            membership.typeid === 1
        ),
        specialist: memberships.some(
          (membership) =>
            membership.useraadobjectid === user.aadobjectid &&
            membership.typeid === 2
        ),
      });
    });
    return userMemberships;
  }
  async postManagerTeamId(teamId: string) {
    const postBody = { teamId };
    return this.http
      .post("/api/managerteam/teamid", postBody, {
        responseType: "text",
      })
      .toPromise();
  }
  async insertMembership(userAadObjectId: string, typeId: number) {
    const postBody = { userAadObjectId, typeId };
    return this.http
      .post("/api/memberships", postBody, {
        responseType: "text",
      })
      .toPromise();
  }
  async deleteMembership(userAadObjectId: string, typeId: number) {
    return this.http
      .delete(`/api/memberships/${userAadObjectId}/${typeId}`)
      .toPromise();
  }
}
