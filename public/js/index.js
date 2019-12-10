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




function refreshProjects(){
  $.getJSON('/projects/find', function (data) {
    console.log(data[0])
    for (var i = 0; i < data.length; i++) {
      $("#project-display").append('<div class="project-item mt-5" data-id="' + data[i]._id + '"> <h5>' + data[i].title + '</h5> <p>' + data[i].body + '</p> <p>Number of Tasks:'+data[i].tasks.length+' </div>')
    }
  })
}



  $(document).on("click", ".project-item", function () {
    // Empty the notes from the note section
    console.log($(this).attr("data-id"))
    $("#tasks").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/projects/find/" + thisId
      })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
      
        var tasksBox = $("<div id=task-box>")
        
          // The title of the article
          $("#tasks").append(tasksBox)
          tasksBox.append("<h2 class='text-white'>" + data[0].title + "</h2>");
          // An input to enter a new title
          tasksBox.append("<label for='titleinput' class='text-white'>Title<label>");
          tasksBox.append("<input id='titleinput' class='form-control' name='title' >");
          // Tasks Body
          tasksBox.append("<label for='bodyinput'>Description<label>");
          tasksBox.append("<textarea id='bodyinput' class='form-control' name='body'></textarea>");
          // A button to submit a new note, with the id of the article saved to it
          tasksBox.append("<button data-id='" + data[0]._id + "' id='savetask' class='btn btn-blue mt-3'>Save Note</button>");
          if (!data[0].tasks.length){
          tasksBox.append("<div class='task-item'><p>No Tasks</p></div>")
          }
          for (j = 0; j < data[0].tasks.length; j++) {
            var taskItem = data[0].tasks[j];
            tasksBox.append("<div class='task-item'><p>"+taskItem.title+"</p> <p>"+taskItem.dueDate+"</p></div>")
        };
      });
  });


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