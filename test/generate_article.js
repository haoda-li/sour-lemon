const {
  Article
} = require('../models/article');
const {
  User
} = require('../models/user');
const {
  Movie
} = require('../models/movie');
const { mongoose } = require('../db/mongoose')

const user = "5ca52a063eff8929c003e657"

const text = "<p>BY MOCK8 <b>SPIEGEL:</b> And is it in place now? </p><p><b>Assange:</b> Yes, a few months back we launched a next-generation submission system and also integrated it with our publications.</p><p><b>SPIEGEL:</b> So we can expect new publications? </p><p><b>Assange:</b> We are drowning in material now. Economically, the challenge for WikiLeaks is whether we can scale up our income in proportion to the amount of material we have to process. </p><p><b>SPIEGEL:</b> Nine years ago, when WikiLeaks was founded, you could read on its website: The goal is justice. The method is transparency. This is the old idea of Enlightenment born in the 18th century. But if you look at brutal political regimes and ruthless big corporations, isn't that slogan too idealistic? Is transparency enough?</p>"

Movie.find({}, "id").then((movies) => {
  movies.forEach((m) => {
    let status = 1
    if (Math.random() < 0.01) {
      status = 0
    }
    const article = new Article({
      status: status,
      like: Math.floor(Math.random() * 100),
      userId: user,
      username: "mockpro8",
      text: text,
      movieId: m.id,
      title: "A Good Movie"
    })

    article.save().then((a) => {
      console.log(a)
    }, (error) => {
      console.log(error)
    })
  })
}, (error) => {
  console.log(error)
})
