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
    app.post(
        "/api/postings/edit_posting",
        controller.edit_posting
    )
    app.get(
        "/api/postings/get_postings",
        controller.get_postings
    )
}