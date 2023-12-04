import express, { json } from "express";
import bcrypt, { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { join } from "path";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.json("OK, servidor rodando");
});

const usuarios = [
  {
    "id": "ab33a6f0-8724-49df-acfa-22602e22e40d",
    "nome": "Fernanda",
    "email": "ligue@gmail.com",
    "senha": "$2b$06$lkglIJK7.Hc3Kt0g4/TJ7u2DHW9G5VCwD0gimwPchWYBuGhS64wYm",
    "recados": [
      {
        "id": "7c2b24fd-bb14-4c46-a984-647c237613fe",
        "titulo": "Titulo do Novo recado",
        "descricao": "Descrição do Novo recado"
    }
    ]
}
];
const recados = [];

// POST - PARA CRIAR USUÁRIO COM RECADO "FALSO"

app.post("/usuarios", async (req, res) => {
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
    return res.status(400).json("E-mail já cadastrado!");
  }

  bcrypt.hash(body.senha, 6, (err, hash) => {
    if (err) {
      return res.status(500).send("Erro ao criar usuário!");
    } else {
      const usuario = {
        id: randomUUID(),
        nome: body.nome,
        email: body.email,
        senha: hash,
        recados: [],
      };

      usuarios.push(usuario);

      console.log(usuario);
    }
  });

  return res.status(201).json("Usuário criado com sucesso!");
});

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
    return res.status(402).json("Usauário não cadastrado");
  }

  bcrypt.compare(login.senha, usuario.senha, function (err, result) {
    if (result) {
      return res.status(200).json("Usuário logado");
    } else {
      return res.status(402).json("Dados inválidos");
    }
  });
});

// CRUD DE RECADOS

// POST - Crias recado através do ID do usuário

app.post("/usuarios/:id/recados", async (req, res) => {
  const body = req.body;
  const usuarioId = req.params.id;

  const usuario = usuarios.find((user) => user.id === usuarioId);

  if (!usuario) {
    return res.status(404).json("Usuário não encontrado!");
  }

  const novoRecado = {
    id: randomUUID(),
    titulo: body.titulo,
    descricao: body.descricao,
  };

  usuario.recados.push(novoRecado);
  recados.push(novoRecado);

  return res.status(201).json("Recado criado com sucesso!");
});

// GET - ler recado através do id do usuário

app.get("/usuarios/:id/recados", (req, res) => {
  const usuarioId = req.params.id;

  const usuario = usuarios.find((user) => user.id === usuarioId);

  if (!usuario) {
    return res.status(404).json("Usuário não encontrado!");
  }

  return res.status(201).json(usuario.recados);
});

// PUT - editar cadastro através do id do usuário e do id do recado

app.put("/usuarios/:userId/recados/:recadoId", (req, res) => {
  const { titulo, descricao } = req.body;
  const usuarioId = req.params.userId;
  const recadoId = req.params.recadoId;

  const usuario = usuarios.find((user) => user.id === usuarioId);

  if (!usuario) {
    return res.status(404).json("Usuário não encontrado!");
  }

  const recado = usuario.recados.find((recado) => recado.id === recadoId);

  if (!recado) {
    return res.status(404).json("Recado não encontrado!");
  }

  recado.titulo = titulo;
  recado.descricao = descricao;

  return res.status(201).json("Recado atualizado com sucesso!");
});

// DELETE - deletar recado usando o id do usuário e id do recado

app.delete("/usuarios/:userId/recados/:recadoId", (req, res) => {
  const usuarioId = req.params.userId;
  const recadoId = req.params.recadoId;

  const usuario = usuarios.find((user) => user.id === usuarioId);

  if (!usuario) {
    return res.status(404).json("Usuário não encontrado!");
  }

  const recadoIndex = usuario.recados.findIndex(
    (recado) => recado.id === recadoId
  );

  if (recadoIndex === -1) {
    return res.status(404).json("Recado não encontrado!");
  }

  usuario.recados.splice(recadoIndex, 1);

  return res.status(201).json("Recado apagado com sucesso!");
});

app.listen(8080, () => console.log("Servidor iniciado - porta 8080"));
