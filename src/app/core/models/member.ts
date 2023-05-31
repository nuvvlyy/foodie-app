
export interface Member {
    id: number;
    nickName: string;
    firstNameTH: string;
    lastNameTH: string;
    firstNameEN: string;
    lastNameEN: string;
    phoneNumber: string;
    email: string;
    loyalty: {
        id: string,
        brand: string,
        loyaltyImage: string,
        type: string,
        totalPoint: number,
        endDate: Date,
        isExpired: boolean,
        loyaltyDescription: string
    };
    membership: string;
    birthday: string;
    integralCustomerId: string;
    clientType: string;
    gender: string;
    maritalStatus: string;
}
export type Loyalty = {
    id: string,
    brand: string,
    loyaltyImage: string,
    type: string,
    totalPoint: number,
    endDate: Date,
    isExpired: boolean
};
export type MPLMember = {
    id: string;
    lineUserId: string;
    userName: string;
    password: string;
    firstNameTH: string;
    lastNameTH: string;
    firstNameEN: string;
    lastNameEN: string;
    contactNumber: string;
    brand: string;
    frontUrl: string;
};

export type memberAddress = {
    id: number,
    customerId: number,
    addressName: string,
    contactName: string,
    buildingTypeId: number,
    buildingName: string,
    buildingNo: string,
    tower: string,
    unitNo: string,
    floor: string,
    housingSociety: string,
    houseNo: string,
    companyName: string,
    contactPerson: string,
    contactNumber: string,
    hotelName: string,
    hotelPhoneNo: string,
    roadName: string,
    soi: string,
    subSoi: string,
    district: string,
    subDistrict: string,
    province: string,
    postalCode: string,
    note: string,
    latitude: number,
    longtitude: number,
    zoneId: number,
};
