$(document).ready(function (){



    // Getting references to our form and input
    var signUpForm = $("#create-account");
    var createUserName = $("#create-user-name");
    var createPassword = $("#create-user-password");
    var createFirstName = $("#create-first-name");
    var createLastName = $("#create-last-name");
    $("#failed-login").hide();

    // When the signup button is clicked, we validate the email and password are not blank
    signUpForm.on("submit", function(event) {
      event.preventDefault();
      var userData = {
        username: createUserName.val().trim(),
        password: createPassword.val().trim(),
        firstName: createFirstName.val().trim(),
        lastName: createLastName.val().trim(),
      };

      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        return;
      }
      // If we have an email, password, first name, and last name, run the signUpUser function
      signUpUser(userData.username, userData.password, userData.firstName, userData.lastName, userData.address, userData.city, userData.state, userData.zip );
      createUserName.val("");
      createPassword.val("");
      createFirstName.val("");
      createLastName.val("");
    });

    // Does a post to the signup route. If succesful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpUser(username, password, firstName, lastName) {
      $.post("/api/signup", {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
      }).then(function(data) {
        if (data ==="/login"){
          window.location.href = data;
        } else {
          var errorData = data.errors;
          $("#error-area").text(errorData);
          $("#error-area").css({"text-transform": "capitalize"}
          )}
      }).catch(handleLoginErr);
    }

    function handleLoginErr(err) {
      console.log(err)

    }

  //LOGIN
  // Getting references to our form and inputs
  var loginBtn = $("#login-btn")
  var loginEmail = $("#login-email");
  var loginPassword = $("#login-password");
  // When the form is submitted, we validate there's an email and password entered
  loginBtn.on("click", function(event) {
    event.preventDefault();
    var userData = {
      email: loginEmail.val().trim(),
      password: loginPassword.val().trim()
    };
    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    loginEmail.val("");
    loginPassword.val("");
  });
  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    }).then(function(data) {
      window.location.href = data;
      // If there's an error, log the error
    }).catch(function(err) {
      console.log(err);
      $("#failed-login").show();
    });
  };





});