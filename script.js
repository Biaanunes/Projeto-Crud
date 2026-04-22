const express = require('express');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.run(`
    CREATE TABLE livros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT,
  autor TEXT,
  ano_publicacao TEXT,
  genero TEXT,
  editora TEXT,
  paginas TEXT,
  idioma TEXT,
  disponivel INTEGER
)
  `);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});

app.post('/livros', (req, res) => {
    const { titulo, autor, ano_publicacao, genero, editora, paginas, idioma, disponivel } = req.body;
  
    db.run(
      `INSERT INTO livros 
      (titulo, autor, ano_publicacao, genero, editora, paginas, idioma, disponivel) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, autor, ano_publicacao, genero, editora, paginas, idioma, disponivel ? 1 : 0],
      function () {
        res.redirect('/');
      }
    );
  });


app.get('/atualizar', (req, res) => {
    res.sendFile(__dirname + '/atualizar.html');
});

app.post('/atualizar', (req, res) => {
    const { id, titulo, autor, ano_publicacao, genero, editora, paginas, idioma, disponivel } = req.body;
  
    db.run(
        `UPDATE livros SET 
          titulo = ?, 
          autor = ?, 
          ano_publicacao = ?, 
          genero = ?, 
          editora = ?, 
          paginas = ?, 
          idioma = ?, 
          disponivel = ?
        WHERE id = ?`,)
    [titulo, autor, ano_publicacao, genero, editora, paginas, idioma, disponivel ? 1 : 0, id],
    () => {
          res.redirect('/');
        }}
        );


app.get('/livros/:id', (req, res) => {
    db.get(
      'SELECT * FROM livros WHERE id = ?',
      [req.params.id],
      (err, row) => {
        if (!row) return res.sendStatus(404);
        res.json(row);
      }
    );
  });

app.delete('/livros/:id', (req, res) => {
    db.run(
      'DELETE FROM livros WHERE id = ?',
      [req.params.id],
      () => {
        res.sendStatus(204);
      }
    );
  });

  app.post('/deletar', (req, res) => {
    const { id } = req.body;
  
    db.run(
      'DELETE FROM livros WHERE id = ?',
      [id],
      () => {
        res.redirect('/');
      }
    );
  });

  app.put('/livros/:id', (req, res) => {
    const { titulo } = req.body;
  
    db.run(
      'UPDATE livros SET titulo = ? WHERE id = ?',
      [titulo, req.params.id],
      () => {
        res.sendStatus(200);
      }
    );
  });

app.get('/livros', (req, res) => {
    db.all('SELECT * FROM livros', [], (err, rows) => {
      res.json(rows);
    });
  });

console.clear()

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor Node.js em execução em http://localhost:${port}`);
});
