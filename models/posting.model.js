module.exports = (sequelize, DataTypes) => {
    const Posting = sequelize.define("postings", {
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        category: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING
        },
        images: {
            type: DataTypes.BLOB
        },
        price: {
            type: DataTypes.STRING
        },
        delivery_type: {
            type: DataTypes.STRING
        }
    });

    return Posting;
};