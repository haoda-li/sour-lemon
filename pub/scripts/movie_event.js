/**Handle all the user interactions and load articles and reviews**/

const userID = $("#user_status").html()
const mid = $("#mid").html()
let index = 3
let index_comment = 4


$(".mdl-icon-toggle__input").click(updateThumb);

/**DOM manipulations don't have server calls**/
$(".rating_label").click(function(e) {
  e.preventDefault();
  $(e.target).nextAll(".rating_star").prop('checked', false);
  $(e.target).prevAll(".rating_star").prop('checked', true);
});

$("#create_story").click(function() {
  if (userID != "2") {
    const data = {
      message: 'Only Pro user can create story'
    };
    $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
    return;
  }
  window.location.href = "/editor/" + mid
});


/**DOM manipulation having server calls**/
$("#add_collection").click(function() {
  if (userID == "0") {
    const data = {
      message: 'You need to Log in'
    };
    $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
    return;
  }

  if (userID == "3") {
    const data = {
      message: 'Admin account cannot add collection'
    };
    $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
    return;
  }

  if ($("#add_collection>i").text() == "add") {
    const request = new Request('/api/collections/' + movie_id, {
      method: 'post'
    });

    fetch(request).then((res) => {
      if (res.status === 200) {
        $("#add_collection>i").text("done")
        $("#add_collection").next().text(" In Collection")
      } else if (res.static = 404) {
        const data = {
          message: 'You need to Log in'
        };
        $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
      }
    }).catch((error) => {
      console.log(error)
    })
  } else {
    const request = new Request('/api/collections/' + movie_id, {
      method: 'delete'
    });
    fetch(request).then((res) => {
      if (res.status === 200) {
        $("#add_collection>i").text("add")
        $("#add_collection").next().text(" Add to Collection")
      } else if (res.static = 404) {
        const data = {
          message: 'You need to Log in'
        };
        $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
      }
    }).catch((error) => {
      console.log(error)
    })
  }
})

$("#submit_review_btn").click(function(e) {
  e.preventDefault();

  if (userID == "0") {
    const data = {
      message: 'You need to Log in'
    };
    $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
    return;
  }

  if (userID == "3") {
    const data = {
      message: 'Admin account cannot post'
    };
    $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
    return;
  }

  const reviewText = $("#review_input_text").val();
  const stars = $("#submit_rating>input")
  let numStars = 0
  for (let i = 0; i < stars.length; i++) {
    numStars += stars[i].checked
  }
  if (reviewText == "") {
    const data = {
      message: 'Please write something before Posting'
    };
    $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
  } else if (numStars == 0) {
    const data = {
      message: 'Don\'t forget rating stars'
    };
    $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
  } else {
    writeReview(reviewText, numStars)
  }
})



$('#load_story').click(function() {

  requestArticle(index);
  index = index + 1

})

$('#load_comments').click(function() {
  for (let i = 0; i < 2; i++) {
    requestComment(index_comment)
    index_comment++
  }
})

function updateThumb() {
  const number = $(this).parent().next();
  const obj = $(this).attr("id");
  const check = $(this).prop('checked') ? 1 : 0;

  const request = new Request('/api/comments/like/' + obj + "/" + check, {
    method: "post"
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.text().then((data) => {
        number.text(parseInt(data))
      })
    }
  }).catch((error) => {
    console.log(error)
  })
}



