"use restrict"

const usersList = document.querySelector('#users-panel tbody')
const moviesList = document.querySelector('#movies-panel tbody')
const commentsList = document.querySelector('.adminShortReviews tbody')
const unreviewedList = document.querySelector('#unreviewed_articles')
const reviewedList = document.querySelector('#reviewed_articles')
const movie_hidden = document.querySelector('#article_search_movie_input_hidden')
const user_hidden = document.querySelector('#article_search_arthur_input_hidden')
const movie_hidden_c = document.querySelector('#reviews_search_movie_input_hidden')
const user_hidden_c = document.querySelector('#reviews_search_arthur_input_hidden')
const movie_hidden_m = document.querySelector('#movies_search_movie_input_hidden')
const user_hidden_u = document.querySelector('#users_search_movie_input_hidden')

let unreviewed_article_index = 0;
let reviewed_article_index = 0;
let search_reviewed_article_index = 0;
let search_unreviewed_article_index = 0;
let comment_index = 0;
let search_comment_index = 0;
let movie_index = 0;
let search_movie_index = 0;
let user_index = 0;
let search_user_index = 0;


display_aritcles()
display_comments()
display_movies()
display_users()

/** Eventhandler Functions.**/
function RefreshSomeEventListener() {
    // Remove handler from existing elements
    $(".storyCard").off(); 

    // Re-add event handler for all matching elements
    $(".storyCard").on('click','button', function(e){
      e.preventDefault();
      const button = $(e.target).parent()
      const buttonList = button.parent()
      const card = button.parent().parent()
      if (button.hasClass('approve')) {
        const url = '/api/articles/approve/' + button[0].getAttribute("data");
        const request = new Request(url, {
            method: 'post', 
            headers: {
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
          $("#load_unreviewed_story").attr("disabled", false);
          $("#load_reviewed_story").attr("disabled", false);
          movie_hidden.innerHTML = ""
          user_hidden.innerHTML = ""
          search_unreviewed_article_index = 0
          search_reviewed_article_index = 0
          unreviewed_article_index = 0
          reviewed_article_index = 0
          display_aritcles()
        }).catch((error) => {
            console.log(error)
        })
      }else if (button.hasClass('reject')) {
        const url = '/api/articles/' + button[0].getAttribute("data");
        const request = new Request(url, {
            method: 'delete', 
            headers: {
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
            card.remove()
        }).catch((error) => {
            console.log(error)
        })
        
      }else if($(e.target).hasClass('delete')){
        const url = '/api/articles/' + e.target.getAttribute("data");
        const request = new Request(url, {
            method: 'delete', 
            headers: {
                'Content-Type': 'application/json'
            },
        });
        fetch(request)
        .then(function(res) {
          $(e.target).parent().parent().remove()
        }).catch((error) => {
            console.log(error)
        })
        
      }
    });
}

$(document).ready(function() {
    RefreshSomeEventListener();
});

$(".adminShortReviews").on('click','.mdl-button', function(e){
  e.preventDefault();

  const button = $(e.target)
  const review = button.parent().parent()
  if(button.hasClass('delete')){
    const url = '/api/comments/' + e.target.id
    const request = new Request(url, {
        method: 'delete', 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        review.remove()
    }).catch((error) => {
        console.log(error)
    })
  	
  }
});

$("#movies-panel").on('click','.mdl-button', function(e){
  e.preventDefault();

  const button = $(e.target)
  const movie = button.parent().parent()
  if(button.hasClass('delete')){
    const url = '/api/movies/' + e.target.id
    const request = new Request(url, {
        method: 'delete', 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        movie.remove()
        return res.json()
    }).then(function(res) {
        const urll = '/api/users/marticlesncommentsncollections/' + res.movie.id
        const requestt = new Request(urll, {
            method: 'delete', 
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(requestt)
        .then(function(res) {
            display_comments()
            display_aritcles()
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        console.log(error)
    })
  	
  }
});

$("#users-panel").on('click','.mdl-button', function(e){
  e.preventDefault();

  const button = $(e.target)
  const buttonTd = button.parent()
  const user = button.parent().parent()
  if(button.hasClass('delete')){
    const url = '/api/users/' + e.target.id
    const request = new Request(url, {
        method: 'delete', 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        user.remove()
        const urll = '/api/users/articlesncomments/' + e.target.id
        console.log(urll)
        const requestt = new Request(urll, {
            method: 'delete', 
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
        fetch(requestt)
        .then(function(res) {
            display_comments()
            display_aritcles()
        }).catch((error) => {
            console.log(error)
        })
    }).catch((error) => {
        console.log(error)
    })
  	
  }else if (button.hasClass('changeStatus')) {
    const url = '/api/users/userssw/' + e.target.getAttribute("data");

    const request = new Request(url, {
        method: 'post', 
        headers: {
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        if (buttonTd.prev().hasClass('yellow')) {
          buttonTd.prev().removeClass('yellow')
          buttonTd.prev().text('Sour User')
          button.text('Promote')
        }else{
          buttonTd.prev().addClass('yellow')
          buttonTd.prev().text('Sour Pro')
          button.text('Demote')
        }
    }).catch((error) => {
        console.log(error)
    })
  	
  }
});

$("#addMovieButton").click(function(e){
  e.preventDefault();


  const fields = $("#addMovieForm form").serializeArray()
  if (!(fields[0].value === "")) {
    const url = '/api/movies/add-new-movie/' + fields[0].value
    const request = new Request(url, {
        method: 'post', 
        headers: {
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
      if(res.status === 200){
        res.json().then((data) => {

          movie_index = 0;
          display_movies();
          $('#addMovieForm form').trigger("reset");
          $('#movieprompt').html(`Add movie ${data.movie.title} successfully!`)
        })
        
      }else if (res.status === 401) {
        $('#movieprompt').html(`Movie already exists!`)
      }else{
        $('#movieprompt').html(`Wrong movie ID!`)
      }
    })
    
  }else{
      $("#addMovieForm").toggle("slow");
  }

});

$("#changePw_btn").click(function () {
  const prompt = $("#prompt");
  const data = {
    oldPassWord: $("#oldPassWord").val(),
    newPassWord: $("#newPassWord").val()
  };

  if (!$("#oldPassWord").val() || !$("#newPassWord").val()) {
    prompt.html("Please complete the form.")
    return false;
  }

  const url = '/api/users/admin/checkpw/' + data.oldPassWord
  fetch(url).then((res) => {
    if (res.status === 200) {
      const urll = '/api/users/admin/changepw/' + data.newPassWord
      const request = new Request(urll, {
        method: 'post', 
        headers: {
            'Content-Type': 'application/json'
        },
      });
      fetch(request)
      .then(function(res) {
          prompt.html("Your password has been changed.")
      }).catch((error) => {
          console.log(error)
      })

      
    } else  {
      prompt.html("Password wrong, try again")
      $("#oldPassWord").val("")
      $("#newPassWord").val("")
      
    }
  }).catch((error) => {

  })
  return false;
})

$("#userSearch").click(function(){
  const user = document.querySelector('#users_search_arthur_input').value
  if (user == '') {
    $("#load_users").attr("disabled", false);
    user_hidden_u.innerHTML = ""
    user_index = 0
    search_user_index = 0
    display_users()
    return;
  }else if(user_hidden_u.innerHTML){
    search_user_index = 0
  }

  usersList.innerHTML = ''

  let data = {
        username: user
  }

  user_hidden_u.innerHTML = user

  $("#load_users").attr("disabled", false);
  for (let i = 0; i < 10; i++) {
    requestSearchUsers(search_user_index, data);
    search_user_index = search_user_index + 1
  }
})

$("#movieSearch").click(function(){
  const movie = document.querySelector('#movies_search_movie_input').value
  moviesList.innerHTML = ''



  if (movie == '') {
    $("#load_movies").attr("disabled", false);
    movie_hidden_m.innerHTML = ""
    movie_index = 0
    search_movie_index = 0
    display_movies()
    return;
  }else if(movie_hidden_m.innerHTML){
    search_movie_index = 0
  }

  let data = {
        titleOrId: movie,
  }
  movie_hidden_m.innerHTML = movie

  $("#load_movies").attr("disabled", false);
  for (let i = 0; i < 10; i++) {
    requestSearchMovie(search_movie_index, data);
    search_movie_index = search_movie_index + 1
  }
})

$("#commentSearch").click(function(){

  const movie = document.querySelector('#reviews_search_movie_input').value
  const user = document.querySelector('#reviews_search_arthur_input').value

  commentsList.innerHTML = ''
  if (movie == '' && user == '') {
    $("#load_comment").attr("disabled", false);
    movie_hidden_c.innerHTML = ""
    user_hidden_c.innerHTML = ""
    comment_index = 0
    search_comment_index = 0
    display_comments()
    return;
  }else if(movie_hidden_c.innerHTML || user_hidden_c.innerHTML){
    search_comment_index = 0
  }

  
  movie_hidden_c.innerHTML = movie
  user_hidden_c.innerHTML = user

  let data = {
        id: movie,
        username: user
  }

  $("#load_comment").attr("disabled", false);
  for (let i = 0; i < 10; i++) {
    requestSearchComment(search_comment_index, data);
    search_comment_index = search_comment_index + 1
  }

})

$("#articleSearch").click(function(){
  const movie = document.querySelector('#article_search_movie_input').value
  const user = document.querySelector('#article_search_arthur_input').value

  unreviewedList.innerHTML = '<h1>Articles waiting for approval</h1>'
  reviewedList.innerHTML = '<h1>Approved Articles</h1>'
  if (movie == '' && user == '') {
    $("#load_unreviewed_story").attr("disabled", false);
    $("#load_reviewed_story").attr("disabled", false);
    movie_hidden.innerHTML = ""
    user_hidden.innerHTML = ""
    search_unreviewed_article_index = 0
    search_reviewed_article_index = 0
    unreviewed_article_index = 0
    reviewed_article_index = 0
    display_aritcles()
    return;
  }else if(movie_hidden.innerHTML || user_hidden.innerHTML){
    search_unreviewed_article_index = 0
    search_reviewed_article_index = 0
  }


  movie_hidden.innerHTML = movie
  user_hidden.innerHTML = user


  let data = {
        id: movie,
        username: user
  }

  $("#load_unreviewed_story").attr("disabled", false);
  $("#load_reviewed_story").attr("disabled", false);
  for (let i = 0; i < 5; i++) {
    requestSearchArticle(search_unreviewed_article_index, data, 0);
    requestSearchArticle(search_reviewed_article_index, data, 1);
    search_reviewed_article_index = search_reviewed_article_index + 1
    search_unreviewed_article_index = search_unreviewed_article_index + 1
  }
})

$('#load_unreviewed_story').click(function() {
  if (movie_hidden.innerHTML == '' && user_hidden.innerHTML == '') {
    for (let i = 0; i < 5; i++) {
      requestUnreviewedArticle(unreviewed_article_index);
      unreviewed_article_index = unreviewed_article_index + 1
    }
  }else{
    let data = {
        id: movie_hidden.innerHTML,
        username: user_hidden.innerHTML
    }
    for (let i = 0; i < 5; i++) {
      requestSearchArticle(search_unreviewed_article_index, data, 0);
      search_unreviewed_article_index = search_unreviewed_article_index + 1
    }
  }
  
})

$('#load_reviewed_story').click(function() {
  if (movie_hidden.innerHTML == '' && user_hidden.innerHTML == '') {
    for (let i = 0; i < 5; i++) {
      requestReviewedArticle(reviewed_article_index);
      reviewed_article_index = reviewed_article_index + 1
    }
  }else{
    let data = {
        id: movie_hidden.innerHTML,
        username: user_hidden.innerHTML
    }
    for (let i = 0; i < 5; i++) {
      requestSearchArticle(search_reviewed_article_index, data, 1);
      search_reviewed_article_index = search_reviewed_article_index + 1
    }
  }
  
})

$('#load_comment').click(function() {
  if (movie_hidden_c.innerHTML == '' && user_hidden_c.innerHTML == '') {
    for (let i = 0; i < 10; i++) {
      requestComment(comment_index)
      comment_index++
    }
  }else if (movie_hidden_c.innerHTML != '' || user_hidden_c.innerHTML != '') {
    let data = {
        id: movie_hidden_c.innerHTML,
        username: user_hidden_c.innerHTML
    }
    for (let i = 0; i < 10; i++) {
      requestSearchComment(search_comment_index, data);
      search_comment_index = search_comment_index + 1
    }
  }
  
})

$('#load_movies').click(function() {
  if (movie_hidden_m.innerHTML == '') {
    for (let i = 0; i < 10; i++) {
      requestMovies(movie_index)
      movie_index++
    }
  }else if (movie_hidden_m.innerHTML != '') {
    let data = {
        titleOrId: movie_hidden_m.innerHTML
    }
    for (let i = 0; i < 10; i++) {
      requestSearchMovie(search_movie_index, data);
      search_movie_index = search_movie_index + 1
    }
  }
  
})

$('#load_users').click(function() {
  if (user_hidden_u.innerHTML == '') {
    for (let i = 0; i < 10; i++) {
      requestUsers(user_index)
      user_index++
    }
  }else if (user_hidden_u.innerHTML != '') {
    let data = {
        username: user_hidden_u.innerHTML
    }
    for (let i = 0; i < 10; i++) {
      requestSearchUsers(search_user_index, data);
      search_user_index = search_user_index + 1
    }
  }
  
})

/** Request and Display page functions **/

function requestUnreviewedArticle(i) {
  const request = new Request('/api/articles/loadUnreviewedArticle/' + i, {
    method: 'get',
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        
        const urll = '/api/movies/movie/' + data.movieId
        fetch(urll)
        .then((res) => {
          if (res.status === 200) {
            return res.json() 
          } else {
            alert('Could not get articles')
          }  
        })
        .then((json1) => {
            display_aritcles_DOM(data.status, data.title, data.username, json1.title, data.movieId, data.text, data._id)
          
        }).catch((error) => {
          console.log(error)
        })
      
      })
    } else if (res.status === 202) {
      $("#load_unreviewed_story").attr("disabled", true);
    }
  }).catch((error) => {
    console.log(error)
  })
}


function requestReviewedArticle(i) {
  const request = new Request('/api/articles/loadReviewedArticle/' + i, {
    method: 'get',
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        
        const urll = '/api/movies/movie/' + data.movieId
        fetch(urll)
        .then((res) => {
          if (res.status === 200) {
            return res.json() 
          } else {
            alert('Could not get articles')
          }  
        })
        .then((json1) => {
            display_aritcles_DOM(data.status, data.title, data.username, json1.title, data.movieId, data.text, data._id)
          
        }).catch((error) => {
          console.log(error)
        })
      
      })
    } else if (res.status === 202) {
      $("#load_reviewed_story").attr("disabled", true);
    }
  }).catch((error) => {
    console.log(error)
  })
}

function requestSearchArticle(i, data, status) {
  const request = new Request('/api/articles/searchArticle/' + i + '/' + status, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        
        const urll = '/api/movies/movie/' + data.movieId
        fetch(urll)
        .then((res) => {
          if (res.status === 200) {
            return res.json() 
          } else {
            alert('Could not get articles')
          }  
        })
        .then((json1) => {
            display_aritcles_DOM(data.status, data.title, data.username, json1.title, data.movieId, data.text, data._id)
          
        }).catch((error) => {
          console.log(error)
        })
      
      })
    } else if (res.status === 202) {
      if (status == 0) {
        $("#load_unreviewed_story").attr("disabled", true);
      }else{
        $("#load_reviewed_story").attr("disabled", true);
      }
      
    }
  }).catch((error) => {
    console.log(error)
  })
}

