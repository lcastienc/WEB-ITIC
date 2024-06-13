const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const createDbConnection = require('./db'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const secretKey = 'fldsmdfr';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Las imágenes se guardarán aquí
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware para verificar el token y el rol de administrador
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token no válido' });
    }
    req.user = user;
    next();
  });
};

const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado, no eres administrador' });
  }
  next();
};

// Ruta de registro para alumnos 
app.post('/register/alumno', [
  authenticateToken,
  checkAdminRole,
  check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  check('apellidos').notEmpty().withMessage('Apellidos son obligatorios'),
  check('email').custom(email => /^2023_[a-zA-Z]+[a-zA-Z]*@iticbcn\.cat$/.test(email)).withMessage('Email no válido para alumno'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, apellidos, email, password } = req.body;

  try {
    const connection = await createDbConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      'INSERT INTO usuarios (nombre, apellidos, email, password, fotoPerfil, rol) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, email, hashedPassword, null, 'alumno']
    );
    await connection.end(); // Cerrar la conexión a la base de datos
    res.status(201).json({ message: 'Alumno registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar alumno:', error);
    res.status(500).json({ error: 'Error al registrar alumno' });
  }
});

// Ruta de registro para profesores 
app.post('/register/profesor', [
  authenticateToken,
  checkAdminRole,
  check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  check('apellidos').notEmpty().withMessage('Apellidos son obligatorios'),
  check('email').custom(email => /^[a-zA-Z]+[a-zA-Z]*@iticbcn\.cat$/.test(email)).withMessage('Email no válido para profesor'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, apellidos, email, password } = req.body;

  try {
    const connection = await createDbConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      'INSERT INTO profesores (nombre, apellidos, email, password, fotoPerfil, rol) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, email, hashedPassword, null, 'profesor']
    );
    await connection.end(); // Cerrar la conexión a la base de datos
    res.status(201).json({ message: 'Profesor registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar profesor:', error);
    res.status(500).json({ error: 'Error al registrar profesor' });
  }
});

// Ruta de registro para admins 
app.post('/register/admin', [
  authenticateToken,
  checkAdminRole,
  check('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  check('apellidos').notEmpty().withMessage('Apellidos son obligatorios'),
  check('email').custom(email => /^admin_[a-zA-Z]+[a-zA-Z]*@iticbcn\.cat$/.test(email)).withMessage('Email no válido para admin'),
  check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, apellidos, email, password } = req.body;

  try {
    const connection = await createDbConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      'INSERT INTO admins (nombre, apellidos, email, password, fotoPerfil, rol) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, email, hashedPassword, null, 'admin']
    );
    await connection.end(); // Cerrar la conexión a la base de datos
    res.status(201).json({ message: 'Admin registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar admin:', error);
    res.status(500).json({ error: 'Error al registrar admin' });
  }
});

// Ruta de login
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
      'SELECT * FROM usuarios WHERE email = ? UNION SELECT * FROM profesores WHERE email = ? UNION SELECT * FROM admins WHERE email = ?',
      [email, email, email]
    );

    if (rows.length === 0) {
      await connection.end(); 
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await connection.end();
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.rol }, secretKey, { expiresIn: '1h' });
    await connection.end(); 
    res.status(200).json({ message: 'Inicio de sesión exitoso', token: token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta para verificar el token
app.post('/verifyToken', authenticateToken, (req, res) => {
  const { userId, role } = req.user;
  res.status(200).json({ valid: true, role: role });
});

// Ruta para obtener los datos del usuario
app.get('/user', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const connection = await createDbConnection();
    let query;
    let params = [userId];

    if (req.user.role === 'alumno') {
      query = 'SELECT nombre, apellidos, email, fotoPerfil, "alumno" as rol FROM usuarios WHERE id = ?';
    } else if (req.user.role === 'profesor') {
      query = 'SELECT nombre, apellidos, email, fotoPerfil, "profesor" as rol FROM profesores WHERE id = ?';
    } else {
      query = 'SELECT nombre, apellidos, email, fotoPerfil, "admin" as rol FROM admins WHERE id = ?';
    }

    const [rows] = await connection.execute(query, params);
    await connection.end();
    if (rows.length > 0) {
      const user = rows[0];
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});



// Ruta para actualizar el perfil del usuario
app.put('/user', [authenticateToken, upload.single('fotoPerfil')], async (req, res) => {
  const { userId } = req.user;
  const { nombre, apellidos, removeFotoPerfil } = req.body;

  let fotoPerfil;
  if (req.file) {
    fotoPerfil = `/uploads/${req.file.filename}`;
  } else if (removeFotoPerfil === 'true') {
    fotoPerfil = null;
  } else {
    const connection = await createDbConnection();
    let query;

    if (req.user.role === 'alumno') {
      query = 'SELECT fotoPerfil FROM usuarios WHERE id = ?';
    } else if (req.user.role === 'profesor') {
      query = 'SELECT fotoPerfil FROM profesores WHERE id = ?';
    } else {
      query = 'SELECT fotoPerfil FROM admins WHERE id = ?';
    }

    const [rows] = await connection.execute(query, [userId]);
    await connection.end();

    if (rows.length > 0) {
      fotoPerfil = rows[0].fotoPerfil;
    }
  }

  try {
    const connection = await createDbConnection();
    let query;
    let params;

    if (req.user.role === 'alumno') {
      query = 'UPDATE usuarios SET nombre = ?, apellidos = ?, fotoPerfil = ? WHERE id = ?';
      params = [nombre, apellidos, fotoPerfil, userId];
    } else if (req.user.role === 'profesor') {
      query = 'UPDATE profesores SET nombre = ?, apellidos = ?, fotoPerfil = ? WHERE id = ?';
      params = [nombre, apellidos, fotoPerfil, userId];
    } else {
      query = 'UPDATE admins SET nombre = ?, apellidos = ?, fotoPerfil = ? WHERE id = ?';
      params = [nombre, apellidos, fotoPerfil, userId];
    }

    await connection.execute(query, params);
    await connection.end();

    res.status(200).json({ message: 'Perfil actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error);
    res.status(500).json({ error: 'Error al actualizar datos del usuario' });
  }
});

// Ruta protegida de ejemplo
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Acceso permitido a la ruta protegida', user: req.user });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
