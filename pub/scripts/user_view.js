"use strict";

const snackbarContainer = document.querySelector('#demo-toast-example');

let user_id = null;
/** Here articles should be read from database**/
const articlesList = [];
/** Here reviews should be read from database**/
const reviewsList = [];
/** Here collections should be read from database**/
const collectionsList = [];
initialize();

async function initialize() {
  get_id();
  getCollection();
  getArticle();
  getReview();
  addAchievements();
}

//get user id
function get_id() {
  const url = window.location.href;
  const index = url.indexOf("view/");
  user_id = url.slice(index + 5, url.length + 1);
  console.log(user_id);
}

//change follower
$("#follow_button").click(function() {
  let followButton = $("#follow_button");
  if (followButton.text() === "follow") {
    const follower = $("#follower").children().eq(1);
    //server
    const request = new Request("/api/users/user/increase_follower/" + user_id, {
      method: "PATCH",
      headers: {
        "Accept": "application/json"
      }
    });
    fetch(request)
      .then((res) => {
        if (res.status === 200) {
          follower.text(parseInt(follower.text()) + 1);
          followButton.text("unfollow");
          //test
          console.log(res.body);
        } else if (res.status === 404) {
          const data = {
            message: "please log in"
          };
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        } else {
          const data = {
            message: "fail to follow"
          };
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
      })
      .catch((err) => {
        const data = {
          message: "fail to follow"
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
        console.log(err)
      })

    //add server
  } else if (followButton.text() === "unfollow") {
    const follower = $("#follower").children().eq(1);
    //server
    const request = new Request("/api/users/user/decrease_follower/" + user_id, {
      method: "PATCH",
      headers: {
        "Accept": "application/json"
      }
    });
    fetch(request)
      .then((res) => {
        if (res.status === 200) {
          follower.text(parseInt(follower.text()) - 1);
          followButton.text("follow");
        } else if (res.status === 404) {
          const data = {
            message: "please log in"
          };
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        } else {
          const data = {
            message: "fail to unfollow"
          };
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
      })
      .catch((err) => {
        const data = {
          message: "fail to unfollow"
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
        console.log(err)
      });
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
        message: "Could not get reviews pleasetry re log in "
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);

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
    $("#loadMoreArticle").attr('disabled', true)
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
function getCollection() {
  const url = "/api/collections/user/" + user_id;
  fetch(url).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      const data = {
        message: "Could not get collection please try re log in"
      };
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
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