function requestComment(i) {
  const request = new Request('/api/comments/loadComment/' + i, {
    method: 'get',
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        const urll = '/api/movies/movie/' + data.movieId
        fetch(urll)
        .then((res) => {
          if (res.status === 200) {
            return res.json() 
          } else {
            alert('Could not get comments')
          }  
        })
        .then((json1) => {
            display_comments_DOM(data.username, data.movieId, json1.title, data.text, data._id)
          
        }).catch((error) => {
          console.log(error)
        })
      
      })
    } else if (res.status === 202) {
      $("#load_comment").attr("disabled", true);
    }
  }).catch((error) => {
    console.log(error)
  })
}

function requestSearchComment(i, data) {
  const request = new Request('/api/comments/searchComment/' + i, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        
        const urll = '/api/movies/movie/' + data.movieId
        fetch(urll)
        .then((res) => {
          if (res.status === 200) {
            return res.json() 
          } else {
            alert('Could not get comments')
          }  
        })
        .then((json1) => {
            display_comments_DOM(data.username, data.movieId, json1.title, data.text, data._id)
          
        }).catch((error) => {
          console.log(error)
        })
      
      })
    } else if (res.status === 202) {
      $("#load_comment").attr("disabled", true);  
    }
  }).catch((error) => {
    console.log(error)
  })
}

