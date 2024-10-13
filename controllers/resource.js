const { Op } = require("sequelize");

const User = require("../models/user");
const Resource = require("../models/resource");

exports.uploadResource = async(req, res, next) => {
    const { userId, fileName } = req.body;
    try{
        const pdfUrl = req.cloudinary_url;

        const resource = {
            userId,
            fileName,
            filePath: pdfUrl
        };

        const response = await Resource.create(resource)

        if (response) {
            res.send({ message: "Resource created successfully.", fileDetails:  response}).status(200);
          } else {
            res.send({ message: "Resource couldn't be created." }).status(400);
          }
        
    }catch(err){
        console.error(err)
    }
}

exports.getAllResources = async (req, res, next) => {
    const { userId } = req.params; // Assuming userId is passed as a route parameter
    try {
        // Fetch resources that do not belong to the userId
        const resources = await Resource.findAll({
            where: {
                userId: {
                    [Op.ne]: userId // Op.ne is Sequelize's way to say 'not equal'
                }
            },
            include: [
                {
                    model: User,
                    attributes: ['fullname'], // Specify the fields you want from the User model
                }
            ],
        });

        return res.status(200).send(resources);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "An error occurred while fetching resources." });
    }
}

exports.deleteResource = async (req, res) => {
    const id = req.params.resourceId;
    await Resource.destroy({
      where: {
        id: id,
      },
    })
    .then((result) =>
      res.send({ message: "Resource deleted successfully!" }).status(200)
    )
    .catch((err) =>
      res.send({ message: "Resource couldn't be deleted!" }).status(404)
    );
};