/**Helper functions for displaying loaded comments and stories**/
function displayComment(user, text, num, thumb_num, obj, userId) {
  let cell = $("#review_cell_right")
  if ($("#review_cell_left").children().length == $("#review_cell_right").children().length) {
    cell = $("#review_cell_left")
  }
  const reviewDiv = $('<div class="review black_back"></div>').attr("id", obj)
  const user_link = $('<a></a>').attr('href', '/user_view/' + userId)

  const image = $('<img class="user_portriat">').attr("src", "/pub/assets/user_main/" + userId)
  image.on("error", function() {
    $(this).unbind("error").attr("src", "/pub/assets/user_main/lemon.png");
  });
  user_link.append(image)
  const user_text = $('<span class="index_text yellow"></span>').text(user)
  const rating_placer = $('<div class="review_rating_placer"></div>')
  for (let i = 0; i < num; i++) {
    rating_placer.append('<img src="/pub/assets/lemon.png" class="rating_star_img">')
  }
  const stat_placer = $('<div class="review_stat_placer"></div>')
  const label = $('<label class="mdl-icon-toggle mdl-js-icon-toggle mdl-js-ripple-effect"></label>')

  const check = $('<input type="checkbox" class="mdl-icon-toggle__input">').attr("id", obj)
  check.click(updateThumb)
  const icon = $('<i class="mdl-icon-toggle__label material-icons white">thumb_up</i>')
  label.append(check, icon)
  const thumb_up_num = $('<span class="white"></span>').text(thumb_num)
  stat_placer.append(label, thumb_up_num)
  const text_div = $('<div class="white_back"></div>')
  const text_in = $('<p class="review_content"></p>').text(text)
  text_div.append(text_in)
  reviewDiv.append(user_link, user_text, rating_placer, stat_placer, text_div)
  cell.append(reviewDiv)
  componentHandler.upgradeDom("MaterialCheckbox");
  componentHandler.upgradeAllRegistered();
}

function displayStory(title, user, text, link) {
  const story_card = $('<div class="story_card mdl-card mdl-shadow--2dp"></div>')

  const title_card = $('<div class="mdl-card__title"></div>')
  const title_text = $('<h2 class="mdl-card__title-text black index_text"></h2>').text(title)
  title_card.append(title_text)

  const support_card = $('<div class="mdl-card__supporting-text"></div>').text(' by ')
  const author = $('<span class="yellow index_text">Lemon 12345</span>').text(user)
  support_card.append(author)

  const text_div = $('<div class="mdl-card__supporting-text general_text"></div>').html(text)

  const read_btn = $('<div class="mdl-card__actions mdl-card--border"></div>')
  const read_link = $('<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Read more</a>')
  read_link.prop('href', "/article/" + link)
  read_btn.append(read_link)

  story_card.append(title_card, support_card, text_div, read_btn)
  if ($('#stories').children().length >= 5) {
    $('#stories').children().first().remove()
  }
  $('#stories').append(story_card)
}


// server calls and response
const writeReview = (reviewText, stars) => {
  const request = new Request('/api/users/comment/' + mid, {
    method: 'post',
    body: JSON.stringify({
      text: reviewText,
      stars: stars
    }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  });

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        displayComment(data.username, data.text, data.stars, data.like, data._id, data.userId);
      })

    } else if (res.status == 202) {
      const data = {
        message: 'Each user can only post one comment'
      };
      $("#error_toast")[0].MaterialSnackbar.showSnackbar(data);
      return;
    }
  }).catch((error) => {
    console.log(error)
  })
}

const requestArticle = (i) => {
  const request = new Request('/api/articles/movies/' + mid + "/" + i, {
    method: 'get',
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        displayStory(data.title, data.username, data.text, data._id)
      })
    } else if (res.status === 202) {
      $("#load_story").attr("disabled", true);
    }
  }).catch((error) => {
    console.log(error)
  })
}

requestArticle(0)
requestArticle(1)
requestArticle(2)

const requestComment = (i) => {
  const request = new Request('/api/comments/' + mid + "/" + i, {
    method: 'get',
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        displayComment(data.username, data.text, data.stars, data.like, data._id, data.userId);
      })
    } else if (res.status === 202) {
      $("#load_comments").attr("disabled", true);
    }
  }).catch((error) => {
    console.log(error)
  })
}

requestComment(0)
requestComment(1)
requestComment(2)
requestComment(3)


const requestStars = () => {
  const request = new Request('/api/movies/stars/' + mid)
  fetch(request).then((res) => {
    if (res.status === 200) {
      res.text().then((data) => {
        const stars = parseInt(data)
        const text_map = ["No comment yet", "Not Sour ", "A bit Sour ",
          "Kinda Sour ", "Very Sour ", "Rua, super SOUR "
        ];
        $("#sour_rate span").text(text_map[stars])
        for (let i = 0; i < stars; i++) {
          $("#sour_rate").append("<img src=\"/pub/assets/lemon.png\"class=\"lemon_icon\">")
        }
      })
    }
  })
}

requestStars()
