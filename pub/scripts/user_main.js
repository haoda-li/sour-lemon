"use strict";
let user_id = null;

const snackbarContainer = document.querySelector('#demo-toast-example');

/** Here articles should be read from database**/
const articlesList = [];
/** Here reviews should be read from database**/
const reviewsList = [];
/** Here collections should be read from database**/
const collectionsList = [];
initialize();

async function initialize() {
  await get_id().then((res) => {
    getCollection();
    getArticle();
    getReview();
    addAchievements();
  });
}

//get user id
function get_id() {
  const url = '/api/users/user/get_id';
  return fetch(url)
    .then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          user_id = data.id;
        })
      } else {
        const data = {
          message: 'Could not get user id, please re login'
        };
          document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar(data);
      }
    }).catch((error) => {
      console.log(error)
    })
}

//change portrait
$("#portrait_container1").click(function(e) {
  if (e.target.type === "submit") {
    const input = e.target.previousElementSibling;
    if (input.files.length !== 0) {
      e.preventDefault();
      //add server code!
      const file = input.files[0];
      const formData = new FormData();
      formData.append("id", user_id);
      formData.append("image", file);
      if (!file.type.match('image.*')) {
        return;
      }
      const request = new Request("/api/users/user_main/avatar", {
        method: 'post',
        body: formData
      });
      fetch(request)
        .then(function(res) {
          e.target.parentElement.parentElement.firstElementChild.src = "pub/assets/user_main/" + user_id;
          location.reload();
        }).catch((error) => {
          console.log(error)
        })
    }
  }
});

//add a short review
function addReview(review) {
  let $newReview = $('<li class="mdl-list__item mdl-list__item--three-line">' +
    '                                    <span class="mdl-list__item-primary-content">' +
    '                                        <a href="/movie/' + review.movieId + '">' + review.movieTitle + '</a>' +
    '                                        <span class="mdl-list__item-text-body">' +
    review.text +
    '                                        </span>' +
    '                                    </span>' +
    '                                    <span class="mdl-list__item-secondary-content">' +
    '                                        <button class="mdl-button mdl-js-button mdl-button--primary delete" id="' + review._id + '">' +
    '                                          Delete' +
    '                                        </button>' +
    '                                    </span>' +
    '                                </li>');
  $("#admin-short-reviews ul").append($newReview);
}

//load more review
$("#loadMoreReviews").click(function() {
  if (reviewsList.length === 0) {
    $("#loadMoreReviews").attr('disabled', true)
  } else {
    let limit = reviewsList.length;
    if (limit > 10) {
      limit = 10;
    }
    for (let i = 0; i < limit; i++) {
      let article = reviewsList.pop();
      addReview(article);
    }
  }
});

function getReview() {
  const url = "/api/comments/userComments/" + user_id;
  fetch(url).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      const data = {
        message: "Could not get reviews please try re log in"
      };
        document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar(data);
    }
  }).then((json) => {
    let index = 0;
    const comment = json.comments;
    comment.map((comment) => {
      fetch('/api/movies/' + comment.movieId).then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          comment.movieTitle = "movie not available";
          if (index < 10) {
            addReview(comment);
            index++;
          } else {
            reviewsList.push(comment);
          }
        }
      }).then((json) => {
        comment.movieTitle = json.title;
        if (index < 10) {
          addReview(comment);
          index++;
        } else {
          reviewsList.push(comment);
        }
      }).catch((error) => {
        console.log(error)
      });
    });
  })
}

