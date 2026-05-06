const express = require('express');
const router = express.Router();
const {
  createIssue, getIssues, getMyIssues, getIssueById,
  getByTicketId, upvoteIssue, addComment, submitFeedback, getMetrics,
} = require('../controllers/issueController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/metrics', getMetrics);
router.get('/ticket/:ticketId', getByTicketId);
router.get('/', getIssues);
router.get('/my', protect, getMyIssues);
router.get('/:id', getIssueById);
router.post('/', protect, upload.array('images', 4), createIssue);
router.post('/:id/upvote', protect, upvoteIssue);
router.post('/:id/comment', protect, addComment);
router.post('/:id/feedback', protect, submitFeedback);

module.exports = router;
