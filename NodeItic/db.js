const mysql = require('mysql2/promise');

async function createDbConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
      database: 'iticbcn'
    });
    return connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    throw error;
  }
}

module.exports = createDbConnection;
