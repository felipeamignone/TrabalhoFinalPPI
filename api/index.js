import express from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";

const port = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "MinH4Ch4v3S3cr3t4", //chave para assinar os dados da sessão
    resave: true, //salva a sessão a cada requisição HTTP
    saveUninitialized: true,
    cookie: {
      //tempo de vida da sessão
      maxAge: 1000 * 60 * 30, //30 minutos
    },
  })
);

app.use(express.static(path.join(process.cwd(), "public")));

//pagina de login
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

//método de login
app.post("/login", (req, res) => {
  let { user, senha } = req.body;

  let camposComErro = [];

  if (!user) camposComErro.push("#user-input");

  if (!senha) camposComErro.push("#senha-input");

  if (camposComErro.length) {
    res.send({
      ok: false,
      message: "Preencha os campos corretamente!",
      data: camposComErro,
    });
    return;
  }

  if (user === "admin" && senha === "senha123") {
    req.session.usuarioAutenticado = true;
    res.cookie("usuarioLogado", user, { maxAge: 1000 * 60 * 30 });
    res.cookie("dataUltimoAcesso", new Date().toLocaleString("pt-BR"), {
      maxAge: 1000 * 60 * 60 * 24 * 30, //1 mês de expiração
    });
    res.send({ ok: true, message: "Usuário logado com sucesso!" });
    return;
  }
  res.send({ ok: false, message: "Nome de usuário e/ou senha inválidos!" });
});

//método de logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("usuarioLogado");
  res.redirect("/login.html");
});

//middleware para verificar autenticação
function usuarioEstaAutenticado(req, res, next) {
  if (req.session.usuarioAutenticado) {
    next(); //permitir que a requisição continue a ser processada
    return;
  }
  res.redirect("/login.html");
}

app.use(
  usuarioEstaAutenticado,
  express.static(path.join(process.cwd(), "restricted"))
);

//pagina home
app.get("/home", (req, res) => {
  res.redirect("/home.html");
});

//pagina cadastro pets
app.get("/pets", (req, res) => {
  res.redirect("/cadastro-pet.html");
});

//pagina adocao de pet
app.get("/adocoes", (req, res) => {
  res.redirect("/adocao-pet.html");
});

//pagina cadastro interessados
app.get("/interessados", (req, res) => {
  res.redirect("/cadastro-interessado.html");
});

let interessados = [];
//lista de interessados
app.get("/interessados/listar", (req, res) => {
  res.send({ ok: true, data: interessados });
});

//cadastro interessado
app.post("/interessados/cadastrar", (req, res) => {
  let { name, email, phone } = req.body;

  let camposComErro = [];

  if (!name) camposComErro.push("#name-input");
  if (!email) camposComErro.push("#email-input");
  if (!phone) camposComErro.push("#phone-input");

  if (camposComErro.length) {
    res.send({
      ok: false,
      message: "Preencha os campos corretamente!",
      data: camposComErro,
    });
    return;
  }

  interessados.push({ name, email, phone });

  res.send({ ok: true, message: "Interessado cadastrado com sucesso!" });
});

let pets = [];
//lista de pets
app.get("/pets/listar", (req, res) => {
  res.send({ ok: true, data: pets });
});

//cadastro pet
app.post("/pets/cadastrar", (req, res) => {
  let { name, race, age } = req.body;

  let camposComErro = [];

  if (!name) camposComErro.push("#name-input");
  if (!race) camposComErro.push("#race-input");
  if (!age) camposComErro.push("#age-input");

  if (camposComErro.length) {
    res.send({
      ok: false,
      message: "Preencha os campos corretamente!",
      data: camposComErro,
    });
    return;
  }

  pets.push({ name, race, age });

  res.send({ ok: true, message: "Pet cadastrado com sucesso!" });
});

let adocoes = [];
//lista de adocoes
app.get("/adocoes/listar", (req, res) => {
  res.send({ ok: true, data: adocoes });
});

//cadastro adocao
app.post("/adocoes/cadastrar", (req, res) => {
  let { interessado, pet } = req.body;

  let camposComErro = [];

  if (!interessado || interessado === "0")
    camposComErro.push("#interessado-select");
  if (!pet || pet === "0") camposComErro.push("#pet-select");

  if (camposComErro.length) {
    res.send({
      ok: false,
      message: "Preencha os campos corretamente!",
      data: camposComErro,
    });
    return;
  }

  adocoes.push({
    interessado,
    pet,
    data: new Date().toLocaleString("pt-BR"),
  });

  res.send({
    ok: true,
    message: "Interesse em adoção cadastrado com sucesso!",
  });
});

app.listen(port, () => {
  console.log(`Server rodando em http://localhost:${port}`);
});

export default app;
