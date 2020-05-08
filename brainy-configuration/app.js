const express = require("express");
const path = require("path");
const sql = require("mssql");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;
const cookieSession = require("cookie-session");
const cryptoRandomString = require("crypto-random-string");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const ADcredentials = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.TENANT_ID}/.well-known/openid-configuration`,
  redirectUrl: process.env.AD_REDIRECT_URL,
  clientID: process.env.AD_CLIENT_ID,
  responseType: "id_token",
  responseMode: "form_post",
  allowHttpForRedirectUrl: true,
  nonceLifetime: 600,
  nonceMaxAmount: 1,
  useCookieInsteadOfSession: true,
  cookieEncryptionKeys: [
    {
      key: cryptoRandomString({ length: 32 }),
      iv: cryptoRandomString({ length: 12 }),
    },
  ],
};

const whitelistedUsers = process.env.AD_WHITELISTED_USERS.split(";");

const authenticationStrategy = new OIDCStrategy(ADcredentials, function (
  profile,
  done
) {
  process.nextTick(function () {
    if (whitelistedUsers.includes(profile.upn)) {
      return done(null, profile);
    }
    return done(null, null);
  });
});

passport.serializeUser(function (user, done) {
  done(null, user.upn);
});

passport.deserializeUser(function (upn, done) {
  done(null, upn);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

const sqlConnectionConfig = {
  user: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  server: `${process.env.DB_SERVERNAME}`,
  database: `${process.env.DB_NAME}`,
  encrypt: true,
};

async function executeSimpleQuery(query) {
  const pool = new sql.ConnectionPool(sqlConnectionConfig);
  await pool.connect();
  const queryDefinition = query;
  const result = (await pool.query(queryDefinition)).recordset;
  await pool.close();
  return result;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    secret: cryptoRandomString({ length: 32 }),
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(authenticationStrategy);

app.get(
  "/login",
  function (req, res, next) {
    passport.authenticate("azuread-openidconnect", {
      response: res,
      failureRedirect: "/login",
    })(req, res, next);
  },
  function (req, res) {
    res.redirect("/");
  }
);

app.get(
  "/auth/openid/return",
  function (req, res, next) {
    passport.authenticate("azuread-openidconnect", {
      response: res,
      failureRedirect: "/login",
    })(req, res, next);
  },
  function (req, res) {
    res.redirect("/");
  }
);

app.post(
  "/auth/openid/return",
  function (req, res, next) {
    passport.authenticate("azuread-openidconnect", {
      response: res,
      failureRedirect: "/login",
    })(req, res, next);
  },
  function (req, res) {
    res.redirect("/");
  }
);

app.use((req, res, next) => {
  ensureAuthenticated(req, res, next);
});

app.use(express.static("dist/brainy-configuration"));

app.get("/whoami", function (req, res) {
  res.send({ upn: req.user });
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect(process.env.AD_LOGOUT_URL);
});

app.get("/", (req, res) => {
  const options = {
    root: path.join(__dirname, "dist/brainy-configuration"),
  };
  res.sendFile("index.html", options);
});

app.get("/api/users/upn", async (req, res) => {
  try {
    result = await executeSimpleQuery("SELECT [upn] FROM [dbo].[user]");
    res.send(result);
  } catch {
    res.sendStatus(503);
  }
});

app.get("/api/memberships", async (req, res) => {
  try {
    result = await executeSimpleQuery("SELECT * FROM [dbo].[membership]");
    res.send(result);
  } catch {
    res.sendStatus(503);
  }
});

app.post("/api/memberships", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(sqlConnectionConfig);
    await pool.connect();
    const queryDefinition =
      "INSERT INTO [dbo].[membership] ([userupn],[typeid]) VALUES (@userupn,@typeid)";
    const request = new sql.Request(pool);
    request.input("userupn", sql.NVarChar, req.body.userUpn);
    request.input("typeid", sql.NVarChar, req.body.typeId);
    await request.query(queryDefinition);
    await pool.close();
    res.sendStatus(204);
  } catch {
    res.sendStatus(503);
  }
});

app.delete("/api/memberships/:userUpn/:typeId", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(sqlConnectionConfig);
    await pool.connect();
    const queryDefinition =
      "DELETE [dbo].[membership] WHERE userupn = @userupn AND typeid = @typeid";
    const request = new sql.Request(pool);
    request.input("userupn", sql.NVarChar, req.params.userUpn);
    request.input("typeid", sql.Int, req.params.typeId);
    await request.query(queryDefinition);
    await pool.close();
    res.sendStatus(204);
  } catch {
    res.sendStatus(503);
  }
});

app.get("/api/managerteam", async (req, res) => {
  try {
    result = (
      await executeSimpleQuery("SELECT [teamid] FROM [dbo].[manager_team]")
    ).pop();
    if (result === undefined) {
      result = {};
    }
    res.send(result);
  } catch {
    res.sendStatus(503);
  }
});

app.post("/api/managerteam/teamid", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(sqlConnectionConfig);
    await pool.connect();
    const queryDefinition =
      "MERGE INTO [dbo].[manager_team] AS manager_team USING (SELECT 1 AS Id) AS newval(Id) ON manager_team.Id = manager_team.Id WHEN MATCHED THEN UPDATE SET teamid = @teamid WHEN NOT MATCHED THEN INSERT (teamid) VALUES (@teamid);";
    const request = new sql.Request(pool);
    request.input("teamid", sql.NVarChar, req.body.teamId);
    await request.query(queryDefinition);
    await pool.close();
    res.sendStatus(204);
  } catch {
    res.sendStatus(503);
  }
});

app.use(function (req, res, next) {
  res.redirect("/");
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
