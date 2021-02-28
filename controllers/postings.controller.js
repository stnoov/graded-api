const db = require("../models");
const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const {cloudinary} = require('../middleware/cloudinary')
const User = db.users;
const Posting = db.postings;


exports.add_posting = async (req, res) => {
    let token = req.headers["x-access-token"]
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
    });
    const imageToUpload = req.body.images
    try {
        const uploadedResponse = await cloudinary.uploader.upload("data:image/png;base64," + imageToUpload, {
            upload_preset: 'dev_setups'
        });
        Posting.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            images: uploadedResponse.url,
            price: req.body.price,
            delivery_type: req.body.delivery_type,
            userId: req.userId
        }).catch((e) => console.log(e))
    } catch (error) {
        console.log(error)
    }

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
    let token = req.headers["x-access-token"]
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
    });
    Posting.findOne({
        where: {
            id: req.body.id
        }
    }).then(post => {
            if (post.userId === req.userId) {
                post.destroy()
                res.send({message: "Your posting was deleted"})
            } else {
                res.send({message: "You do not have permissions to delete this posting"})
            }
        }
)
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
                res.send({message: "Your posting was updated"})
            } else {
                res.send({message: "You do not have permissions to edit this posting"})
            }
        })
    })
}

exports.get_postings = (req, res) => {
    Posting.findAll({include: [{model: User, as: "seller", attributes: ['name', 'email']}]})
        .then(postings => {
            res.send({message: postings})
        })
}

exports.get_users_postings = (req, res) => {
    let token = req.headers["x-access-token"]
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
    });
    Posting.findAll({
        include: [{model: User, as: "seller", attributes: ['name', 'email']}],
        where: {userId: req.userId}
    })
        .then(postings => {
            res.send({message: postings})
        })
}


exports.get_sorted_postings = (req, res) => {
    let whereStatement = {}
    if (req.body.location === 'Finland' && req.body.category === 'All') {
        whereStatement = {}
    } else if (req.body.location !== 'Finland' && req.body.category === 'All') {
        whereStatement = {
            location: req.body.location
        }
    } else if (req.body.location === 'Finland' && req.body.category !== 'All') {
        whereStatement = {
            category: req.body.category
        }
    } else if (req.body.location !== 'Finland' && req.body.category !== 'All') {
        whereStatement = {
            location: req.body.location,
            category: req.body.category
        }
    }
    Posting.findAll({include: [{model: User, as: "seller", attributes: ['name', 'email']}], where: whereStatement})
        .then(postings => {
            res.send({message: postings})
        })
    console.log(req.body)
}
