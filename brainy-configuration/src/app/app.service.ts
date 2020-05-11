import { User } from "./../models/User";
import { UserMembership } from "./../models/UserMembership";
import { Membership } from "./../models/Membership";
import { ManagerTeam } from "./../models/ManagerTeam";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor(private http: HttpClient) {}
  async getManagerTeam(): Promise<ManagerTeam> {
    return this.http.get<ManagerTeam>("/api/managerteam").toPromise();
  }
  async getLoggedInUser(): Promise<User> {
    return this.http.get<User>("/whoami").toPromise();
  }
  async getUserMemberships() {
    const memberships = await this.http
      .get<Membership[]>("/api/memberships")
      .toPromise();
    const users = await this.http.get<User[]>("/api/users/upn").toPromise();
    const userUpns: string[] = [];

    users.forEach((user) => {
      userUpns.push(user.upn);
    });

    const userMemberships: UserMembership[] = [];
    userUpns.forEach((upn) => {
      userMemberships.push({
        userupn: upn,
        manager: memberships.some(
          (membership) => membership.userupn === upn && membership.typeid === 1
        ),
        specialist: memberships.some(
          (membership) => membership.userupn === upn && membership.typeid === 2
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
  async insertMembership(userUpn: string, typeId: number) {
    const postBody = { userUpn, typeId };
    return this.http
      .post("/api/memberships", postBody, {
        responseType: "text",
      })
      .toPromise();
  }
  async deleteMembership(userUpn: string, typeId: number) {
    return this.http
      .delete(`/api/memberships/${userUpn}/${typeId}`)
      .toPromise();
  }
}
