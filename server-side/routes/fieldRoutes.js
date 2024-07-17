const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { addField, updateField, listFields, getField } = require('../controllers/fieldController');
const { addFieldLog, deleteFieldLog, updateFieldLog, listFieldLogs } = require('../controllers/fieldLogController');
// const auth = require();

// add field
router.post('/add_field', auth, addField);

// update field
router.put('/update_field/:fieldId', updateField);

// list fields
router.get('/list_fields', auth, listFields);

// Add a field log
router.post('/:fieldId/fieldlogs', addFieldLog);

// Delete a field log
router.delete('/:fieldId/fieldlogs/:logId', deleteFieldLog);

// Update a field log
router.put('/:fieldId/fieldlogs/:logId', updateFieldLog);

// List all field logs for a field
router.get('/:fieldId/fieldlogs', listFieldLogs);

// Route to get a specific field by ID
router.get('/:fieldId', getField);

module.exports = router;