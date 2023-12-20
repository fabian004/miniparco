import express, { Application } from 'express';
import sequelize from './config/dbConfig';
import parkingRoutes from './routes/parkingRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use('/api/parking', parkingRoutes);

const PORT: number | string = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  sequelize.authenticate()
    .then(() => {
      console.log('Connection to the database has been established successfully.');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}

export default app;
