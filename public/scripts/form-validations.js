// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
$(".reveal-pwd").on('click',function() {
  var $pwd = $(".pwd");
  if ($pwd.attr('type') === 'password') {
      $pwd.attr('type', 'text');
  } else {
      $pwd.attr('type', 'password');
  }
});
$(".reveal-repwd").on('click',function() {
  var $pwd = $(".repwd");
  if ($pwd.attr('type') === 'password') {
      $pwd.attr('type', 'text');
  } else {
      $pwd.attr('type', 'password');
  }
});

function checkPasswordMatch() {
  var password = $("#password").val();
  var confirmPassword = $("#retypedpassword").val();

  if (password != confirmPassword) {
  $("#divCheckPasswordMatch").html("Passwords do not match!");
  register.setAttribute("disabled");
  }
  else {
    $("#divCheckPasswordMatch").html("Passwords match.");
  var register = document.querySelector("#register");
  register.removeAttribute("disabled");
  }
}

$(document).ready(function () {
  $("#retypedpassword").keyup(checkPasswordMatch);
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})