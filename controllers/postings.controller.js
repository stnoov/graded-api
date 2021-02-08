const db = require("../models");
const User = db.users;
const Posting = db.postings;

exports.add_posting = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        Posting.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            images: req.body.images,
            price: req.body.price,
            delivery_type: req.body.delivery_type,
            userId: user.id
        }).then(
            res.send({message: "Posting was created"})
        ).catch(err => {
            res.status(500).send({message: err.message});
        });
    })

}