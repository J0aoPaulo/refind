const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Listar todos os usuários 
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

// Criar novo usuário
router.post("/", async (req, res) => {
  const { name, phone, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, phone, email }
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(400).json({ error: "Erro ao criar usuário", details: error.message });
  }
});

// Buscar usuário por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: id }, // Correção aqui
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
});

// Atualizar usuário por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: id }, // Correção aqui
      data: { name, phone, email },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(400).json({ error: "Erro ao atualizar usuário", details: error.message });
  }
});

// Deletar usuário por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: id }, // Correção aqui
    });
    res.status(204).send(); // 204 No Content para deleção bem-sucedida
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

module.exports = router;
