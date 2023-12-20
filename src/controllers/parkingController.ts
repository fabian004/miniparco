import { Request, Response } from 'express';
import * as parkingService from '../services/parkingService';
import { getParkingValidator } from '../utils/parkingValidationFactory';
import Parking from '../models/parkingModel';

export const createParking = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const { name, spots } = req.body;
    if (spots < 50) throw new Error('Parking is too small')
    if (spots > 1500) throw new Error('Parking is too big')


    const existingParking = await Parking.findOne({ where: { name } });
    if (existingParking) {
      throw new Error('Duplicated name');
    }

    const parking = await parkingService.createParking(req.body);
    res.status(201).json(parking);
  } catch (error) {
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred 2' });
    }
  }
};
export const getAllParkings = async (req: Request, res: Response): Promise<void> => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const order = req.query.order as string || 'name';

    const parkings = await parkingService.getAllParkings(skip, limit, order);
    res.json(parkings);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateParking = async (req: Request, res: Response): Promise<void> => {
  try {
    const parkingId = req.params.id;
    const { spots, contact } = req.body;

    if (spots < 50) throw new Error('Parking is too small')
    if (spots > 1500) throw new Error('Parking is too big')

    const updatedParking = await parkingService.updateParking(parkingId, { spots, contact });
    res.json(updatedParking);
  } catch (error) {
    if (error instanceof Error) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { parkingId, userType } = req.body;
    const parking = await Parking.findByPk(parkingId);

    if (!parking) {
      res.status(404).json({ message: "Parking not found" });
      return;
    }

    const validator = getParkingValidator(parking.parkingType);
    const isValid = validator.validate(userType);

    if (!isValid) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.status(200).json({ message: "Access granted" });
  } catch (error) {
    res.status(500).json({ message: "error in Check In" });
  }
};