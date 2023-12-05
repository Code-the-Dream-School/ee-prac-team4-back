const Resource = require('../models/Resources')
const { StatusCodes } = require('http-status-codes');
const { title } = require('process');

const getAllResources = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const offset = (page - 1) * limit;
        const totalResources = await Resource.countDocuments({});
        const Resources = await Resource.find({})
            .sort('createdAt')
            .skip(offset)
            .limit(limit);

            res.status(StatusCodes.OK).json({ 
                Resources, 
                currentPage: page,
                totalPages: Math.ceil(totalResources / limit),
                totalItems: totalResources, 
            });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error' })
    }
};

const getUserResources = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const offset = (page - 1) * limit;
        const totalResources = await Resource.countDocuments({ createdBy: req.user.userId });
        const Resources = await Resource.find({ createdBy: req.user.userId })
            .sort('createdAt')
            .skip(offset)
            .limit(limit);

            res.status(StatusCodes.OK).json({ 
                Resources, 
                currentPage: page,
                totalPages: Math.ceil(totalResources / limit),
                totalItems: totalResources, 
            });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error' })
    }
};

const getResources = async (req, res) => {
    const { 
        user: { userId }, 
        params: { id: ResourcesId } 
    } = req;

    try {
        const resource = await Resource.findOne({
            _id: ResourcesId, createdBy: userId
        });
    
        if (!resource) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: `No Resources with id ${ResourcesId}` });
        }
    
        res.status(StatusCodes.OK).json({ resource });
        
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
    
};

const createResources = async (req, res) => {

    req.body.createdBy = req.user.userId;
    const Resources = await Resource.create(req.body);
    res.status(StatusCodes.CREATED).json({ Resources });
};

const updateResources = async (req, res) => {
    const {
        body: { title, topic, subtopic, type, link, createdBy },
        user: { userId },
        params: { id: ResourcesId }
    } = req;

    const updatedFields = {};

    if (title != undefined) {
        updatedFields.title = title;
    }

    if (topic != undefined) {
        updatedFields.topic = topic;
    }

    if (subtopic != undefined) {
        updatedFields.subtopic = subtopic;
    }

    if(type != undefined) {
        updatedFields.type = type;
    }

    if(link != undefined) {
        updatedFields.link = link;
    }

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ msg: 'No fields to update' });
    }

    const Resources = await Resource.findByIdAndUpdate(
        { _id: ResourcesId, createdBy: userId },
        { $set: updatedFields },
        { new: true, runValidators: true }
    )

    if (!Resources) {
        return res.status(400).json({ msg: `No Resources with id ${ResourcesId}` });
    }

    res.status(StatusCodes.OK).json({ Resources });
}

const deleteResources = async (req, res) => {
    const {
        user: { userId },
        params: { id: ResourcesId }
    } = req;

    const Resource = await Resource.findOneAndDelete(
        { _id: ResourcesId, createdBy: userId }
    );

    if(!Resource) {
        return res.status(400).json({ msg: `No Resources with id ${ResourcesId}` });
    }

    res.status(StatusCodes.OK).json({ msg: "Resources deleted" })
};

module.exports = {
    getAllResources,
    getUserResources,
    getResources,
    createResources,
    updateResources,
    deleteResources
}