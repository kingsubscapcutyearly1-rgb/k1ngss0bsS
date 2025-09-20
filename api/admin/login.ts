import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SETTINGS_FILE = path.join(process.cwd(), 'server', 'settings.json');

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      try {
        // Read settings to get admin password
        const settingsData = await fs.readFile(SETTINGS_FILE, 'utf8');
        const settings = JSON.parse(settingsData);

        if (!settings.admin_password) {
          return res.status(500).json({ error: 'Admin password not configured' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, settings.admin_password);

        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { role: 'admin' },
          process.env.JWT_SECRET || 'default_secret',
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          token,
          message: 'Login successful'
        });
      } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
      }
    }

    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
