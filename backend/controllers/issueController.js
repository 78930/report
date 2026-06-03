const Issue = require('../models/Issue');
const Department = require('../models/Department');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/upload');

// Category → Department mapping
const categoryDeptMap = {
  road: 'PWD',
  water: 'WATER',
  drainage: 'DRAINAGE',
  electricity: 'BESCOM',
  garbage: 'BBMP',
  streetlight: 'BESCOM',
  other: 'GENERAL',
};

// @POST /api/issues - Create issue
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, priority, locationAddress, ward, landmark, latitude, longitude } = req.body;

    // Upload images to Cloudinary
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((f) => uploadToCloudinary(f.buffer, 'public-report/issues'));
      images = await Promise.all(uploadPromises);
    }

    // Auto-find department
    const deptCode = categoryDeptMap[category] || 'GENERAL';
    const department = await Department.findOne({ code: deptCode });

    const issue = await Issue.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      images,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0],
        address: locationAddress,
        ward,
        landmark,
      },
      reportedBy: req.user._id,
      department: department?._id,
    });

    await issue.populate('reportedBy', 'name phone');
    await issue.populate('department', 'name code');

    res.status(201).json({ success: true, message: 'Issue reported successfully', issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/issues - Public feed with filters
exports.getIssues = async (req, res) => {
  try {
    const {
      category, status, ward, page = 1, limit = 20,
      lat, lng, radius = 5000, // meters
      sortBy = 'createdAt', order = 'desc',
    } = req.query;

    const query = { isPublic: true };
    if (category) query.category = category;
    if (status) query.status = status;
    if (ward) query['location.ward'] = new RegExp(ward, 'i');

    // Geospatial query
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius),
        },
      };
    }

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('reportedBy', 'name ward')
      .populate('department', 'name code')
      .populate('assignedTo', 'name')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      count: issues.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      issues,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/issues/my - User's own issues
exports.getMyIssues = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { reportedBy: req.user._id };
    if (status) query.status = status;

    const issues = await Issue.find(query)
      .populate('department', 'name code')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Issue.countDocuments(query);
    res.json({ success: true, issues, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/issues/:id - Single issue
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name phone ward')
      .populate('department', 'name code contactEmail contactPhone')
      .populate('assignedTo', 'name phone')
      .populate('comments.user', 'name role');

    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

    res.json({ success: true, issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/issues/ticket/:ticketId - Find by ticket ID
exports.getByTicketId = async (req, res) => {
  try {
    const issue = await Issue.findOne({ ticketId: req.params.ticketId.toUpperCase() })
      .populate('reportedBy', 'name')
      .populate('department', 'name code')
      .populate('assignedTo', 'name');

    if (!issue) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/issues/:id/upvote
exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

    const userId = req.user._id;
    const alreadyUpvoted = issue.upvotes.includes(userId);

    if (alreadyUpvoted) {
      issue.upvotes.pull(userId);
      issue.upvoteCount = Math.max(0, issue.upvoteCount - 1);
    } else {
      issue.upvotes.push(userId);
      issue.upvoteCount += 1;

      // Auto-escalate if 50+ upvotes
      if (issue.upvoteCount >= 50 && issue.escalationLevel === 0) {
        issue.escalationLevel = 1;
        issue.escalatedAt = new Date();
      }
    }

    await issue.save();
    res.json({ success: true, upvoted: !alreadyUpvoted, upvoteCount: issue.upvoteCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/issues/:id/comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

    issue.comments.push({
      user: req.user._id,
      text,
      isOfficialResponse: ['admin', 'department_officer'].includes(req.user.role),
    });
    await issue.save();
    await issue.populate('comments.user', 'name role');
    res.json({ success: true, comments: issue.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/issues/:id/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const issue = await Issue.findOne({ _id: req.params.id, reportedBy: req.user._id });
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });
    if (issue.status !== 'resolved') return res.status(400).json({ success: false, message: 'Can only rate resolved issues' });

    issue.feedback = { rating, comment, submittedAt: new Date() };
    await issue.save();
    res.json({ success: true, message: 'Feedback submitted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/issues/metrics - Public metrics
exports.getMetrics = async (req, res) => {
  try {
    const [statusCounts, categoryCounts, recentResolved] = await Promise.all([
      Issue.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Issue.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Issue.countDocuments({ status: 'resolved', resolvedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
    ]);

    const metrics = {
      byStatus: statusCounts.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      byCategory: categoryCounts.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
      resolvedLast30Days: recentResolved,
      total: await Issue.countDocuments(),
    };

    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
