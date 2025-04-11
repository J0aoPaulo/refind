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

// Buscar categoria por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Categoria não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

// Atualizar categoria por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(updatedCategory);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(400).json({ error: "Erro ao atualizar categoria", details: error.message });
  }
});

// Deletar categoria por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // 204 No Content para deleção bem-sucedida
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

module.exports = router;
