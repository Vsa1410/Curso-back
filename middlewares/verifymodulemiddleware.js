const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const verifyModuleAccess = async (req, res, next) => {
  const moduleId = parseInt(req.params.id, 10); // ID do módulo da rota
  console.log(req.params.id)
  const userId = req.user.id; // ID do aluno extraído do token

  try {
    // Verifica se o módulo pertence a um curso em que o aluno está inscrito
    const enrollment = await prisma.enrolledCourse.findFirst({
      where: {
        id: userId,
        course: {
          modules: {
            some: { id: moduleId }, // Verifica se o módulo pertence ao curso
          },
        },
      },
    });

    if (!enrollment) {
      return res.status(403).json({ error: "Acesso negado. Você não está inscrito no curso deste módulo." });
    }

    next(); // Usuário tem acesso, prossiga para a rota
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao verificar acesso ao módulo." });
  }
};

module.exports = verifyModuleAccess;