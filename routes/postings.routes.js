const controller = require("../controllers/postings.controller");

module.exports = function (app) {
    app.post(
        "/api/postings/add_posting",
        controller.add_posting
    )
    app.post(
        "/api/postings/delete_posting",
        controller.delete_posting
    )
}