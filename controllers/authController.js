const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { nama, username, email, nomorWa, password } = req.body;

    if (!nama || !username || !email || !nomorWa || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findByUsernameOrEmail(username, email);

    if (existingUser) {
      return res.status(409).json({
        message: 'Username or email already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: nama,
      username,
      email,
      whatsappNumber: nomorWa,
      passwordHash,
      role: 'CLIENT',
    });

    return res.status(201).json({
      message: 'Register success',
      data: {
        id: user.id,
        nama: user.name,
        username: user.username,
        email: user.email,
        nomorWa: user.whatsapp_number,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Register failed',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Username/email and password are required',
      });
    }

    const user = await User.findByUsernameOrEmailLogin(identifier);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid username/email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid username/email or password',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    return res.json({
      message: 'Login success',
      token,
      user: {
        id: user.id,
        nama: user.name,
        username: user.username,
        email: user.email,
        nomorWa: user.whatsapp_number,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};