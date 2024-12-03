//JavaScript function to toggle the button state

// function toggleButton() {
//     var button = document.querySelector('.toggle');
//     button.classList.toggle('active');
//   }
 
function toggleButton() {
  var button = document.querySelector('.toggle');
  button.classList.toggle('active');

  // Check if the button belongs to teacher or student and add corresponding class
  if (button.classList.contains('teacher')) {
      button.classList.toggle('student');
  } else if (button.classList.contains('student')) {
      button.classList.toggle('teacher');
  }
}


  
  // JavaScript function to toggle the button state and redirect to the appropriate page
  /*function toggleButton() {
    var button = document.querySelector('.toggle');
    button.classList.toggle('active');
  
    var studentLabel = document.getElementById('label1');
    var teacherLabel = document.getElementById('label2');
  
    if (button.classList.contains('active')) {
        studentLabel.style.display = 'none';
        teacherLabel.style.display = 'block';
        window.location.href = 'teacherlogin.html';
    } else {
        studentLabel.style.display = 'block';
        teacherLabel.style.display = 'none';
        window.location.href = 'stud_login.html';
    }
  }*/
  // function toggleButton() {
  //   var button = document.querySelector('.toggle');
  //   var studentLoginForm = document.getElementById('studentLoginForm');
  //   var teacherLoginForm = document.getElementById('teacherLoginForm');
  
  //   // Toggle 'active' class on the button
  //   button.classList.toggle('active');
  
  //   // If the 'Student' option is selected
  //   if (button.classList.contains('active')) {
  //       studentLoginForm.style.display = 'block'; // Show the student login form
  //       teacherLoginForm.style.display = 'none'; // Hide the teacher login form if shown
  //   } else { // If the 'Teacher' option is selected
  //       studentLoginForm.style.display = 'none'; // Hide the student login form
  //       teacherLoginForm.style.display = 'block'; // Show the teacher login form
  //   }
  // }
  
  