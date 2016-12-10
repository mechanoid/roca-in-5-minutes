const express = require('express')
const bodyParser = require('body-parser')

module.exports = (store, options = { }) => {
  const viewRoutes = (req, res) => {
    res.render(req.path.slice(1), store)
  }

  const config = Object.assign({ port: 3000 }, options)

  const app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.set('view engine', 'pug')
  app.set('views', 'app/views')

  app.get('/', function (req, res) {
    res.render('index')
  })

  app.use(express.static('node_modules'))
  app.get('/*', viewRoutes)

  const server = app.listen(config.port)

  server.addListener('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.warn(`${config.port} is already in use. Trying another port.`)
      setTimeout(() => server.listen(0), 1000)
    } else {
      console.error(e.toString().red)
      server.close()
    }
  })

  server.addListener('listening', () => {
    var address = server.address()
    console.log(`listening to port ${address.port}`)
  })

  return app
}
