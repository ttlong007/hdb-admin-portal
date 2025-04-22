export interface Routes {
    masterMerchant: string;
    masterMerchantDetail: string;
    editMasterMerchant: string;
    merchant: string;
    createMerchant: string;
    merchantDetail: string;
    editMerchant: string;
    staff: string;
    staffDetail: string;
    createStaff: string;
    editStaff: string;
    transaction: string;
    transactionDetail: string;
    unauthorize: string;
}

export const routes: Routes = {
    masterMerchant: '/master-merchants',
    masterMerchantDetail: '/master-merchants/:id',
    editMasterMerchant: '/master-merchants/:id/edit',
    merchant: '/merchants',
    createMerchant: '/merchants/create-merchant',
    merchantDetail: '/merchants/:id',
    editMerchant: '/merchants/:id/edit',
    staff: '/staffs',
    staffDetail: '/staffs/:id',
    createStaff: '/staffs/create',
    editStaff: '/staffs/:id/edit',
    transaction: '/transactions',
    transactionDetail: '/transactions/:transactionId',
    unauthorize: '/unauthorize',
};
