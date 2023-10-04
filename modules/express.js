const express = require('express') //Importa o módulo 'express', que é um framework para criação de aplicativos web em Node.js.
const cors = require('cors')

const UserModel = require('../src/models/user.model') //Importa o modelo de usuário definido no arquivo 'user.model.js' (assumindo que o arquivo esteja no diretório '../src/models'). Isso sugere que você está usando um banco de dados para armazenar informações de usuário.

const app = express() //Cria uma instância do aplicativo Express chamada app.

app.use(express.json()) //Configura o aplicativo para analisar o corpo das solicitações HTTP como JSON. Isso é útil quando você deseja receber dados JSON nas solicitações POST e PUT.
app.use(cors())

app.use((req, res, next) => {
    console.log(`Request Type: ${req.method}`)
    console.log(`Content Type: ${req.headers["content-type"]}`)
    console.log(`Date: ${new Date}`)

    next()
}) //Define um middleware global que será executado para cada solicitação. Esse middleware registra informações sobre a solicitação, como o método HTTP, o tipo de conteúdo e a data, no console antes de passar a solicitação para a próxima função middleware ou manipulador de rota

app.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({})
        
        res.status(200).json(users)
    } catch(error) {
        return res.status(500).send(error.message)
    }
}) 

app.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id

        const user = await UserModel.findById(id)
        return res.status(200).json(user)
    } catch(error) {
        return res.status(500).send(error.message)
    }
}) //Define uma rota GET para '/users/:id'. Esta rota permite buscar um usuário específico com base no ID fornecido na URL. O servidor consulta o banco de dados (usando o modelo UserModel) para encontrar o usuário com o ID correspondente e responde com os dados desse usuário em formato JSON.

app.post('/users', async (req, res) => {
    try{
        const user = await UserModel.create(req.body)

        res.status(201).json(user)
    } catch(error) {
        res.status(500).send(error.message)
    }
}) //Define uma rota POST para '/users'. Esta rota permite criar um novo usuário com base nos dados fornecidos no corpo da solicitação (espera-se que seja um objeto JSON). O servidor cria o usuário no banco de dados e responde com os dados do usuário criado em formato JSON.

app.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true})
        res.status(200).json(user)
    } catch(error) {
        res.status(500).send(error.message)
    }
}) //Define uma rota PUT para '/users/:id'. Esta rota permite atualizar um usuário existente com base no ID fornecido na URL e nos dados fornecidos no corpo da solicitação (espera-se que seja um objeto JSON). O servidor atualiza o usuário no banco de dados e responde com os dados do usuário atualizado em formato JSON.

app.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserModel.findByIdAndRemove(id)

        res.status(200).json(user)
    } catch(error) {
        res.status(500).send(error.message)
    }
}) //Define uma rota DELETE para '/users/:id'. Esta rota permite excluir um usuário com base no ID fornecido na URL. O servidor exclui o usuário do banco de dados e responde com os dados do usuário excluído em formato JSON.

const port = 8080 //Define a porta na qual o servidor irá escutar as solicitações HTTP.

app.listen(port, () => console.log(`Rodando com express na porta ${port}`)) //Inicia o servidor Express na porta especificada (8080) e exibe uma mensagem no console quando o servidor estiver pronto para receber solicitações.

//Em resumo, este código define a estrutura de documentos para representar usuários em um banco de dados MongoDB usando o Mongoose. Os documentos de usuário devem seguir o formato especificado pelo esquema userSchema, com campos obrigatórios para firstName, lastName, email e password. Este modelo pode ser usado para criar, ler, atualizar e excluir registros de usuários no MongoDB a partir da sua aplicação Node.js.