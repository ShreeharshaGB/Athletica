import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate signed JWT for authenticated user
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Return user data stripped of sensitive credentials
 */
const formatSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (student or teacher) and return JWT
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate presence of required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Name, email, password, and role are required.'
      });
    }

    // Validate role
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Role must be either "student" or "teacher".'
      });
    }

    // Validate password minimum length
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing user with identical email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        error: 'Registration failed',
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password securely with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user record
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role
    });

    // Generate JWT token
    const token = generateToken(user);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatSafeUser(user)
    });
  } catch (error) {
    console.error(`[Auth Register Error] ${error.message}`);
    return res.status(500).json({
      error: 'Server error',
      message: 'Unable to complete registration. Please try again later.'
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Lookup user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password.'
      });
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password.'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: formatSafeUser(user)
    });
  } catch (error) {
    console.error(`[Auth Login Error] ${error.message}`);
    return res.status(500).json({
      error: 'Server error',
      message: 'Unable to process login. Please try again later.'
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Fetch authenticated user profile
 * @access  Protected (requires valid JWT)
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User account not found.'
      });
    }

    return res.status(200).json({
      user: formatSafeUser(user)
    });
  } catch (error) {
    console.error(`[Auth getCurrentUser Error] ${error.message}`);
    return res.status(500).json({
      error: 'Server error',
      message: 'Unable to retrieve user details.'
    });
  }
};
