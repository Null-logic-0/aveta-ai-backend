import { DataSource } from 'typeorm';
import { PostgresMgration1754477706615 } from './src/migrations/1754477706615-postgres-mgration';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1919',
  database: 'aveta',
  entities: ['**/*.entity.js'],
  migrations: [PostgresMgration1754477706615],
});
