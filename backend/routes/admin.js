const express = require('express');
const router = express.Router();
const {
  getDashboard, getAllIssues, updateIssueStatus, assignIssue,
  getUsers, createOfficer, getDepartments, createDepartment, toggleUserStatus,
} = require('../controllers/adminController');
const { protect, adminOnly, officerOrAdmin } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', officerOrAdmin, getDashboard);
router.get('/issues', officerOrAdmin, getAllIssues);
router.put('/issues/:id/status', officerOrAdmin, updateIssueStatus);
router.put('/issues/:id/assign', adminOnly, assignIssue);

router.get('/users', adminOnly, getUsers);
router.post('/users/officer', adminOnly, createOfficer);
router.put('/users/:id/toggle', adminOnly, toggleUserStatus);

router.get('/departments', officerOrAdmin, getDepartments);
router.post('/departments', adminOnly, createDepartment);

module.exports = router;
