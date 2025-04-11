// ...código existente...
const express = require('express');
const cors = require('cors');
const itemRoutes = require('./src/routes/items.routes');

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, Refind!')
})

app.use('/itens', itemRoutes);
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})