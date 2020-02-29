const express = require("express");
const teachers = require("../models/teachers");

const teachersRouter = express.Router();

teachersRouter
  .get("/", (request, response) => {
    response.status(200).send({ teachers });
  })
  .post("/", (request, response) => {
    const teachers_list = request.body.teachers;
    let teach_list = teachers_list.every(teacher => {
      return teacher.empid && teacher.firstname;
    });
    if (teach_list) {
      teachers_list.forEach(teacher => teachers.push(teacher));
      response.status(200).send({ message: "Teachers added to list successfully" });
    } else {
      response.status(400).send( "Bad Request" );
    }
  })
  .delete("/", (req, res) => {
    let removalList = req.body.ids;
    let removedCount = 0;
    removalList.forEach(empid => {
      teachers.forEach((teacher, index) => {
        if (teacher.empid === empid) {
          teachers.splice(index, 1);
          removedCount++;
        }
      });
    });
    if (removedCount !== 0) {
      res
        .status(200)
        .send({
          message: `${removedCount} Teachers detail removed from the list`
        });
    } else {
      res.status(400).send({ error: "Bad Request. Invalid Teacher IDs" });
    }
  });
module.exports = teachersRouter;
