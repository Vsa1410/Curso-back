const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer <token>"
  if (!token) return res.status(401).json({ error: "Acesso negado!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário no objeto `req`
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido!" });
  }
};

module.exports = authenticateToken;