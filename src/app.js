const {port, app} = require('./index.js');

module.exports = app.listen(port, () => {
    console.log("Listening on " + port);
});