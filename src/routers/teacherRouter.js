const express = require("express");
const teachers = require("../models/teachers");
const teacherRouter = express.Router();
teacherRouter
.get("/:id", (req, res) => {
  const { id = "" } = req.params;
  const requiredTeacher = teachers.find(Teacher => {
    if (parseInt(id, 10) === Teacher.id) return true;
    else return false;
  });
  if (requiredTeacher) {
    res.status(200).json({ Teacher: requiredTeacher });
  } else {
    res.status(404).json({ message: "Not Found" });
  }
})
  .post("/", (request, response) => {
    if (request.body.firstname && request.body.lastname) {
      teachers.push(request.body);
      response.status(200).json({ message: "Teachers created successfully" });
    } else {
      response.status(400).send("Bad Request");
    }
  })
  .patch("/:id", (req, res) => {
    const { id } = req.params;
    let requiredTeacherIndex;
    const requiredTeacher = teachers.find((Teacher, TeacherIndex) => {
      if (parseInt(id,10) === Teacher.id ){
        requiredTeacherIndex = TeacherIndex;
        return true;
      } else {
        return false;
      }
    });
    console.log(requiredTeacher);
    if (requiredTeacher) {
      const {
        firstname = requiredTeacher.firstname,
        lastname = requiredTeacher.lastname,
        age = requiredTeacher.age,
        gender = requiredTeacher.gender,
        course= requiredTeacher.course
      } = req.body;
      teachers[requiredTeacherIndex] = {
        ID: requiredTeacher.id,
        firstname,
        lastname,
        age,
        gender,
        course
      };
      res.status(200).send({ message: "Teacher Details Updated" });
    }
    res.status(400).send({ message: "Bad Request" });
  })
  .delete("/:id", (req, res) => {
    const { id } = req.params;
    let requiredTeacherIndex;
    const requiredTeacher = teachers.find((Teacher, TeacherIndex) => {
      if (parseInt(id, 10) === Teacher.id) {
        requiredTeacherIndex = TeacherIndex;
        return true;
      } else {
        return false;
      }
    });
    if (requiredTeacher) {
      teachers.splice(requiredTeacherIndex, 1);
      res.status(200).json({ message: "Teacher Removed Successfully" });
    } else {
      res.status(400).send("Bad Request");
    }
  });

module.exports = teacherRouter;
