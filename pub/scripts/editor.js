const quill = new Quill('#editor', {
  theme: 'snow'
});

const mid = $("#mid").html();

$("#publish").click(function(){

  const title = $('#title').val()
  const content = quill.root.innerHTML

  if (title == "" || content == "") {
    $("#prompt").html("fill in the title and write something down");
    return
  }

  const request = new Request('/api/users/article/'+mid, {
    method: 'post',
    body: JSON.stringify({
      text: content,
      title: title
    }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  fetch(request).then((res) => {
    if (res.status === 200) {
      $("#prompt").html("Article is sent for approval. <br>Redirecting to movie page")
      setTimeout(function() {
        window.location.href = "/movie/"+mid;
      }, 1000)
    } else if (res.status === 201) {
      $("#prompt").html("You need to be a pro user, <br>only Pros can write articles")
    }else if (res.status === 202) {
      $("#prompt").html("You haven't logged in. <br>Redirecting to sign in")
      setTimeout(function() {
        window.location.href = "/signin";
      }, 1000)
    }
  }).catch((error) => {
    console.log(error)
  })

})
