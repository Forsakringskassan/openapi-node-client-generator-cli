import { pingResponse } from "../objects/PingResponse";
import {
    defineMock,
    createResponseByCookie,
} from "@forsakringskassan/apimock-express/helpers";

const cookie = "api-ping";

export default defineMock({
    meta: {
        title: "GET /api/ping",
        method: "GET",
        url: "/api/ping",
    },
    responses: [
        createResponseByCookie(cookie, "slow-response", {
            label: "Slow response",
            status: 202,
            delay: 15000,
            body: pingResponse,
        }),
    ],
    defaultResponse: {
        status: 200,
        body: pingResponse,
    },
});
