class PublicParkingValidator {
    validate(): boolean {
      return true;  
    }
  }
  
  class PrivateParkingValidator {
    validate(userType: string): boolean {
      if (userType !== 'corporate') return false;
      const day = new Date().getDay();
      return day >= 1 && day <= 5;  
    }
  }
  
  class CourtesyParkingValidator {
    validate(userType: string): boolean {
      if (userType !== 'visitor') return false;
      const day = new Date().getDay();
      return day === 0 || day === 6;
    }
  }
  
  export function getParkingValidator(parkingType: string) {
    switch (parkingType) {
      case 'public': return new PublicParkingValidator();
      case 'private': return new PrivateParkingValidator();
      case 'courtesy': return new CourtesyParkingValidator();
      default: throw new Error('Invalid parking type');
    }
  }
  