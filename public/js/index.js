$(document).ready(function () {
  refreshProjects()

  var projectTitle = $("#project-title");
  var projectBody = $("#project-body");
  var createProject = $("#create-project")

  createProject.on("click", function (event) {
    event.preventDefault();
    var projectData = {
      title: projectTitle.val().trim(),
      body: projectBody.val().trim()
    };
    console.log(projectData)

    if (!projectData.title || !projectData.body) {
      return;
    }
    createNewProject(projectData.title, projectData.body)
    projectTitle.val("");
    projectBody.val("");
  });

  function createNewProject(title, body) {
    $.post("/api/newproject", {
      title: title,
      body: body
    }).then(function (data) {
      console.log(data);
      refreshProjects()
    })
  }




  function refreshProjects() {
    $("#project-display").empty();
    $.getJSON('/projects/find', function (data) {
      console.log(data[0])
      for (i = 0; i < data.length; i++) {
        // use `` to display strings on multiple lines
        $("#project-display").append(`
                                      <button class="btn btn-blue mt-3" type="button" data-toggle="collapse" data-target="#project-item-` + [i] + `" aria-expanded="false" aria-controls="collapseExample">` + data[i].title + `</button>
                                      <br>
                                      <div class="collapse" id="project-item-` + [i] + `">
                                        <div class="project-item project-item` + [i] + ` mt-5">
                                          <div class="row">
                                              <div class="col-10">
                                              <h5>` + data[i].title + `</h5>
                                              <p>` + data[i].body + `</p>
                                              <a href="/projects/export/`+data[i]._id+`" target="_none">Export Project Data</a>

                                              <p>Number of Tasks:` + data[i].tasks.length + ` </p>
                                              <button class="btn btn-blue project-button d-inline-block" data-id="` + data[i]._id + `">Edit Tasks</button>
                                              </div>
                                            <div class=" tasks"></div>
                                          </div>
                                        </div>
                                      </div>`);
        $(".projectitem" + [i] + ".tasks").empty();
        for (k = 0; k < data[i].tasks.length; k++) {
          console.log(data[i].tasks[k])
          var projectTaskItem = data[i].tasks[k]
          $(".project-item" + [i]).append("<p>" + projectTaskItem.title + "</p>");
          if (!projectTaskItem.title) {
            $(".project-item" + [i]).append("<p>No Title</p>");
          }
        }
      }
    })
  }


  // Adds Functionality to the  projects
  $(document).on("click", ".project-button", function () {
    $()
    var tasksBox = $("<div id=task-box>")
    $(this).parent('div').append(tasksBox)
    // Empty Tasks Display Area
    // set data-id of whatever is clicked to a variable
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    // finds project with the associated id
    $.ajax({
        method: "GET",
        url: "/projects/find/" + thisId
      })
      .then(function (data) {
        console.log(data);

        // An input to enter a new title
        tasksBox.append("<label for='titleinput' class='text-white'>Title<label>");
        tasksBox.append("<input id='titleinput' class='form-control' name='title' >");
        // Tasks Body
        tasksBox.append("<label for='bodyinput'>Description<label>");
        tasksBox.append("<textarea id='bodyinput' class='form-control' name='body'></textarea>");
        // A button to submit a new task, with the id of the article saved to it
        tasksBox.append("<button data-id='" + data[0]._id + "' id='savetask' class='btn btn-blue mt-3'>Save Task</button>");
        // if the project has zero tasks display this
        // for every task a project has append the html to the tasks box
      });
  });

  // Uses document on click with an identifier so that when items are appended to the page jquery recognizes them.
  // I'm a big fan of this fix.
  $(document).on('click', '#savetask', function () {
    console.log('click')
    var taskTitle = $("#titleinput");
    var taskBody = $("#bodyinput");
    var projectID = $("#savetask").attr("data-id");
    console.log(projectID)
    createNewTask(taskTitle.val().trim(), taskBody.val().trim(), projectID)
    taskTitle.val('');
    taskBody.val('');
    refreshProjects()
  })

  // Passes the task title, description, and associated project id to the post.
  function createNewTask(title, body, projectid) {
    $.post("/api/newtask", {
      title: title,
      body: body,
      projectid: projectid
    }).then(function (data) {
      console.log(data);
    })
  }

});