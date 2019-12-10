var path = require('path');
var csv  = require('csv-express');
var db = require("../models");

module.exports = function (app) {
  //
  app.get("/", function (req, res) {

    res.sendFile(path.join(__dirname + '/index.html'));
  });

  app.get("/signup", function (req, res) {

    res.sendFile(path.join(__dirname + '/signup.html'));
  });

  app.get("/projects", function (req, res) {

    res.sendFile(path.join(__dirname + '/projects.html'));
  });

  app.get("/projects/find", function (req, res) {
    db.Project.find({})
      .then(function (dbProject) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbProject);
      })
  })

  app.get("/projects/find/:id", function (req, res) {
    var projectID = req.params.id;
    console.log(projectID)
    db.Project.find({
        _id: projectID
      })
      .then(function (dbProject) {
        console.log(dbProject)
        // If all Notes are successfully found, send them back to the client
        res.json(dbProject);
      })
  })

  app.post("/api/newproject", function (req, res) {
    db.Project.create(req.body)
      .then(function (dbProject) {
        // If the User was updated successfully, send it back to the client
        res.json(dbProject);
      })
      .catch(function (err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  })

  app.post("/api/newtask", function (req, res) {
    var thisProject = req.body.projectid;
    var thisTaskTitle = req.body.title;
    var thisTaskBody = req.body.body;
    var newTask = {
      title: thisTaskTitle,
      body: thisTaskBody,
    };
    db.Project.findOneAndUpdate({
        _id: thisProject
      }, {
        $push: {
          tasks: newTask
        }
      }).then(function (data) {
        console.log(data)
      })
  })
  // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
  // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
  // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

  app.get('/projects/export/:id', function(req, res, next) {
      var filename   = "project.csv";
      db.Project.find({_id:req.params.id}).lean().exec({}, function(err, project) {

          if (err) res.send(err);

          res.statusCode = 200;

          res.setHeader('Content-Type', 'text/csv');

          res.setHeader("Content-Disposition", 'attachment; filename='+filename);

          res.csv(project, true);

      });

   });






};