const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createAdmin = async (req, res) => {
  const { name, phone, email, role, password } = req.body;

  try {
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const newAdmin = await prisma.user.create({
      data: {
        name, 
        phone,
        email,
        role: role || "ADMIN",
        password: hashedPassword
      }
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Erro ao criar admin", error);
    res.status(400).json({ error: "Erro ao criar usuário", details: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { items: true }
    });
    res.json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, role } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        email,
        role
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(400).json({ error: "Erro ao atualizar usuário", details: error.message });
  }
};

const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createAdmin
};
