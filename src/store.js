import { configureStore } from "@reduxjs/toolkit";
// import { merchantApi } from "./api/merchantApi";
import { loyaltyApi } from "./api/loyaltyApi";
import { transactionApi } from "./api/transactionApi";
import { merchantApi } from "./api/merchantApi";
// import { ruleApi } from "./api/ruleApi";
// import { filesApi } from "./api/filesApi";

const store = configureStore({
    reducer: {
        [loyaltyApi.reducerPath]: loyaltyApi.reducer,
        [transactionApi.reducerPath]: transactionApi.reducer,
        [merchantApi.reducerPath]: merchantApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(
                loyaltyApi.middleware,
                transactionApi.middleware,
                merchantApi.middleware,
            )
});

export default store;