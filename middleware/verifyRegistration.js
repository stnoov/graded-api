const db = require("../models");
const User = db.users;

checkDuplicates = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }}).then(user => {
            if (user) {
                res.status(400).send({
                    message: "Failed! Email is already in use!"
                })
                return
            }
        next();
    })
}

module.exports = checkDuplicates;