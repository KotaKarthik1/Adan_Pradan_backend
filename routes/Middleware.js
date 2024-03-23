const jwt = require('jsonwebtoken');
const { User } = require('../models/StudentdUserModel');

const requireAuth = async (req, res, next) => {
  const secretKey = process.env.JWT_SECRET;

  const authHeader = req.header('Authorization');
  console.log(authHeader);

  if (!authHeader) {
    console.log("error in auth");
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const [_, token] = authHeader.split(' ');

  if (!token) {

    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = requireAuth;