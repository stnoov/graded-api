const controller = require("../controllers/postings.controller");

module.exports = function (app) {
    app.post(
        "/api/postings/add_posting",
        controller.add_posting
    )
}