function requestMovies(i) {
  const request = new Request('/api/movies/loadMovie/' + i, {
    method: 'post',
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        display_movies_DOM(data.id, data.title, data._id)
      
      })
    } else if (res.status === 202) {
      $("#load_movies").attr("disabled", true);
    }
  }).catch((error) => {
    console.log(error)
  })
}

function requestSearchMovie(i, data) {
  const request = new Request('/api/movies/searchmovie/' + i, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        
        display_movies_DOM(data.id, data.title, data._id)
      
      })
    } else if (res.status === 202) {
      $("#load_movies").attr("disabled", true);  
    }
  }).catch((error) => {
    console.log(error)
  })
}

function requestUsers(i) {
  const request = new Request('/api/users/loadUser/' + i, {
    method: 'get',
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        display_users_DOM(data.username, data.email, data.status, data._id)
      
      })
    } else if (res.status === 202) {
      $("#load_users").attr("disabled", true);
    }
  }).catch((error) => {
    console.log(error)
  })
}

function requestSearchUsers(i, data) {
  const request = new Request('/api/users/username/' + i, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
  })

  fetch(request).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        display_users_DOM(data.username, data.email, data.status, data._id)
      
      })
    } else if (res.status === 202) {
      $("#load_users").attr("disabled", true);  
    }
  }).catch((error) => {
    console.log(error)
  })
}

