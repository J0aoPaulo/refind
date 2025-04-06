// ...código existente...
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, Refind!')
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})