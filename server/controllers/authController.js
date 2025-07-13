import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function register(req, res) {
  const { username, email, password } = req.body;
  console.log('[REGISTER] Request:', req.body);
  if (!username || !email || !password) {
    console.log('[REGISTER] Missing fields');
    return res.status(400).json({ message: 'All fields required' });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('[REGISTER] User exists:', username);
      return res.status(409).json({ message: 'Username already exists' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log('[REGISTER] Email exists:', email);
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();
    console.log('[REGISTER] Success:', username);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('[REGISTER] Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;
  console.log('[LOGIN] Request:', req.body);
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('[LOGIN] User not found:', username);
      return res.status(404).json({ message: 'User not found' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('[LOGIN] Invalid credentials for:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
    console.log('[LOGIN] Success:', username);
    res.json({ token, username });
  } catch (err) {
    console.error('[LOGIN] Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
