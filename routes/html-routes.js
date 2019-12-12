let path = require('path');

let db = require("../models");
let csv = require('csv-express');

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
  });

  app.get('/projects/export/:id', function(req, res, next) {
      var filename   = "project.csv";
      db.Project.find({_id:req.params.id}).lean().exec({}, function(err, project) {

          if (err){res.send(err)} ;

          res.statusCode = 200;

          res.setHeader('Content-Type', 'text/csv');

          res.setHeader("Content-Disposition", 'attachment; filename='+filename);

          res.csv(project, true);

      });

   });






};