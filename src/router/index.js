module.exports = (app) => {
    app.use('/line', require('./routes/line'));
    app.use('/auth', require('./routes/auth'));
};
