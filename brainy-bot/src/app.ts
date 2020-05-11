import * as restify from "restify";
import * as path from "path";
import {config} from "dotenv";
import {BotFrameworkAdapter} from "botbuilder";
import {MainBot} from "./controllers/bots/MainBot";
import {SqlConnector} from "./connectors/SqlConnector";
import Postgrator from "postgrator";
import appInsights = require("applicationinsights");
import {enUS} from "./resources/Resources";
import {trackDetailedException} from "./controllers/utils/trackDetailedException";

config({
  path: path.join(__dirname, "..", ".env"),
});

if (!process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  throw Error("Application Insights Instrumentation Key is missing!");
}

appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY);
appInsights.start();
export const telemetryClient = new appInsights.TelemetryClient(
  process.env.APPINSIGHTS_INSTRUMENTATIONKEY
);

SqlConnector.setConnectionPool();

const postgrator = new Postgrator({
  migrationDirectory: path.join(__dirname, "..", "/migrations"),
  driver: "mssql",
  host: `${process.env.DB_SERVERNAME}`,
  port: 1433,
  database: `${process.env.DB_NAME}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  requestTimeout: 1000 * 60 * 60,
  connectionTimeout: 30000,
  options: {
    encrypt: true,
  },
});

postgrator
  .migrate()
  .then(appliedMigrations => {
    if (appliedMigrations.length > 0) {
      console.log(
        `Applied the following migrations: ${JSON.stringify(appliedMigrations)}`
      );
    } else {
      console.log("No database migrations applied");
    }
  })
  .catch(error => console.log(error));

export const adapter = new BotFrameworkAdapter({
  appId: process.env.APP_ID,
  appPassword: process.env.APP_PASSWORD,
});

adapter.onTurnError = async (ctx, error) => {
  if (Object.values(enUS.exceptions.information).includes(error.message)) {
    await ctx.sendActivity(error.message);
    trackDetailedException(error, ctx, 1);
    return;
  }
  if (Object.values(enUS.exceptions.warning).includes(error.message)) {
    await ctx.sendActivity(error.message);
    trackDetailedException(error, ctx, 2);
    return;
  }
  if (Object.values(enUS.exceptions.error).includes(error.message)) {
    await ctx.sendActivity(error.message);
    trackDetailedException(error, ctx, 3);
    return;
  }
  if (Object.values(enUS.exceptions.critical).includes(error.message)) {
    await ctx.sendActivity(error.message);
    trackDetailedException(error, ctx, 4);
    return;
  }
  await ctx.sendActivity(enUS.exceptions.critical.unknownFailure);
  trackDetailedException(error, ctx, 4);
};

const bot = new MainBot();

const port = process.env.PORT || 3978;

const server = restify.createServer();
server.listen(port, () => {
  console.log(`\n${server.name} listening to ${server.url}`);
});

server.use(require("restify-plugins").bodyParser());

server.get("/", (req, res, next) => {
  res.send("Hi, this is Brainy!");
  next();
});

server.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async turnContext => {
    if (!validateTenantId(turnContext.activity.conversation.tenantId)) {
      throw Error(enUS.exceptions.error.illegalTenant);
    }
    await bot.run(turnContext);
  });
});

function validateTenantId(tenantId: string) {
  if (tenantId === process.env.TENANT_ID) {
    return true;
  }
  return false;
}
