import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: config.api_url,
    }),
    endpoints: (build) => ({
        getTransactions: build.query({
            query: ({ wallet_id }) => ({
                url: `/rtsp/api/transactions/${wallet_id}`
            }),
            transformResponse: (response) => {
                console.log("Transaction API Response: ", response);
                return response;
            },
        }),
    })
});

export const  { useGetTransactionsQuery } = transactionApi;