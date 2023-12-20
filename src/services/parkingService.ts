import Parking from '../models/parkingModel';

interface CreateParkingData {
  name: string;
  spots: number;
  contact: string;
  parkingType: 'public' | 'private' | 'courtesy';
}

interface UpdateParkingData {
  spots?: number;
  contact?: string;
}

export const createParking = async (data: CreateParkingData): Promise<Parking> => {
  return Parking.create(data);
};

export const getAllParkings = async (skip: number, limit: number, order: string): Promise<Parking[]> => {
  return Parking.findAll({
    offset: skip * limit,
    limit: limit,
    order: [[order, 'ASC']]
  });
};

export const updateParking = async (parkingId: string, data: UpdateParkingData): Promise<Parking | null> => {
  const parking = await Parking.findByPk(parkingId);

  if (!parking) throw new Error('Estacionamiento no encontrado');
  if (data.spots !== undefined) parking.spots = data.spots;
  if (data.contact !== undefined) parking.contact = data.contact;

  await parking.save();

  return parking;
};
