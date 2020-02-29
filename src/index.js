const express = require("express");
const bodyparser = require("body-parser");
const expressHbs = require("express-handlebars");
const path = require("path");
const teacherRouter = require("./routers/teacherRouter");
const teachersRouter = require("./routers/teachersRouter");
const teachers = require("./models/teachers");
const formatIndex = require("./views/helpers/formatIndex");
const ifEquality = require("./views/helpers/ifEquality");
const app = express();
const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    formatIndex,
    ifEquality
  }
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("home", {
    layout: "hero",
    pageTitle: "Home"
  });
});
app.get("/web/teachers", (req, res) => {
  res.render("teachers", {
    layout: "navigation",
    pageTitle: "Teachers",
    teachers
  });
});
app.get("/web/teachers/:id", (req, res) => {
  const { id = "" } = req.params;
  const requiredTeacher = teachers.find(Teacher => {
    if (parseInt(id, 10) === Teacher.id) return true;
    else return false;
  });
  if (requiredTeacher) {
    res.render("profile", {
      layout: "hero",
      pageTitle: "Teacher",
      requiredTeacher
    });
  }
});
app.get("/web/add-teacher", (req, res) => {
  res.render("addTeacher", {
    layout: "navigation",
    pageTitle: "Add Teacher",
    mode: "add",
    TeacherID: teachers.length+1
  });
});

app.get("/web/edit-teacher/:id", (req, res) => {
  const { id = "" } = req.params;
  const requiredTeacher = teachers.find(Teacher => {
    if (id === Teacher.id.toString()) {
      return true;
    } else {
      return false;
    }
  });
  if (requiredTeacher) {
    res.render("addTeacher", {
      layout: "navigation",
      PageTitle: "Edit Teacher",
      mode: "edit",
      TeacherID: requiredTeacher.id,
      teacher: requiredTeacher
    });
  }
});
app.get("/web/teachers/delete/:id", (request, response) => {
  const { id } = request.params;
  let requiredTeacherIndex;
  const requiredTeacher = teachers.find((Teacher, teacherIndex) => {
    if (parseInt(id, 10) === Teacher.id) {
      requiredTeacherIndex = teacherIndex;
      return true;
    } else return false;
  });
  if (requiredTeacher) {
    teachers.splice(requiredTeacherIndex, 1);
    response.redirect("/web/teachers");
  } else {
    console.log(teachers);
    console.log(requiredTeacher);
    response.status(400).send({ message: "Bad Request" });
  }
});

app.use("/teacher", teacherRouter);
app.use("/teachers", teachersRouter);

const server = app.listen("8080", (req, res) => {
  console.log(`Server is running on port ${server.address().port}.`);
});