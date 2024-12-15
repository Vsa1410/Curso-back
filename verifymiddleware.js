const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const verifyEnrollment = async (req, res, next) => {
  const courseId = parseInt(req.params.courseId, 10); // ID do curso da rota
  const userId = req.user.id; // ID do aluno extraído do token

  try {
    // Verifica se o aluno está inscrito no curso
    const enrollment = await prisma.enrolledCourse.findUnique({
      where: {
        userId_courseId: { userId, courseId }, // Campo único no modelo
      },
    });

    if (!enrollment) {
      return res.status(403).json({ error: "Acesso negado. Você não está inscrito neste curso." });
    }

    next(); // Usuário está inscrito, prossiga para a rota
  } catch (err) {
    res.status(500).json({ error: "Erro ao verificar inscrição." });
  }
};

module.exports = verifyEnrollment;