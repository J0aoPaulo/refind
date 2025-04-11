const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Listar todas as categorias
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

// Criar nova categoria
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await prisma.category.create({ data: { name } });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

module.exports = router;
