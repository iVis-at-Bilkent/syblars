const {port, app} = require('./index.js');

module.exports = app.listen(process.env.PORT, () => {
    console.log("Listening on " + port);
});