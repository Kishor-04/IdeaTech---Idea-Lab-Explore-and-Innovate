// Define a variable to keep track of the current background state
var isTeacherBackground = false;

function teacher() {
    var x = document.getElementById("LoginStudent");
    var y = document.getElementById("LoginTeacher");
    var z = document.getElementById("btn");
    var container = document.getElementsByClassName('navbar-image')[0];


    if (!isTeacherBackground) {
        // If the current background is not teacher, switch to teacher
        x.style.left = "-800px";
        y.style.left = "5px";
        z.style.left = "110px";
        container.style.backgroundImage = "url('./public/teacher.png')";
        isTeacherBackground = true; // Update the background state
    }
    var color1 = document.getElementById('teacherLabel');
    var color2 = document.getElementById('studentLabel');

    // Get the computed color of studentLabel
    var color2Color = window.getComputedStyle(color2).color;

    // Check if the color of studentLabel is white
    if (color2Color.toLowerCase() === "rgb(255, 255, 255)" || color2Color.toLowerCase() === "#ffffff" || color2Color.toLowerCase() === "white") {
        color1.style.color = "white";
        color2.style.color = "#3498db";
    }

}

function student() {
    var x = document.getElementById("LoginStudent");
    var y = document.getElementById("LoginTeacher");
    var z = document.getElementById("btn");
    var container = document.getElementsByClassName('navbar-image')[0];

    if (isTeacherBackground) {
        // If the current background is teacher, switch to student
        x.style.left = "3px";
        y.style.left = "800px";
        z.style.left = "0px";
        container.style.backgroundImage = "url('./public/student.png')";
        isTeacherBackground = false; // Update the background state
    }

    var color1 = document.getElementById('teacherLabel');
    var color2 = document.getElementById('studentLabel');

    // Get the computed color of studentLabel
    var color1Color = window.getComputedStyle(color1).color;

    // Check if the color of studentLabel is white
    if (color1Color.toLowerCase() === "rgb(255, 255, 255)" || color1Color.toLowerCase() === "#ffffff" || color1Color.toLowerCase() === "white") {
        color1.style.color = "#3498db";
        color2.style.color = "white";
    }
}
