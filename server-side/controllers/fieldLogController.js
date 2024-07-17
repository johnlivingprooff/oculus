const Field = require('../models/Field');

/**
 * @description Add a field log to a field
 * @route POST /api/v1/fields/:fieldId/fieldlogs
 * @access private
 */
const addFieldLog = async (req, res) => {
    const { title, description } = req.body;
    const { fieldId } = req.params;

    try {
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        const newLog = {
            title,
            description,
        };

        console.log(newLog);

        field.fieldLog.push(newLog);
        await field.save();

        res.status(201).json({ message: 'Field log added successfully', field });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

/**
 * @description Delete a field log from a field
 * @route DELETE /api/v1/fields/:fieldId/fieldlogs/:logId
 * @access private
 */
const deleteFieldLog = async (req, res) => {
    const { fieldId, logId } = req.params;

    try {
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        // console.log(field.fieldLog.id(logId));

        field.fieldLog.id(logId).remove();
        await field.save();


        res.status(200).json({ message: 'Field log deleted successfully', field });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

/**
 * @description Update a field log in a field
 * @route PUT /api/v1/fields/:fieldId/fieldlogs/:logId
 * @access private
 */
const updateFieldLog = async (req, res) => {
    const { fieldId, logId } = req.params;
    const { title, description } = req.body;

    try {
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        const log = field.fieldLog.id(logId);
        if (!log) {
            return res.status(404).json({ message: 'Field log not found' });
        }

        log.title = title || log.title;
        log.description = description || log.description;
        log.updatedAt = Date.now();

        await field.save();
        console.log(field.fieldLog.id(logId).updatedAt);

        res.status(200).json({ message: 'Field log updated successfully', field });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

/**
 * @description List all field logs for a field
 * @route GET /api/v1/fields/:fieldId/fieldlogs
 * @access private
 */
const listFieldLogs = async (req, res) => {
    const { fieldId } = req.params;

    try {
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        res.status(200).json(field.fieldLog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

module.exports = {
    addFieldLog,
    deleteFieldLog,
    updateFieldLog,
    listFieldLogs
};
