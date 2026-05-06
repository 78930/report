const Issue = require('../models/Issue');
const User = require('../models/User');
const Department = require('../models/Department');

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [
      totalIssues, openIssues, inProgressIssues, resolvedIssues,
      totalUsers, todayIssues, avgResolutionTime,
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: 'open' }),
      Issue.countDocuments({ status: 'in_progress' }),
      Issue.countDocuments({ status: 'resolved' }),
      User.countDocuments({ role: 'citizen' }),
      Issue.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } }),
      Issue.aggregate([
        { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
        {
          $project: {
            resolutionTime: { $subtract: ['$resolvedAt', '$createdAt'] },
          },
        },
        { $group: { _id: null, avgTime: { $avg: '$resolutionTime' } } },
      ]),
    ]);

    const avgHours = avgResolutionTime[0]
      ? Math.round(avgResolutionTime[0].avgTime / (1000 * 60 * 60))
      : 0;

    // Issues by category last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const categoryTrend = await Issue.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: { _id: { category: '$category', date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } }, count: { $sum: 1 } } },
      { $sort: { '_id.date': 1 } },
    ]);

    // Pending escalations
    const escalations = await Issue.countDocuments({ escalationLevel: { $gt: 0 }, status: { $nin: ['resolved', 'closed'] } });

    res.json({
      success: true,
      stats: {
        totalIssues, openIssues, inProgressIssues, resolvedIssues,
        totalUsers, todayIssues, avgResolutionHours: avgHours, escalations,
        resolutionRate: totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0,
      },
      categoryTrend,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/issues - All issues with admin filters
exports.getAllIssues = async (req, res) => {
  try {
    const {
      category, status, department, ward, priority,
      page = 1, limit = 30, search, escalated,
      from, to,
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (department) query.department = department;
    if (ward) query['location.ward'] = new RegExp(ward, 'i');
    if (priority) query.priority = priority;
    if (escalated === 'true') query.escalationLevel = { $gt: 0 };
    if (search) query.$or = [
      { title: new RegExp(search, 'i') },
      { ticketId: new RegExp(search, 'i') },
    ];
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('reportedBy', 'name phone ward')
      .populate('department', 'name code')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, issues, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/issues/:id/status
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status, note, assignedTo } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue not found' });

    issue.status = status;
    if (assignedTo) issue.assignedTo = assignedTo;

    issue.statusHistory.push({
      status,
      changedBy: req.user._id,
      note,
      changedAt: new Date(),
    });

    if (status === 'resolved') issue.resolvedAt = new Date();
    await issue.save();

    res.json({ success: true, message: 'Status updated', issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/issues/:id/assign
exports.assignIssue = async (req, res) => {
  try {
    const { officerId, departmentId } = req.body;
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedTo: officerId, department: departmentId, status: 'assigned' },
      { new: true }
    ).populate('assignedTo', 'name').populate('department', 'name');
    res.json({ success: true, issue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 30, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/admin/users/officer - Create department officer
exports.createOfficer = async (req, res) => {
  try {
    const { name, phone, email, password, department } = req.body;
    const user = await User.create({ name, phone, email, password, role: 'department_officer', department, isVerified: true });
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('head', 'name').populate('officers', 'name');
    res.json({ success: true, departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/admin/departments
exports.createDepartment = async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, department: dept });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
