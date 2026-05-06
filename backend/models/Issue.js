const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 500 },
    isOfficialResponse: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'],
    required: true,
  },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String,
  changedAt: { type: Date, default: Date.now },
});

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Issue title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['road', 'water', 'drainage', 'electricity', 'garbage', 'streetlight', 'other'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'],
      default: 'open',
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
      address: String,
      ward: String,
      landmark: String,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    ticketId: {
      type: String,
      unique: true,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },
    comments: [commentSchema],
    statusHistory: [statusHistorySchema],
    resolvedAt: Date,
    dueDate: Date,
    isPublic: { type: Boolean, default: true },
    escalationLevel: { type: Number, default: 0 },
    escalatedAt: Date,
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      submittedAt: Date,
    },
  },
  { timestamps: true }
);

issueSchema.index({ location: '2dsphere' });
issueSchema.index({ category: 1, status: 1 });
issueSchema.index({ reportedBy: 1 });
// `ticketId` has `unique: true` on the field definition, which creates an index.
// Avoid declaring a duplicate index here which causes a "Duplicate schema index" warning.

// Auto-generate ticket ID
issueSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Issue').countDocuments();
    const prefix = this.category.toUpperCase().substring(0, 3);
    this.ticketId = `CR-${prefix}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Auto-assign department based on category
issueSchema.pre('save', async function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
    });
    if (this.status === 'resolved') {
      this.resolvedAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
