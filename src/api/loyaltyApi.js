import{ createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../config";

export const loyaltyApi = createApi({
    reducerPath: "loyaltyApi",
    baseQuery: fetchBaseQuery({
        baseUrl: config.api_url
    }),
    endpoints: (build) => ({
        getLoyaltyPrograms: build.query({
            query: ({ merchantID }) => ({
                url: `/merchant/api/ReqGetLoyaltyProgram/${merchantID}/`,
            }),
            transformResponse: (response) => {
                console.log("Loyalty Programs API Response", response);
                return response;
            },
            transformErrorResponse: (errorResponse) => {
                console.error("Loyalty API Error", errorResponse);
                return errorResponse;
            }
        }),
        
        createLoyaltyProgram: build.mutation({
            query: ({form, merchantId}) => ({
                url: `/merchant/api/ReqCreateLoyaltyProgram/${merchantId}/`,
                method: 'POST',
                body: form,
            }),
            transformResponse: (response) => {
                console.log("Loyalty Programs Post API Response", response);
                return response;
            },
        }),
        deactiveLoyaltyProgram: build.mutation({
            query: ({ merchantId }) => ({
                url: `/merchant/api/ReqDeactivateLoyaltyProgram/${merchantId}/`,
                method: 'POST',
                body: {"reason": "not performing well"},
            }),
            transformResponse: (response) => {
                console.log("Loyalty Programs Post API Response", response);
                return response;
            },
        }),
    })
});

export const  { useGetLoyaltyProgramsQuery , useCreateLoyaltyProgramMutation, useDeactiveLoyaltyProgramMutation} = loyaltyApi;