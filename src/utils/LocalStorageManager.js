const LocalStorageManager = {
    setMerchantId: (merchantId) => {
        localStorage.setItem("merchant_id", merchantId);
    },
    getMerchantId: () => {
        return localStorage.getItem("merchant_id");
    },
    setAccountId: (accountId) => {
        localStorage.setItem("account_id", accountId);
    },
    getAccountId: () => {
        return localStorage.getItem("account_id");
    },
    setMCC: (mcc) => {
        localStorage.setItem("mcc", mcc);
    },
    getMCC: () => {
        return localStorage.getItem("mcc");
    },
    setGeo: (geo) => {
        localStorage.setItem("geo", geo);
    },
    getGeo: () => {
        return localStorage.getItem("geo");
    },
    setName: (name) => {
        localStorage.setItem("name", name);
    },
    getName: () => {
        return localStorage.getItem("name");
    },
    setRegistered: (registered) => {
        localStorage.setItem("registered", registered);
    },
    getRegistered: () => {
        return localStorage.getItem("registered");
    },
    setPhoneNo: (phoneNo) => {
        localStorage.setItem("Phone_no", phoneNo);
    },
    getPhoneNo: () => {
        return localStorage.getItem("Phone_no");
    },
    setWalletID: (wallet_id) => {
        localStorage.setItem("wallet_id", wallet_id )
    },
    getWalletID: () => {
        return localStorage.getItem("wallet_id");
    }
};

export default LocalStorageManager;