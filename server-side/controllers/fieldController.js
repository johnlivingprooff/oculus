const Field = require('../models/Field');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * @description Add a new field to user
 * @route - POST /api/v1/add_field
 * @access - private(user)
 */
const addField = async (req, res) => {
    try {
        const { fieldName, fieldSize, fieldLocation, crop, fieldLog } = req.body;
        const userId = req.user.id; // using auth middleware to get user id

        console.log(userId);

        // find user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(user);

        // check that user already has 10 fields
        const fieldCount = await Field.countDocuments({ userId: user._id});
        if (fieldCount >= 10) {
            return res.status(400).json({ message: 'You can only add up to 10 fields.' });
        }

        // create new field
        const field = new Field({
            fieldName,
            fieldSize,
            fieldLocation,
            crop,
            fieldLog,
            userId: user._id
        });

        // save field to database
        await field.save();

        // add field id to user's fields array
        user.fields.push(field._id);
        await user.save();

        console.log(user.fields);

        res.status(201).json({ msg: 'Field added successfully', field });
    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error });
    }
}

/**
 * description - update a field
 * route - PUT /api/v1/update_field/:fieldId
 * access - private(user)
 */
const updateField = async (req, res) => {
    const { fieldId } = req.params;
    const { fieldName, fieldSize, fieldLocation, crop, fieldLog } = req.body;

    try {
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        field.fieldName = fieldName || field.fieldName;
        field.fieldSize = fieldSize || field.fieldSize;
        field.fieldLocation = fieldLocation || field.fieldLocation;
        field.crop = crop || field.crop;
        field.fieldLog = fieldLog || field.fieldLog;

        await field.save();

        res.status(200).json({ message: 'Field updated successfully', field });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

/**
 * description - list all fields
 * route - GET /api/v1/list_fields
 * access - private(user)
 */
const listFields = async (req, res) => {
    const userId = req.user.id; // using auth middleware to get user id
    console.log(userId);
    try {
        const fields = await Field.find({ userId });
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
};

/**
 * @description Get a specific field by ID
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @returns {Object} - response object
 * @memberof FieldController
 * route - GET /api/v1/fields/:fieldId
 * access - private(user)
 */
const getField = async (req, res) => {
    const { fieldId } = req.params; // Extract fieldId from request parameters

    try {
        // Find the field by its ID
        const field = await Field.findById(fieldId);

        if (!field) { // If the field is not found, send a 404 response
            return res.status(404).json({ message: 'Field not found' });
        }

        // Send a 200 response with the field data
        res.status(200).json(field);
    } catch (error) {
        // If there's an error, send a 500 response with an error message
        res.status(500).json({ message: 'Server Error', error });
    }
};

module.exports = { addField, updateField, listFields, getField };
