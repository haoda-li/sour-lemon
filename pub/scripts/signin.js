const prompt = $("#prompt");

$("#register_btn").click(function() {
  const data = {
    email: $("#username").val(),
    password: $("#password").val()
  };


  const request = new Request('/api/users/signin', {
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
      res.json().then((data) => {
        setTimeout(function() {
          if (Number(data.status) === 3) {
            window.location.href = "/admin";
          } else {
            window.location.href = "/user_main";
          }
        }, 1000)
      })

    } else {
      prompt.html("Email/password wrong, try again")
      $("#username").val("")
      $("#password").val("")
    }
  }).catch((error) => {

  })


})
