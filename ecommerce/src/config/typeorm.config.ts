import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as mysql from 'mysql2/promise';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'ecommerce_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};

export const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: typeOrmConfig.host as string,
    port: typeOrmConfig.port as number,
    user: typeOrmConfig.username as string,
    password: typeOrmConfig.password as string,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${typeOrmConfig.database}`
    );
    console.log(`Database ${typeOrmConfig.database} created or verified.`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await connection.end();
  }
};