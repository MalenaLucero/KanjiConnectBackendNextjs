import pool from '../../../lib/postgre';

export default async (req: any, res: any) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM persons');
    const users = result.rows;

    client.release();

    res.status(200).json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};