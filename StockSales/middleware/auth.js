const jwt = require('jsonwebtoken');
const db = require("../models/index");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    // console.error(err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

exports.isRegistered = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
  
    const user = await db.User.findOne({
      where: { id: userId },
    });

    if(user.RoleId !== 2){
      throw "Unauthorized";
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: `Unauthorized` });
  }
};

exports.isAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
  
    const user = await db.User.findOne({
      where: { id: userId },
    });
    console.log('userId', user.RoleId);

    if(user.RoleId !== 1){
      throw "Unauthorized";
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: `Unauthorized: ${err}` });
  }
};