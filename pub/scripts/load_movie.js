/**---Load the movie information based on TMDB API---**/
const api = ""
const movie_id = $("#mid").html()

// All the API calls
class Setting {
  constructor(api_code) {
    this.asynv = true;
    this.crossDomain = true;
    this.method = "GET";
    this.headers = {};
    this.data = "{}";
    this.url = "https://api.themoviedb.org/3/movie/" + movie_id + api_code
  }
}

function createCast(r) {
  let director = false;
  let dphoto = false;
  let producer = false;
  const info_array = [];
  let index = 0;
  while ((director == false || dphoto == false || producer == false) && (index < r.crew.length)) {
    if (r.crew[index].job == "Director" && !director) {
      director = true
      info_array.push([r.crew[index].name, "Director", r.crew[index].profile_path])
    } else if (r.crew[index].job == "Director of Photography" && !dphoto) {
      dphoto = true
      info_array.push([r.crew[index].name, "D. P.", r.crew[index].profile_path])
    } else if (r.crew[index].job == "Producer" && !producer) {
      producer = true
      info_array.push([r.crew[index].name, "Producer", r.crew[index].profile_path])
    }
    index++
  }

  let crew_num = info_array.length;

  for (let i = 0; i < Math.min(5, r.cast.length); i++) {
    info_array.push([r.cast[i].name, r.cast[i].character, r.cast[i].profile_path])
  }

  if (info_array.length == 0) {
    $("#cast_info").append("<p class=\"general_text\">Missing information</p>")
  }
  for (let i = 0; i < info_array.length; i++) {
    if (crew_num == i) {
      $("#cast_info").append("<p></p>")
    }
    let card = $("<div class=\"cast_card mdl-card mdl-shadow--2dp\"></div>")
    let profile_card = $("<div class=\"mdl-card__title mdl-card--expand\"></div>")
    if (info_array[i][2] != null) {
      let profile_link = "http://image.tmdb.org/t/p/w185/" + info_array[i][2]
      profile_card.css("background-image", "url(" + profile_link + ")")
    } else {
      profile_card.css("background-image", "url(\"/pub/assets/logo.png\")")
    }
    let job_card = $("<div class=\"mdl-card__supporting-text\">" + info_array[i][1] + "</div>")
    let name_space = $("<br><span class=\"yellow general_text\"></span>").text(info_array[i][0])
    job_card.append(name_space);
    card.append(profile_card)
    card.append(job_card)
    $("#cast_info").append(card)
  }
}

// load trailer
const settings_trailer = new Setting("/videos?language=en-US&api_key="+api)
$.ajax(settings_trailer).done(function(response) {
  let link = "https://www.youtube.com/embed/";
  for (let i = 0; i < response.results.length; i++) {
    if (response.results[i].site == "YouTube") {
      link += response.results[i].key;
      $("#youtube_video").attr("src", link);
      break;
    }
  }
});

// load info
const settings_info = new Setting("?language=en-US&api_key="+api)
$.ajax(settings_info).done(function(response) {
  $("#main_back").css("background-image", "url(\"http://image.tmdb.org/t/p/w780/" + response.poster_path + "\")")
  $("#poster").attr("src", "http://image.tmdb.org/t/p/w780/" + response.poster_path)
  const information = ["title", "release_date", "overview", "status", "runtime", "budget", "revenue"]
  for (let i = 0; i < information.length; i++) {
    if (response[information[i]] != null) {
      $("#" + information[i]).text(response[information[i]])
    }
  }
  $("#homepage").attr("href", response.homepage)
  if (response.homepage != null) {
    $("#homepage").text("View Homepage")
  }
  document.title = "Sour lemon - " + response.title
  const info_list = ["spoken_languages", "genres", "production_companies", "production_countries"]
  for (let i = 0; i < info_list.length; i++) {
    let str = ""
    for (let j = 0; j < response[info_list[i]].length; j++) {
      str += response[info_list[i]][j].name + ", "
    }
    $("#" + info_list[i]).text(str.substring(0, str.length - 2))
  }
});


// load cast
const settings_cast = new Setting("/credits?api_key="+api)
$.ajax(settings_cast).done(function(response) {
  createCast(response)
});
