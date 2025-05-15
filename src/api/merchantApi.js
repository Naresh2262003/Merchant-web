import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const merchantApi = createApi({
    reducerPath: "merchantApi",
    baseQuery: fetchBaseQuery({
        baseUrl: config.api_url,
        prepareHeaders: (headers, { getState }) => { // Assuming you have a token stored in the auth state
            headers.set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMmtTb211WGVCSVhHS2duUVNvZEZKc2QzWEhmIiwiYXVkIjpbIm9yZ18ya1NvbjJHTmRraTlLZ2F4RTFvTmJYM2hlMEUiXSwicGVybSI6bnVsbH0.tYWwAahCelDULHkK2NNK56jf4Xa0yO11RAx_E2dD1y8`);
            return headers;
        },
    }),
    endpoints: (build) => ({
        getMerchants: build.query({
            query:({ merchantID}) => ({
                url: `admin/api/merchants`,
                params: { merchantID }
            }),
            transformResponse: (response) => {
                console.log("Merchant API Response: ", response);
                return response;
            },
        })
    })
});

export const { useGetMerchantsQuery } = merchantApi;