//delete short reviews
$("#short_review").on('click', '.mdl-button', function(e) {
  e.preventDefault();
  const button = $(e.target);
  const review = button.parent().parent();
  if (button.hasClass('delete')) {
    const request = new Request("/api/comments/" + button.attr("id"), {
      method: "delete"
    });
    fetch(request).then((res) => {
      if (res.status === 200) {
        review.remove()
      } else {
        const data = {
          message: "unable to delete comment"
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      }
    }).catch((err) => {
      const data = {
        message: "unable to delete comment"
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
      console.log(err)
    })
  }
});

//add articles
function addArticles(article) {
  let $newArticle = $('<div class="story_card mdl-card mdl-shadow--2dp">' +
    '                            <div class="mdl-card__title">' +
    '                                <h2 class="mdl-card__title-text black index_text">' + article.title + '</h2>' +
    '                            </div>' +
    '                            <div class="mdl-card__supporting-text">' +
    '                                by <span class="yellow index_text">' + article.username + '</span>  wrote for <span class="yellow index_text">' + article.movieTitle + '</span>' +
    '                            </div>' +
    '                            <div class="mdl-card__supporting-text general_text">' +
    article.text +
    '                            </div>' +
    '                            <div class="mdl-card__actions mdl-card--border">' +
    '                                <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="/article/' + article._id + '">' +
    '                                    Read more' +
    '                                </a>' +
    '                            </div>' +
    '                        </div>');
  $("#allArticles").append($newArticle);
}
//load more article
$("#loadMoreArticle").click(function() {
  if (articlesList.length === 0) {
    $("#loadMoreArticle").attr("disabled", true)
  } else {
    let limit = articlesList.length;
    if (limit > 10) {
      limit = 10;
    }
    for (let i = 0; i < limit; i++) {
      let article = articlesList.pop();
      addArticles(article);
    }
  }
});

//get articles from server
function getArticle() {
  const url = "/api/articles/user/article/" + user_id;
  fetch(url).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      const data = {
        message: "Could not get articles please try re log in"
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
  }).then((json) => {
    let index = 0;
    const articles = json.articles;
    articles.map((article) => {
      fetch('/api/movies/' + article.movieId).then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          article.movieTitle = "movie not available";
          if (index < 10) {
            addArticles(article);
            index++;
          } else {
            articlesList.push(article);
          }
        }
      }).then((json) => {
        article.movieTitle = json.title;
        if (index < 10) {
          addArticles(article);
          index++;
        } else {
          articlesList.push(article);
        }
      }).catch((error) => {
        console.log(error)
      });
    });
  })
}