function display_comments(){
  commentsList.innerHTML = ''
  for (let i = 0; i < 10; i++) {
    requestComment(comment_index);
    comment_index ++;
  }
}



function display_movies(){
  moviesList.innerHTML = ''
  for (let i = 0; i < 10; i++) {
    requestMovies(movie_index);
    movie_index ++;
  }
}



function display_users(){
  
  usersList.innerHTML = ''
  for (let i = 0; i < 10; i++) {
    requestUsers(user_index);
    user_index ++;
  }

}



function display_aritcles(){
  unreviewedList.innerHTML = '<h1>Articles waiting for approval</h1>'
  reviewedList.innerHTML = '<h1>Approved Articles</h1>'
  for (let i = 0; i <= 5; i++) {
    requestUnreviewedArticle(unreviewed_article_index);
    unreviewed_article_index = unreviewed_article_index + 1
    requestReviewedArticle(reviewed_article_index);
    reviewed_article_index = reviewed_article_index + 1
  }
}

/** DOM functions **/

function display_aritcles_DOM(status, artitle, username, motitle, movieId, text, _id){
  if (Number(status) == 0) {
    const div1 = document.createElement('div')
    div1.className = 'storyCard mdl-card mdl-shadow--2dp'
    const div2 = document.createElement('div')
    div2.className = 'mdl-card__title'
    const h2 = document.createElement('h2')
    h2.className = 'mdl-card__title-text black index_text'
    h2.innerHTML = `${artitle}`
    div2.appendChild(h2)
    div1.appendChild(div2)
    const div3 = document.createElement('div')
    div3.className = 'mdl-card__supporting-text'
    div3.innerHTML = `by <span class="yellow index_text">${username}</span>  wrote for <span class="yellow index_text">${motitle}</span> with ID <span class="yellow index_text">${movieId}</span>`
    div1.appendChild(div3)
    const div4 = document.createElement('div')
    div4.className = 'mdl-card__supporting-text general_text'
    div4.innerHTML = `${text}`
    div1.appendChild(div4)
    const div5 = document.createElement('div')
    div5.className = 'mdl-card__actions mdl-card--border'
    const a = document.createElement('a')
    a.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect'
    a.href = `/article/${_id}`
    a.innerHTML = `Read more`
    div5.appendChild(a)
    const btn1 = document.createElement('button')
    btn1.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect approve'
    btn1.setAttribute("data", `${_id}`)
    btn1.innerHTML = `Approve`
    div5.appendChild(btn1)
    const btn2 = document.createElement('button')
    btn2.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect reject'
    btn2.setAttribute("data", `${_id}`)
    btn2.innerHTML = `Reject`
    div5.appendChild(btn2)
    div1.appendChild(div5)
    componentHandler.upgradeElements(div1);
    componentHandler.upgradeDom();
    componentHandler.upgradeAllRegistered();
    unreviewedList.appendChild(div1)
  }else{
    $("#reviewed_articles").append(`<div class="storyCard mdl-card mdl-shadow--2dp">`+
                                      `<div class="mdl-card__title">` +
                                        `<h2 class="mdl-card__title-text black index_text">${artitle}</h2>` +
                                      `</div>` +
                                      `<div class="mdl-card__supporting-text">` + 
                                        `by <span class="yellow index_text">${username}</span>  wrote for <span class="yellow index_text">${motitle}</span> with ID <span class="yellow index_text">${movieId}</span>` + 
                                      `</div>` + 
                                      `<div class="mdl-card__supporting-text general_text">` + 
                                        `${text}` + 
                                      `</div>` + 
                                      `<div class="mdl-card__actions mdl-card--border">` + 
                                        `<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="/article/${_id}">` +
                                          `Read more` + 
                                        `</a>` + 
                                        `<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect delete" data = "${_id}">` + 
                                          `Delete` + 
                                        `</button>` + 
                                      `</div>` +
                                    `</div>`
                                    )

  }
  RefreshSomeEventListener();
}

