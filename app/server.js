const setup = require('../lib/setup')
const seeds = require('./seeds')
const store = require('../lib/store')(seeds)

const app = setup(store, { port: 3000 })

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

app.post('/creatures', (req, res) => {
  store.creatures.push({ name: req.body.name, power: req.body.power })
  res.redirect('/creatures')
})
