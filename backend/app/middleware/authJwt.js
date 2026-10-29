const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const getRoles = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return [];
  const roles = await user.getRoles();
  return roles.map((role) => role.name);
};

const verifyToken = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return res.status(403).send({ message: "No token provided!" });
  }

  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : authorization;

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const roles = await getRoles(req.userId);
    if (roles.includes("admin")) return next();
    return res.status(403).send({ message: "Require Admin Role!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const isModerator = async (req, res, next) => {
  try {
    const roles = await getRoles(req.userId);
    if (roles.includes("moderator")) return next();
    return res.status(403).send({ message: "Require Moderator Role!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const roles = await getRoles(req.userId);
    if (roles.includes("moderator") || roles.includes("admin")) return next();
    return res.status(403).send({
      message: "Require Moderator or Admin Role!",
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const isAuthenticatedUser = async (req, res, next) => {
  try {
    const roles = await getRoles(req.userId);
    if (roles.length) return next();
    return res.status(403).send({ message: "Require an application role!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const canModifyUser = async (req, res, next) => {
  try {
    const roles = await getRoles(req.userId);
    if (roles.includes("admin") || roles.includes("moderator") ||
        String(req.userId) === String(req.params.id)) {
      return next();
    }
    return res.status(403).send({ message: "You can only modify your own user!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const preventRoleChange = (req, res, next) => {
  if (Object.prototype.hasOwnProperty.call(req.body, "roles") ||
      Object.prototype.hasOwnProperty.call(req.body, "role") ||
      Object.prototype.hasOwnProperty.call(req.body, "roleId")) {
    return res.status(403).send({
      message: "Role modification is not allowed on this endpoint",
    });
  }
  next();
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
  isAuthenticatedUser,
  canModifyUser,
  preventRoleChange,
};

module.exports = authJwt;
