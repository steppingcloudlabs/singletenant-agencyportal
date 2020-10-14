  /*eslint no-console: 0*/
  "use strict";
  const express = require("express");
  const morgan = require("morgan");
  const bodyParser = require("body-parser");
  const compression = require("compression");
  const xsenv = require("@sap/xsenv");
  const xssec = require("@sap/xssec");
  const xsHDBConn = require("@sap/hdbext");
  const JWTtoken = require("./middleware/JWTtoken/tokenchecks")()
  const passport = require("passport");
  const port = process.env.PORT || 3000;

  //Initialize Express App for XS UAA and HDBEXT Middleware
  const app = express();
  //logging
  app.use(morgan("dev"));
  app.use(
  	bodyParser.json({
  		limit: "200mb"
  	})
  );

  const logging = require("@sap/logging");
  const appContext = logging.createAppContext();

  const helmet = require("helmet");
  // ...
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
  	directives: {
  		defaultSrc: ["'self'"],
  		styleSrc: ["'self'", "sapui5.hana.ondemand.com"],
  		scriptSrc: ["'self'", "sapui5.hana.ondemand.com"]
  	}
  }));
  // Sets "Referrer-Policy: no-referrer".
  app.use(helmet.referrerPolicy({
  	policy: "no-referrer"
  }));

  // passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
  // 	uaa: {
  // 		tag: "xsuaa"
  // 	}
  // }).uaa));

  app.use(logging.middleware({
  	appContext: appContext,
  	logNetwork: true
  }));
  // app.use(passport.initialize());
  var hanaOptions = xsenv.getServices({
  	hana: {
  		tag: "hana"
  	}
  });
  hanaOptions.hana.pooling = true;
  app.use(
  	// 	passport.authenticate("JWT", {
  	// 		session: false
  	// 	}),
  	xsHDBConn.middleware(hanaOptions.hana)
  );

  //Compression
  app.use(require("compression")({
  	threshold: "1b"
  }));
  // Handling cors
  const cors = require("cors");
  app.use(cors());
  // compress responses
  app.use(compression());
  app.use(function (req, res, next) {
  	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  	res.header(
  		"Access-Control-Allow-Headers",
  		"Origin, X-Requested-With, Content-Type, Accept"
  	);
  	next();
  });

  app.get("/", async(req, res) => {
  	try {
  		const dbClass = require("sap-hdbext-promisfied")
  		let db = new dbClass(req.db);
  		const statement = await db.preparePromisified(`SELECT SESSION_USER, CURRENT_SCHEMA FROM "DUMMY"`)
  		const results = await db.statementExecPromisified(statement, [])
  		let result = JSON.stringify({
  			Objects: results
  		})
  		return res.type("application/json").status(200).send(result)
  	} catch (e) {
  		return res.type("text/plain").status(500).send(`ERROR: ${e.toString()}`)
  	}
  });

  // ADMIN ROUTES 
  //const adminskillsRoutes = require("./router/skills");
  //const adminjobRoutes = require("./router/job");
  //const adminnefRoutes = require("./router/nef");
  //const admindocumentRoutes = require("./router/documents");
  //const adminactionRoutes = require("./router/admin");
  //const adminuseractionRoutes = require("./router/users");
  //const searchRoutes = require("./router/search");
  //app.use("/admin/action", adminactionRoutes);
  //app.use("/admin/action", adminskillsRoutes);
  //app.use("/admin/action", adminjobRoutes);
  //app.use("/admin/action", adminnefRoutes);
  //app.use("/admin/action", admindocumentRoutes);
  //app.use("/search", searchRoutes);

  ////USER ROUTES

  ////app.use(JWTtoken)     // express middleware for usertoken verfication
  //const userauthRoutes = require("./router/auth/userindex.js");
  //const userskillsRoutes = require("./router/skills/userindex.js");
  //const userjobRoutes = require("./router/job/userindex.js");
  //const userdocumentRoutes = require("./router/documents/userindex.js");
  //const useractionRoutes = require("./router/users/index.js");
  //const usernefRoutes = require("./router/nef");

  //app.use("/user/auth", userauthRoutes);
  //app.use("/user/action", userskillsRoutes);
  //app.use("/user/action", userjobRoutes);
  //app.use("/user/action", usernefRoutes);
  //app.use("/user/action", userdocumentRoutes);
  //app.use("/user/action", useractionRoutes);

  app.listen(port, () => {
  	console.log(`Server listening on port: ${port}`);
  });
  module.exports = express;