var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var assignedUserSchema = new Schema({
  userName: {
    type: String,
    required:true
  },
  userID: {
    type: String,
    required: true
  }
})


var TaskSchema = new Schema({
  title: {
type:String,
required: true
  },
  text: String,
  assignedUsers: [assignedUserSchema],
  dueDate: {
    type: Date,
    default: new Date
  }
})

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var ProjectSchema = new Schema({
  // `title` must be of type String
  title: {
    type:String,
    required:true
  },
  // `body` must be of type String
  body: String,

  tasks: [TaskSchema],

});



// This creates our model from the above schema, using mongoose's model method
var Project = mongoose.model("Project", ProjectSchema);

// Export the Note model
module.exports = Project;


