"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParkingValidator = void 0;
class PublicParkingValidator {
    validate() {
        return true;
    }
}
class PrivateParkingValidator {
    validate(userType) {
        if (userType !== 'corporate')
            return false;
        const day = new Date().getDay();
        return day >= 1 && day <= 5;
    }
}
class CourtesyParkingValidator {
    validate(userType) {
        if (userType !== 'visitor')
            return false;
        const day = new Date().getDay();
        return day === 0 || day === 6;
    }
}
function getParkingValidator(parkingType) {
    switch (parkingType) {
        case 'public': return new PublicParkingValidator();
        case 'private': return new PrivateParkingValidator();
        case 'courtesy': return new CourtesyParkingValidator();
        default: throw new Error('Invalid parking type');
    }
}
exports.getParkingValidator = getParkingValidator;
