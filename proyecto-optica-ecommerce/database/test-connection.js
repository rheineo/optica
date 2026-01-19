const { Client } = require('pg');

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'postgres123',
  database: 'optica_db',
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Conexión exitosa a PostgreSQL!');
    const res = await client.query('SELECT NOW()');
    console.log('Hora del servidor:', res.rows[0].now);
    await client.end();
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }
}

test();