function display_comments_DOM(username, movieId, title, text, _id){
  const tr = document.createElement('tr')
  const td1 = document.createElement('td')
  td1.className = 'mdl-data-table__cell--non-numeric'
  td1.innerHTML = `${username}`
  tr.appendChild(td1)
  const td0 = document.createElement('td')
  td0.className = 'mdl-data-table__cell--non-numeric'
  td0.innerHTML = `${movieId}`
  tr.appendChild(td0)
  const td2 = document.createElement('td')
  td2.className = 'mdl-data-table__cell--non-numeric'
  td2.innerHTML = `${title}`
  tr.appendChild(td2)
  const td3 = document.createElement('td')
  td3.className = 'mdl-data-table__cell--non-numeric'
  td3.innerHTML = `${text}`
  tr.appendChild(td3)
  const td4 = document.createElement('td')
  td4.className = 'mdl-data-table__cell--non-numeric'
  const btn = document.createElement('button')
  btn.className = 'mdl-button mdl-js-button mdl-button--primary delete'
  btn.innerHTML = `Delete`
  td4.appendChild(btn)
  tr.appendChild(td4)
  btn.id = `${_id}`
  commentsList.appendChild(tr)
}

function display_movies_DOM(id, title, _id){
  const tr = document.createElement('tr')
  const td1 = document.createElement('td')
  td1.className = 'mdl-data-table__cell--non-numeric'
  //a = document.createElement('a')
  //a.href = ""
  td1.innerHTML = `${id}`
  tr.appendChild(td1)
  const td2 = document.createElement('td')
  td2.className = 'mdl-data-table__cell--non-numeric'
  td2.innerHTML = `${title}`
  tr.appendChild(td2)
  const td4 = document.createElement('td')
  td4.className = 'mdl-data-table__cell--non-numeric'
  const btn = document.createElement('button')
  btn.className = 'mdl-button mdl-js-button mdl-button--primary delete'
  btn.innerHTML = `Delete`
  btn.id = `${_id}`
  td4.appendChild(btn)
  tr.appendChild(td4)
  moviesList.appendChild(tr)
}

