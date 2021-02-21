const db = require("../models");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const User = db.users;
const Posting = db.postings;


exports.add_posting = (req, res) => {
    if (!req.body.token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(req.body.token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        Posting.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            images: req.body.images,
            price: req.body.price,
            delivery_type: req.body.delivery_type,
            userId: decoded.id
        }).then(
            res.send({message: "Posting was created"})
        ).catch(err => {
            res.status(500).send({message: err.message});
        });
    });
}

// exports.add_posting = (req, res) => {
//     User.findOne({
//         where: {
//             email: req.body.email
//         }
//     }).then(user => {
//         Posting.create({
//             title: req.body.title,
//             description: req.body.description,
//             category: req.body.category,
//             location: req.body.location,
//             images: req.body.images,
//             price: req.body.price,
//             delivery_type: req.body.delivery_type,
//             userId: user.id
//         }).then(
//             res.send({message: "Posting was created"})
//         ).catch(err => {
//             res.status(500).send({message: err.message});
//         });
//     })
// }

exports.delete_posting = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        Posting.findOne({
            where: {
                id: req.body.id
            }
        }).then(post => {
            if (post.userId === user.id) {
                post.destroy()
                res.send({message: "Your posting was deleted"})
            } else {
                res.send({message: "You do not have permissions to delete this posting"})
            }
            }
        )
    })
}

exports.edit_posting = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        Posting.findOne({
            where: {
                id: req.body.id
            }
        }).then(post => {
            if (post.userId === user.id) {
                post.update({
                    title: req.body.title,
                    description: req.body.description,
                    category: req.body.category,
                    location: req.body.location,
                    images: req.body.images,
                    price: req.body.price,
                    delivery_type: req.body.delivery_type
                })
                res.send({message: "Your posting was update"})
            } else {
                res.send({message: "You do not have permissions to edit this posting"})
            }
        })
    })
}

exports.get_postings = (req, res) => {
    Posting.findAll({attributes: ['title', 'description', 'price', 'location'], include: [{model: User, as: "seller", attributes: ['name', 'email']}]})
        .then(postings => {
            res.send({message: postings})
        })
}