//delete articles
$("#articles").on('click', '.mdl-button', function(e) {
  const button = $(e.target);
  const review = button.parent().parent();
  if (button.hasClass('delete')) {
    const request = new Request("/api/articles/" + button.attr("id"), {
      method: "delete"
    });
    fetch(request).then((res) => {
      if (res.status === 200) {
        e.preventDefault();
        review.remove()
      } else {
        const data = {
          message: "unable to delete article"
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      }
    });
  }
});
//user_description
$("#username").val($("#user_name").text().replace(/^\s+|\s+$/g, ""));
$("#description").text($("#user_description").text().replace(/^\s+|\s+$/g, ""));
//update user information
$("#my_account").on('click', '.mdl-button', function(e) {
  //modify username, and description
  e.preventDefault();
  let ableSubmit = true;
  const userNameBox = $("#username");
  const userName = userNameBox.val();
  if (userName === "") {
    userNameBox.next().next().css("visibility", "visible");
    ableSubmit = false;
  }
  
  //modify password,
  const newPassWord = $("#newPassWord").val();
  const oldPassWord = $("#oldPassWord").val();

  if (newPassWord != "" && oldPassWord != "") {
    modifyPw(newPassWord, oldPassWord)
  }

  //send user description
  if (ableSubmit) {
    let userInfo = {};
    const description = $("#description").val();
    if (description.length > 100) {
      let arr = description.split();
      let newString = "";
      let hundred = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 100) {
          newString = newString + arr[i].slice(0, 100 - newString.length) + "<br>" + arr[i].slice(100 - newString.length, -1);
          hundred = true;
        } else {
          newString = newString + arr[i] + " ";
        }
        if (newString.length > 100 && hundred === false) {
          newString = newString + "<br>";
          hundred = true;
        }
      }
      userInfo.description = newString;

    } else {
      userInfo.description = description;
      $("#user_description").html(description);
    }
    userInfo.username = userName;
    const url = "/api/users/user/change_info/" + user_id;
    const request = new Request(url, {
      method: "PATCH",
      body: JSON.stringify(userInfo),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });
    fetch(request).then((res) => {
      if (res.status === 200) {
        $("#user_description").html(userInfo.description);
        $("#user_name").text(userInfo.username);
      } else {
        const data = {
          message: "failed upload user info"
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      }
    }).catch((err) => {
      const data = {
        message: "failed upload user info"
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
      console.log(err)
    })
  }
});

//add collections
function addCollections(movie) {
  let movieTitle = movie.movieTitle;
    if(movieTitle.length > 20){
        movieTitle = movieTitle.substring(0,20);
        movieTitle += "...";
    }
  let $newPoster = $(
    '                <a href="/movie/' + movie.movieId + '" class="movie-card">' +
    '                  <div class="moive-card-image">' +
    '                    <svg>' +
    '                      <image class="poster" xlink:href="https://image.tmdb.org/t/p/w300/' + movie.postUrl + '">' +
    '                      </image>' +
    '                    </svg>' +
    '                  </div>' +
    '                  <div class="moive-card-bottom">' +
    '                    <span>' + movieTitle + '</span>' +
    '                    <span class="moive-acidity">' + Number(movie.stars) * 20 + '% sour</span>' +
    '                  </div>' +
    '                </a>');
  $("#moviePosters").append($newPoster);
}

//get collections from server
//get articles from server
function getCollection() {
  const url = "/api/collections/user/" + user_id;
  fetch(url).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      const data = {
        message: "Could not get collection please try re log in"
      };
        document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar(data);

    }
  }).then((json) => {
    const collections = json.collections;
    collections.map((collection) => {
      fetch('/api/movies/' + collection.movieId).then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          collection.movieTitle = "movie not available";
          addReview(collection);
          collectionsList.push(collection);
        }
      }).then((json) => {
        collection.movieTitle = json.title;
        collection.postUrl = json.posterPath;
        collection.stars = json.stars;
        addCollections(collection);
        collectionsList.push(collection);
      }).catch((error) => {
        console.log(error)
      });
    });
  })
}

//add collections
function addAchievements() {
  fetch("/api/comments/total/likes/" + user_id).then(res => {
    if (res.status === 200) {
      res.json().then((data) => {
        let $newAchievement = $('<div class="achievement_each">' +
          '              <h5 class="index_text orange">You received</h5>' +
          '              <h5 class="index_text orange">' + data.like + ' likes </h5>' +
          '            </div>');
        $("#achievement").append($newAchievement);
      })
    } else {
      reject("err")
    }
  }).catch((err) => {
    let $newAchievement = $('<div class="achievement_each">' +
      '              <h5 class="index_text orange">Cannot found</h5>' +
      '              <h5 class="index_text orange"> likes received </h5>' +
      '            </div>');
    $("#achievement").append($newAchievement);
  });
}

function modifyPw(newpw, oldpw) {
  const data = {
    newPassWord: newpw,
    oldPassWord: oldpw
  };
  //first check then change pass word
  const url = '/api/users/admin/checkpw/' + data.oldPassWord;
  fetch(url).then((res) => {
    if (res.status === 200) {
      const urll = '/api/users/admin/changepw/' + data.newPassWord;
      const request = new Request(urll, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      fetch(request)
        .then(function(res) {
          if (res.status === 200) {
            const data = {
              message: "Your password has been changed."
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
          }
        }).catch((error) => {
          console.log(error)
        })

    } else {
      const data = {
        message: "please try again."
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);

      $("#oldPassWord").val("");
      $("#newPassWord").val("");
    }
  }).catch((error) => {
    console.log(error)
  });
}
