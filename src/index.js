import express from 'express';
import bcrypt from "bcrypt";
import { randomUUID } from 'node:crypto';

const app = express();

app.use(express.json());

app.get('/', (request, response) => {return response.json('OK');});

const usuarios = [];
const recados = [];






app.listen(8080, () => console.log("Servidor iniciado - porta 8080"));
