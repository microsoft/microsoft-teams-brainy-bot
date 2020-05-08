import {TurnContext} from "botbuilder";
import {telemetryClient} from "../../app";

export function trackDetailedException(
  error: Error,
  ctx: TurnContext,
  severity: number
): void {
  error.message = error.message += ` triggered by: ${
    ctx.activity.from.aadObjectId
  }, activity value: ${JSON.stringify(ctx.activity.value)}`;
  console.log(error.message);
  telemetryClient.trackException({
    exception: error,
    severity,
  });
}