function display_users_DOM(username, email, status, id){
  if (status != 3) {
    const tr = document.createElement('tr')
    const td1 = document.createElement('td')
    td1.className = 'mdl-data-table__cell--non-numeric'
    td1.innerHTML = `${username}`
    tr.appendChild(td1)
    const td2 = document.createElement('td')
    td2.className = 'mdl-data-table__cell--non-numeric'
    td2.innerHTML = `${email}`
    tr.appendChild(td2)
    const td3 = document.createElement('td')
    td3.className = 'mdl-data-table__cell--non-numeric'
    if (Number(status) == 1) {
      td3.innerHTML = `Sour User`
    }else{
      td3.innerHTML = `Sour Pro`
      td3.className = 'mdl-data-table__cell--non-numeric yellow'
    }
    tr.appendChild(td3)
    const td4 = document.createElement('td')
    td4.className = 'mdl-data-table__cell--non-numeric'
    const btn = document.createElement('button')
    btn.className = 'mdl-button mdl-js-button mdl-button--primary delete'
    btn.innerHTML = `Delete`
    btn.id = `${id}`
    td4.appendChild(btn)
    const btn1 = document.createElement('button')
    btn1.className = 'mdl-button mdl-js-button mdl-button--primary changeStatus'
    if (Number(status) == 1) {
      btn1.innerHTML = `Promote`
    }else{
      btn1.innerHTML = `Demote`
    }
    btn1.setAttribute("data", `${id}`);
    td4.appendChild(btn1)
    tr.appendChild(td4)
    usersList.appendChild(tr)
  }
}