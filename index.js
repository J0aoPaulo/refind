// ...código existente...
const express = require('express');
const cors = require('cors');
const itemRoutes = require('./src/routes/itemsRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const userRoutes = require('./src/routes/user.routes');

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, Refind!')
})

app.use('/items', itemRoutes);
app.use('/categories', categoryRoutes);
app.use('/usuarios', userRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
});
