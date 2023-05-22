const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: 'walter',
  host: 'localhost',
  database: 'bd_usuario',
  password: 'devwps2023',
  port: 5432,
});

// Middleware para permitir el uso de JSON en las solicitudes
app.use(express.json());

// Endpoint para crear un usuario
app.post('/usuarios', async (req, res) => {
  const { nombre, edad } = req.body;
  
  try {
    const client = await pool.connect();
    const query = 'INSERT INTO usuarios (nombre, edad) VALUES ($1, $2) RETURNING *';
    const values = [nombre, edad];
    const result = await client.query(query, values);
    const createdUser = result.rows[0];
    client.release();
    
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Endpoint para listar a todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM usuarios';
    const result = await client.query(query);
    const users = result.rows;
    client.release();
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Endpoint para obtener un usuario específico por ID
app.get('/usuarios/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM usuarios WHERE id = $1';
    const values = [id_usuario];
    const result = await client.query(query, values);
    const user = result.rows[0];
    client.release();
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Endpoint para actualizar los datos de un usuario
app.put('/usuarios/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, edad } = req.body;
  
  try {
    const client = await pool.connect();
    const query = 'UPDATE usuarios SET nombre = $1, edad = $2 WHERE id = $3 RETURNING *';
    const values = [nombre, edad, id_usuario];
    const result = await client.query(query, values);
    const updatedUser = result.rows[0];
    client.release();
    
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Endpoint para eliminar un usuario
app.delete('/usuarios/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;
  
  try {
    const client = await pool.connect();
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
    const values = [id_usuario];
    const result = await client.query(query, values);
    const deletedUser = result.rows[0];
    client.release();
    
    if (deletedUser) {
      res.json(deletedUser);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Endpoint para mostrar el promedio de edades de los usuarios
app.get('/usuarios/promedio-edad', async (req, res) => {
  try {
    const client = await pool.connect();
    const query = 'SELECT AVG(edad) AS promedio_edad FROM usuarios';
    const result = await client.query(query);
    const { promedio_edad } = result.rows[0];
    client.release();
    
    res.json({ promedio_edad });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el promedio de edades' });
  }
});

// Endpoint para mostrar la versión del API REST
app.get('/estado', (req, res) => {
  res.json({ version: '1.0.0' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);