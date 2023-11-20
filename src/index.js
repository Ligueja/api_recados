import express from 'express';
import bcrypt, { hash } from "bcrypt";
import { randomUUID } from 'node:crypto';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {return res.json('OK');});

const usuarios = [];
const recados = [];


// POST - PARA CRIAR USUÁRIO COM RECADO "FALSO"
app.post ("/usuarios", async (req, res) => {
    const body = req.body;

    if (body.nome === undefined) {
        return res.status(400).json("Nome não informado!");
    }

    if (body.email === undefined) {
        return res.status(400).json("E-mail não informado!");
    }

    if (body.senha === undefined) {
        return res.status(400).json("Senha não informada!");
    }

    const verificarEmail = usuarios.find((usuario) => {
        return usuario.email === body.email;
    }); 

    if (verificarEmail !== undefined) {
        return res.status(400).json("E-mail já cadastrado!")
    }

    // const criptografarSenha = await bcrypt.hash(body.email, 6);

    bcrypt.hash(senha, 6, (err, hash) => {
        if (err) {
           return res.status(500).json("Erro ao criar usuário!")
        }
        else {
            const usuario = {
                id: randomUUID(),
                nome: body.nome,
                email: body.email,
                senha: hash,
                recados: []
            };
        
            usuarios.push(usuario);

            console.log(usuario);
        }
    })

    

    return res.status(201).json("Usuário criado com sucesso!");

})

//  GET - PARA VISUALIZAR USUÁRIOS JÁ CADASTRADOS
app.get("/usuarios", (req, res) => {
    
    if (usuarios.length < 1) {
        return res.status(404).json("Nnenhum usuário cadastrado!");
    }

    return res.json(usuarios);

});

// POST - LOGIN DE USUÁRIO JÁ CADASTRADO 

app.post("/usuarios/login", (req, res) => {
    const login = req.body;

    const usuario = usuarios.find((usuario) => usuario.email === login.email);

    if (!usuario) {
        return res.status(402).json("Usauário não cadastrado")
    };

    bcrypt.compare(login.senha, usuario.senha, function (err, result){
        if (result) {
            return res.status(200).json("Usuário logado");
        }
        else {
            return res.status(402).json("Dados inválidos")
        }
    })
});







app.listen(8080, () => console.log("Servidor iniciado - porta 8080"));
