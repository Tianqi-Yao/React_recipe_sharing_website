const recepieRoutes = require('./receipe');
const userRoutes = require('./users');
const todoRoutes = require('./todos');
const likesRoutes = require('./likes');

const constructorMethod = (app) => {
  app.use('/receipe', recepieRoutes);
  app.use('/users', userRoutes);
  app.use('/todos', todoRoutes);
  app.use('/likes', likesRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not Found' });
  });
};

module.exports = constructorMethod;