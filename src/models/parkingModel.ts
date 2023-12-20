import { DataTypes, Model, UUIDV4 } from 'sequelize';
import sequelize from '../config/dbConfig';

interface ParkingAttributes {
  id?: string;
  name: string;
  spots: number;
  contact: string;
  parkingType: 'public' | 'private' | 'courtesy';
  createdAt?: Date;
  updatedAt?: Date;
}

class Parking extends Model<ParkingAttributes> implements ParkingAttributes {
  public id!: string;
  public name!: string;
  public spots!: number;
  public contact!: string;
  public parkingType!: 'public' | 'private' | 'courtesy';
  public createdAt!: Date;
  public updatedAt!: Date;
}

Parking.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  spots: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parkingType: {
    type: DataTypes.ENUM('public', 'private', 'courtesy'),
    allowNull: false,
    field: 'parking_type' 
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'  // Define el nombre real de la columna en la base de datos
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at'  // Define el nombre real de la columna en la base de datos
  }
  
}, {
  sequelize,
  tableName: 'parkings'
});

export default Parking;