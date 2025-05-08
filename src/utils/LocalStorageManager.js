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
};

export default LocalStorageManager;