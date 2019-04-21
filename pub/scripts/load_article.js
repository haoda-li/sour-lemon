const id = $("#id_f").html()

const request = new Request('/api/articles/content/'+id)

fetch(request).then((res) => {
  if (res.status === 200){
    res.json().then((data) => {
      $("#text_f").html(data.text)
      $("#like_f").html(data.like)
      $("#author_f").html(data.username)
      $("#title_f").html(data.title)
      const image = $('<img class="minilogo">').attr("src", "/pub/assets/user_main/" + data.userId)
      image.on("error", function() {
        $(this).unbind("error").attr("src", "/pub/assets/user_main/lemon.png");
      });
      $("#userLogo").prepend(image)
    })
  }
}).catch((error) => {
  console.log(error)
})



$("#likebtn").on('click', function(e){
	const url = '/api/articles/loveArticle/' + id

	const request = new Request(url, {
	    method: 'post', 
	    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });

    fetch(request).then((res) => {
      if (res.status === 200) {
        return res.json() 
      }
    }).then((json)=>{
      $("#like_f").html(json.like)
      $(".meta__favorites .material-icons").addClass("red")
      $("#likebtn").off()
    })
})

