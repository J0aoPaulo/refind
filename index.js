const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./src/routes/categoryRoutes');
const itemRoutes = require('./src/routes/itemsRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const setupSwagger = require('./swagger');

const app = express()
app.use(cors())
app.use(express.json())

setupSwagger(app);

app.use('/items', itemRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
});
