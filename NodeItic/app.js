const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const createDbConnection = require('./db');
const { check, validationResult } = require('express-validator');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const secretKey = 'fldsmdfr';

// Ruta de registro
app.post('/register', [
  check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  check('apellidos').notEmpty().withMessage('Apellidos son obligatorios'),
  check('email').isEmail().withMessage('Email no válido'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, apellidos, email, password } = req.body;

  try {
    const connection = await createDbConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      'INSERT INTO usuarios (nombre, apellidos, email, password) VALUES (?, ?, ?, ?)',
      [nombre, apellidos, email, hashedPassword]
    );
    connection.end(); // Cerrar la conexión a la base de datos
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta de inicio de sesión
app.post('/login', [
  check('email').isEmail().withMessage('Email no válido'),
  check('password').notEmpty().withMessage('Contraseña es obligatoria')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const connection = await createDbConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      connection.end(); // Cerrar la conexión a la base de datos
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      connection.end(); // Cerrar la conexión a la base de datos
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    connection.end(); // Cerrar la conexión a la base de datos
    res.status(200).json({ message: 'Inicio de sesión exitoso', token: token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});




app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).send('Internal Server Error');
});

// Ruta para verificar el token
app.post('/verifyToken', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('Token no proporcionado');
    return res.status(401).json({ valid: false, error: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('Token no válido:', err);
      return res.status(401).json({ valid: false, error: 'Token no válido' });
    }

    console.log('Token verificado:', decoded);
    res.status(200).json({ valid: true });
  });
});



// Ruta protegida que requiere autenticación
app.get('/protected', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token no válido' });
    }

    res.status(200).json({ message: 'Acceso permitido a la ruta protegida', user: decoded });
  });
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
