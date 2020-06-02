import { UserMembership } from "../models/UserMembership";
import { ManagerTeam } from "./../models/ManagerTeam";
import { AppService } from "./app.service";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { LoggedInUser } from "src/models/LoggedInUser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  pageLoaded = false;
  title = "brainy-configuration";
  managerTeam: ManagerTeam;
  loggedInUser: LoggedInUser;
  userMemberships: UserMembership[];
  searchString: string;

  constructor(private appService: AppService, private toastr: ToastrService) {}
  async ngOnInit() {
    this.managerTeam = await this.appService.getManagerTeam();
    this.loggedInUser = await this.appService.getLoggedInUser();
    this.userMemberships = await this.appService.getUserMemberships();
    this.pageLoaded = true;
  }
  async submitManagerTeamId(form: { value: { teamid: string } }) {
    const teamId = this.parseTeamIdFromDeepLink(form.value.teamid);
    if (!(teamId == null)) {
      try {
        await this.appService.postManagerTeamId(teamId);
        this.toastr.success("Updated the manager Team ID", "Success!");
      } catch {
        this.toastr.error("Couldn't update the manager Team ID", "Whoopsie!");
      }
      this.managerTeam = { teamid: teamId };
    } else {
      this.toastr.error("The entered Team ID deeplink is invalid", "Whoopsie!");
    }
  }
  async insertMembership(
    aadObjectId: string,
    membershipType: string,
    name: string
  ) {
    try {
      if (membershipType === "manager") {
        await this.appService.insertMembership(aadObjectId, 1);
      } else if (membershipType === "specialist") {
        await this.appService.insertMembership(aadObjectId, 2);
      }
      this.userMemberships.find(
        (userMembership) => userMembership.aadobjectid === aadObjectId
      )[membershipType] = true;
      this.toastr.success(`Assigned membership to ${name}`, "Success!");
    } catch {
      this.toastr.error(`Couldn't assign membership to ${name}`, "Whoopsie!");
    }
  }
  async deleteMembership(
    userAadObjectId: string,
    membershipType: string,
    name: string
  ) {
    try {
      if (membershipType === "manager") {
        await this.appService.deleteMembership(userAadObjectId, 1);
      } else if (membershipType === "specialist") {
        await this.appService.deleteMembership(userAadObjectId, 2);
      }
      this.userMemberships.find(
        (userMembership) => userMembership.aadobjectid === userAadObjectId
      )[membershipType] = false;
      this.toastr.success(`Removed membership from ${name}`, "Success!");
    } catch {
      this.toastr.error(`Couldn't remove membership from ${name}`, "Whoopsie!");
    }
  }

  parseTeamIdFromDeepLink(teamIdDeepLink: string): string | null {
    const teamIdDeepLinkDecoded = decodeURIComponent(teamIdDeepLink);
    const re = new RegExp("(?<=/team/)(.*)(?=/conversations)");
    const parsedTeamId = re.exec(teamIdDeepLinkDecoded);
    if (parsedTeamId) {
      return parsedTeamId.pop();
    }
    return null;
  }
}
