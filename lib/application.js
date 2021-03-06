const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const httpMethodPolyfill = (req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method
    delete req.body._method
    return method
  }
}

module.exports = ({
  bootstap: () => {
    const app = express()

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use(methodOverride(httpMethodPolyfill))

    app.set('view engine', 'pug')
    app.set('views', 'app/views')

    app.use(express.static('node_modules'))
    app.use(express.static('app'))

    return app
  },

  run: (app, store, options = {}) => {
    const viewRoutes = (req, res) => {
      res.render(req.path.slice(1), store)
    }

    const config = Object.assign({ port: 3000 }, options)

    app.get('/', function (req, res) {
      res.render('index')
    })

    app.get('/*', viewRoutes)

    app.use(function (err, req, res, next) {
      if (err.message === 'Cannot find module \'ico\'') return next()

      console.error(err.stack)
    })

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

    return server
  }
})
