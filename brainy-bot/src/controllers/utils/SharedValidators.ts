import {SqlConnector} from "../../connectors/SqlConnector";

export class SharedValidators {
  static async specialistIsCurrentlyAssignedToTask(
    specialistUpn: string,
    taskId: number
  ) {
    if (
      (await SqlConnector.getLastAssignedSpecialistUpn(taskId)) ===
      specialistUpn
    ) {
      return true;
    }
    return false;
  }
  static async taskIsPendingSpecialist(taskId: number) {
    const statusTask = await SqlConnector.getStatusIdTask(taskId);
    if (statusTask === 3) {
      return true;
    }
    return false;
  }
  static declineCommentIsValid(comment: string) {
    if (comment !== "" && comment !== null) {
      return true;
    }
    return false;
  }
}
