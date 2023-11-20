import express from 'express';
import bcrypt from "bcrypt";
import { randomUUID } from 'node:crypto';

const app = express();

app.use(express.json());

app.get('/', (request, response) => {return response.json('OK');});

const usuarios = [];
const recados = [];


// POST - PARA CRIAR USUÁRIO COM RECADO "FALSO"
app.post ("/usuarios", async (req, resp) => {
    const body= req.body;

    if (body.nome === undefined) {
        return resp.status(400).json("Nome não informado!");
    }

    if (body.email === undefined) {
        return resp.status(400).json("E-mail não informado!");
    }

    if (body.senha === undefined) {
        return resp.status(400).json("Senha não informada!");
    }

    const verificarEmail = usuarios.find((usuario) => {
        return usuario.email === body.email;
    }); 

    if (verificarEmail !== undefined) {
        return resp.status(400).json("E-mail já cadastrado!")
    }

    const criptografarSenha = await bcrypt.hash(body.email, 6);
    
    const usuario = {
        id: randomUUID(),
        nome: body.nome,
        email: body.email,
        senha: criptografarSenha,
        recados: []
    };

    usuarios.push(usuario);

    console.log(usuario);

    return resp.status(201).json("Usuário criado com sucesso!");

})

//  GET - PARA VISUALIZAR USUÁRIOS JÁ CADASTRADOS
app.get("/usuarios", (req, resp) => {
    
    if (usuarios.length < 1) {
        return resp.status(404).json("Nnenhum usuário cadastrado!");
    }

    return resp.json(usuarios);

});



app.listen(8080, () => console.log("Servidor iniciado - porta 8080"));
