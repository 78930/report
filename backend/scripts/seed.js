require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Department = require('../models/Department');
const Issue = require('../models/Issue');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
};

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Department.deleteMany({});
  await Issue.deleteMany({});
  console.log('Cleared existing data');

  // Create departments
  const departments = await Department.insertMany([
    { name: 'Public Works Department', code: 'PWD', categories: ['road'], slaHours: 72, contactEmail: 'pwd@bbmp.gov.in', contactPhone: '080-12345001' },
    { name: 'Water Supply & Sewerage Board', code: 'WATER', categories: ['water'], slaHours: 24, contactEmail: 'water@bbmp.gov.in', contactPhone: '080-12345002' },
    { name: 'Drainage & Sewerage', code: 'DRAINAGE', categories: ['drainage'], slaHours: 48, contactEmail: 'drainage@bbmp.gov.in', contactPhone: '080-12345003' },
    { name: 'BESCOM Electricity', code: 'BESCOM', categories: ['electricity', 'streetlight'], slaHours: 12, contactEmail: 'bescom@bbmp.gov.in', contactPhone: '1800-425-9595' },
    { name: 'BBMP Solid Waste Management', code: 'BBMP', categories: ['garbage'], slaHours: 24, contactEmail: 'swm@bbmp.gov.in', contactPhone: '080-12345005' },
    { name: 'General Administration', code: 'GENERAL', categories: ['other'], slaHours: 96, contactEmail: 'general@bbmp.gov.in', contactPhone: '080-12345006' },
  ]);
  console.log('Created departments:', departments.length);

  // Create admin user (store plain password so Mongoose pre-save hashes it once)
  const adminPassword = 'Admin@123';
  const admin = await User.create({
    name: 'System Administrator',
    phone: '9000000001',
    email: 'admin@civicreport.in',
    password: adminPassword,
    role: 'admin',
    isVerified: true,
  });

  // Create department officers (use create so pre-save hashes the password)
  const officers = [];
  officers.push(await User.create({ name: 'Rajesh Kumar', phone: '9000000002', email: 'pwd.officer@civicreport.in', password: adminPassword, role: 'department_officer', department: departments[0]._id, isVerified: true }));
  officers.push(await User.create({ name: 'Priya Sharma', phone: '9000000003', email: 'water.officer@civicreport.in', password: adminPassword, role: 'department_officer', department: departments[1]._id, isVerified: true }));
  officers.push(await User.create({ name: 'Suresh Babu', phone: '9000000004', email: 'bescom.officer@civicreport.in', password: adminPassword, role: 'department_officer', department: departments[3]._id, isVerified: true }));

  // Create sample citizens
  const citizens = await User.insertMany([
    { name: 'Arun Venkat', phone: '9876543210', ward: 'Ward 45', isVerified: true },
    { name: 'Meena Krishnan', phone: '9876543211', ward: 'Ward 32', isVerified: true },
    { name: 'Ravi Teja', phone: '9876543212', ward: 'Ward 18', isVerified: true },
  ]);

  // Create sample issues (assign unique ticketId values to avoid duplicate-null unique index errors)
  const issuesData = [
    {
      title: 'Large pothole on MG Road near bus stop',
      description: 'There is a very large pothole near the KSRTC bus stop on MG Road. Several two-wheelers have fallen due to this. Needs immediate attention.',
      category: 'road', priority: 'high', status: 'in_progress',
      location: { type: 'Point', coordinates: [77.5946, 12.9716], address: 'MG Road, Bengaluru', ward: 'Ward 45', landmark: 'Near KSRTC Bus Stop' },
      reportedBy: citizens[0]._id, department: departments[0]._id, assignedTo: officers[0]._id,
      upvoteCount: 23,
    },
    {
      title: 'Water pipe burst on 5th Main Road',
      description: 'A water pipe burst at the junction of 5th Main and 3rd Cross, Jayanagar. Water is flooding the road and causing traffic disruption.',
      category: 'water', priority: 'critical', status: 'assigned',
      location: { type: 'Point', coordinates: [77.5822, 12.9259], address: '5th Main Rd, Jayanagar', ward: 'Ward 32' },
      reportedBy: citizens[1]._id, department: departments[1]._id,
      upvoteCount: 45,
    },
    {
      title: 'Street lights not working on 80 Feet Road',
      description: '5 consecutive street lights on 80 Feet Road, Koramangala have been non-functional for the past week creating a safety hazard.',
      category: 'streetlight', priority: 'medium', status: 'open',
      location: { type: 'Point', coordinates: [77.6245, 12.9352], address: '80 Feet Road, Koramangala', ward: 'Ward 68' },
      reportedBy: citizens[2]._id, department: departments[3]._id,
      upvoteCount: 12,
    },
    {
      title: 'Garbage not collected for 3 days',
      description: 'No garbage collection in our area for 3 consecutive days. The waste is piling up on the street causing unhygienic conditions.',
      category: 'garbage', priority: 'high', status: 'resolved',
      location: { type: 'Point', coordinates: [77.6101, 12.9141], address: 'HSR Layout Sector 1', ward: 'Ward 18' },
      reportedBy: citizens[0]._id, department: departments[4]._id,
      upvoteCount: 8, resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  // Generate unique ticket IDs using a timestamp + index suffix to guarantee uniqueness for the seed data
  const ts = Date.now().toString().slice(-6);
  issuesData.forEach((it, idx) => {
    const prefix = (it.category || 'OTH').toUpperCase().substring(0, 3);
    it.ticketId = `CR-${prefix}-${ts}-${idx + 1}`;
  });

  await Issue.insertMany(issuesData);

  console.log('Seed data created successfully!');
  console.log('\n=== Login Credentials ===');
  console.log('Admin Email: admin@civicreport.in');
  console.log('Admin Password: Admin@123');
  console.log('Officer Email: pwd.officer@civicreport.in / Password: Admin@123');
  console.log('\n=== Citizen OTP Login ===');
  console.log('Phone: 9876543210 (use any 6-digit OTP in dev mode)');

  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
