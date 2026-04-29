// server.js — LojaFácil (Express/Node.js)
// LojaFácil — E-commerce simples. Contém vulnerabilidades propositais para fins educacionais.

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

const PAGE = (content) => `
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>LojaFácil</title>
<style>body{font-family:Arial;max-width:600px;margin:50px auto;padding:20px}
h1{color:#2980b9}input,button{padding:10px;margin:5px;width:90%}
button{background:#2980b9;color:#fff;border:none;cursor:pointer}
nav a{margin-right:15px;color:#2980b9}.err{color:red}</style></head><body>
<h1>🛒 LojaFácil</h1>
<nav><a href="/">Home</a><a href="/login">Login</a><a href="/produtos">Produtos</a></nav>
${content}
</body></html>`;

app.get("/", (req, res) => {
  res.send(PAGE("<p>E-commerce de produtos eletrônicos.</p>"));
});

// ❌ VULNERABILIDADE PROPOSITAL: XSS Refletido no login + credencial hardcoded
app.all("/login", (req, res) => {
  let msg = "";
  if (req.method === "POST") {
    const { usuario, senha } = req.body;
    if (usuario === "admin" && senha === "admin123") {
      return res.redirect("/");
    }
    // XSS: input do usuário refletido sem sanitização
    msg = `<p class="err">Usuário '${usuario}' inválido!</p>`;
  }
  const form = `${msg}<form method="POST">
    <input name="usuario" placeholder="Usuário"><br>
    <input name="senha" type="password" placeholder="Senha"><br>
    <button>Entrar</button></form>`;
  res.send(PAGE(form));
});

// ❌ VULNERABILIDADE PROPOSITAL: XSS na busca de produtos
app.get("/produtos", (req, res) => {
  const q = req.query.q || "";
  const body = `<form><input name="q" value="${q}"><button>Buscar</button></form>
    <p>Você buscou: ${q}</p>`;
  res.send(PAGE(body));
});

const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🛒 LojaFácil rodando em http://localhost:${PORT}`);
});
