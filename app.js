const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const admin = require("firebase-admin");
const fs = require("fs");
const Handlebars = require("handlebars");

const Base64 = require("base-64");

const multer = require("multer");
const upload = multer({
  dest: "uploads/",
});
const { v4: uuidv4 } = require("uuid");
//const hbs = require('hbs');

const app = express();

// Middleware
app.use(express.static("assets"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(
  session({
    secret: "helloguys",
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(flash());

/* var serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "magnumopus-personal.appspot.com"

}); */

// View engine setup

app.set("view engine", "hbs");
app.set("views", __dirname + "/pages");

Handlebars.registerHelper("score", (a) => (120*Number(a)));
Handlebars.registerHelper("p", (a) => (100*Number(a)).toFixed(2));
Handlebars.registerHelper("c", (a) => ((100*Number(a))-90).toFixed(2));
Handlebars.registerHelper("d", (a) => (10*((100*Number(a))-90)).toFixed(2));
Handlebars.registerHelper("loud", (a, b) => (a ? a.toUpperCase() : b));
Handlebars.registerHelper(
  "toJSON",
  (a) => new Handlebars.SafeString(JSON.stringify(a)),
);

app.engine("hbs", (filePath, options, callback) => {
  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) {
      return callback(err);
    }

    const template = Handlebars.compile(content);
    const rendered = template(options);
    return callback(null, rendered);
  });
});

const auth = (req, res, next) => {
  const allowedPaths = ["/login", "/logout", "/"];

  if (
    req.session.authenticated ||
    allowedPaths.includes(req.path)
  ) {
    // If authenticated or accessing allowed paths, continue to the next middleware or route handler
    next();
  } else {
    // If not authenticated, set a flash message and redirect to the home page
    req.flash("error", `You must be logged in to access ${req.path}.`);
    req.session.path_ =
      req.method === "GET"
        ? req.path
        : req.path.substring(0, req.path.indexOf("/", 1));
    res.redirect("/");
  }
};

const homeRoutes = require("./routes/home");

app.use("/", homeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

// Server setup
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
