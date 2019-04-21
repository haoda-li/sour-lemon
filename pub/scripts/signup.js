"use restrict"

const register = $("#register_btn")
const password = $("#password")
const password2 = $("#password2")
const prompt = $("#prompt")
const username = $("#username")
const email = $("#email")

let pwError = 0

password2.change(function() {
  if (password.val() != password2.val()) {
    password2.css("background-color", "#F44336")
    prompt.html("Two passwords are different")
    pwError = 1
  } else {
    password2.css("background-color", "white")
    prompt.html("Be sour today!")
    pwError = 0
  }
})

password.change(function() {

  if (password.val() != password2.val()) {
    password2.css("background-color", "#F44336")
    prompt.html("Two passwords are different")
    pwError = 1
  } else {
    prompt.html("Be sour today!")
    password2.css("background-color", "white")
    pwError = 0
  }
})

register.click(function() {
  if (!pwError) {
    let data = {
      username: username.val(),
      email: email.val(),
      password: password2.val()
    }
    const request = new Request('/api/users/signup', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });
    fetch(request).then((res) => {
      if (res.status === 200) {
        prompt.html("Welcome! <br> We are redirecting you to your page...")

        setTimeout(function() {
          window.location.href = "/user_main";
        }, 1000)
      } else {
        prompt.html("Username / Email being taken, try a different one")
        email.val("")
        password.val("")
        password2.val("")
        username.val("")
      }
    }).catch((error) => {

    })

  }
})
