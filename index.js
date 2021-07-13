const data = require("./data");
const express = require("express");
const crypto = require('crypto');
const app = express();
app.use(express.json());

app.use(express.static(__dirname + "/public"));
app.set("view engine", "pug");

app.use(require("body-parser").urlencoded({ extended: false }));

app.get("/users", function (req, res) {
  const user = req.params.user;
  res.render("users", { users: data.users });
});

app.get("/schedules", function (req, res) {
  const schedule = req.params.schedule;
  res.render("schedules", { schedules: data.schedules });
});

app.get("/users/:user", function (req, res) {
  const user = req.params.user;
  res.json({ user: data.users[user] });
});

app.get("/schedules/:schedule", function (req, res) {
  const schedule = req.params.schedule;
  res.json({ schedule: data.schedules[schedule] });
});

app.get("/", function (req, res) {
  res.send("Welcome to our schedule website");
});
const users = [];

app.post("/users", (req, res) => {
  const newUser = {
    firstname : req.body.firstname,
    lastname : req.body.lastname,
    email : req.body.email,
    password : req.body.password
  }
  if (!newUser.firstname || !newUser.lastname || !newUser.email || !newUser.password) {
    return;
  }
  newUser.password = crypto
    .createHash('sha256')
    .update(newUser.password)
    .digest('hex');

  users.push(newUser);
  res.send(users);
});

const schedules = [];

app.post("/schedules", function (req, res) {
  const newSchedule = {
    user_id: req.body.user_id,
    day: req.body.day,
    start_at: req.body.start_at,
    end_at: req.body.end_at,
  }
  if (!newSchedule.user_id || !newSchedule.day || !newSchedule.start_at || !newSchedule.end_at) {
    return;
  }
  schedules.push(newSchedule)
  res.json(schedules)
})
app.listen(3000);
