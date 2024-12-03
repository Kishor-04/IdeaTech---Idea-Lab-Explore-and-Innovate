document.addEventListener("DOMContentLoaded", function () {
    const signUpForm = document.querySelector(".signup-box form");
   
    if (signUpForm) {
      signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();
  
        const firstName = signUpForm.querySelector("input[name='firstName']").value;
        const lastName = signUpForm.querySelector("input[name='lastName']").value;
        const email = signUpForm.querySelector("input[type='email']").value;
        const password = signUpForm.querySelector("input[type='password']").value;
        // const confirmPassword = signUpForm.querySelector("input[name='confirmPassword']").value;
  
        // Perform form validation for sign-up
        if (firstName === "" || lastName === "" || email === "" || password === "" /*|| confirmPassword === ""*/) {
          alert("Please fill in all fields.");
          return;
        }
  
        // if (password !== confirmPassword) {
        //   alert("Passwords do not match. Please try again.");
        //   return;
        // }
  
        // If all validations pass, you can submit the form or perform other actions here
        alert("Sign-up successful!");
      });
    }
  });
  
  
  
  
  
  // For login form submission
  document.addEventListener("DOMContentLoaded", function () {
    const signInForm = document.querySelector(".signin-box form");
  
    if (signInForm) {
        signInForm.addEventListener("submit", function (event) {
            event.preventDefault();
  
            const username = signInForm.querySelector("input[name='username']").value;
            const signInPassword = signInForm.querySelector("input[name='password']").value;
  
            // Perform form validation for sign-in
            if (username === "" || signInPassword === "") {
                alert("Please fill in all fields.");
                return;
            }
  
            // If all validations pass, you can submit the form or perform other actions here
            alert("log-in successful!");
        });
    }
  });
  
  // For forgot password form submission
  function generateOTP() {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const email = forgotPasswordForm.querySelector("input[name='email']").value;
  
    // Replace this with your actual logic to generate and send OTP via email
    // This is just a placeholder function
    console.log("OTP generated and sent to " + email);
    alert("OTP has been sent to your email address.");
  }
  
  function setPassword() {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const newPassword = forgotPasswordForm.querySelector("input[name='newPassword']").value;
    // const confirmPassword = forgotPasswordForm.querySelector("input[name='confirmPassword']").value;
  
    // Perform form validation for setting password
    // if (newPassword === "" || confirmPassword === "") {
    //     alert("Please fill in all fields.");
    //     return;
    // }
  
    // if (newPassword !== confirmPassword) {
    //     alert("Passwords do not match. Please try again.");
    //     return;
    // }
  
    // If all validations pass, you can submit the form or perform other actions here
    alert("Password set successfully!");
  }
  
  