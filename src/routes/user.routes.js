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

module.exports = router;
