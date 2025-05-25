const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'pccasa@123',
  database: 'agendamento'
});

db.connect((err) => {
  if (err) {
    console.error('Erro na conexão com o MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

app.post('/api/appointments', (req, res) => {
  const { name, phone, date, time, service } = req.body;

  // Verifica se já existe agendamento no mesmo dia e horário
  const checkSql = 'SELECT COUNT(*) AS count FROM appointments WHERE date = ? AND time = ?';

  db.query(checkSql, [date, time], (err, results) => {
    if (err) {
      console.error('Erro ao verificar agendamento:', err);
      return res.status(500).json({ message: 'Erro interno ao verificar agendamento' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ message: `Já existe um agendamento para ${date} às ${time}. Escolha outro horário.` });
    }

    // Insere o agendamento se não houver conflito
    const insertSql = 'INSERT INTO appointments (name, phone, date, time, service) VALUES (?, ?, ?, ?, ?)';
    db.query(insertSql, [name, phone, date, time, service], (err) => {
      if (err) {
        console.error('Erro ao salvar agendamento:', err);
        return res.status(500).json({ message: 'Erro ao salvar agendamento' });
      }
      res.json({ message: 'Agendamento salvo com sucesso' });
    });
  });
});

app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM appointments WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar agendamento:', err);
      res.status(500).json({ message: 'Erro ao excluir agendamento' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Agendamento não encontrado' });
    } else {
      res.json({ message: 'Agendamento excluído com sucesso' });
    }
  });
});

app.get('/api/appointments', (req, res) => {
  db.query('SELECT * FROM appointments', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar agendamentos' });
    } else {
      res.json(results);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
