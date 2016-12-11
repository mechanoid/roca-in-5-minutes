const application = require('../lib/application')
const seeds = require('./seeds')
const store = require('../lib/store')(seeds)

const app = application.bootstap()

// ***********************************************************************
// Default View Rendering
// ***********************************************************************

// all views below views are registered as GETable views,
// so the example pages `creatures.pug` and `creatures/new.pug`
// are browsable by calling /creatures or /creatures/new

// ***********************************************************************
// Add your own express routes below
//
// add post, put or delete routes to manipulate the store,
// as shown in the example route for creatures.
// ***********************************************************************

const hasSameName = (instance, name) =>
  instance.name.toLocaleLowerCase() === name.toLocaleLowerCase()

app.post('/creatures', (req, res) => {
  store.creatures.push({ name: req.body.name, power: req.body.power })
  res.redirect('/creatures')
})

app.get('/creatures/:name', (req, res) => {
  const creature = store.creatures.find(c => hasSameName(c, req.params.name))

  if (creature) {
    return res.render('creatures/edit', { creature })
  }

  res.render('404')
})

app.post('/creatures/:name', (req, res) => {
  const index = store.creatures.findIndex(c => hasSameName(c, req.params.name))

  if (index >= 0) {
    const { name, power } = req.body

    const newCreature = Object.assign({}, store.creatures[index], { name, power })

    store.creatures[index] = newCreature

    return res.redirect('/creatures')
  }

  res.render('400')
})

// ***********************************************************************
// Basic application setup, which binds the dynamic view routes and tries
// to start the server on the provided default port.
// ***********************************************************************

application.run(app, store, { port: 3000 })
