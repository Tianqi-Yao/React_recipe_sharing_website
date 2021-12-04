const recepieRoutes = require('./receipe');

const constructorMethod = (app) => {
  app.use('/receipe', recepieRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not Found' });
  });
};

module.exports = constructorMethod;