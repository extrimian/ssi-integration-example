import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class APISSIService {
    baseUrl = "https://sandbox-ssi.extrimian.com/v1";
    ws = "https://sandbox-ssi-ws.extrimian.com/";
    webhook = "https://363e-181-231-217-21.ngrok-free.app";

    constructor() {

    }

    async createDID(): Promise<{ did: string }> {
        const result = await axios.put(`${this.baseUrl}/dids/quarkid`, {
            websocket: this.ws,
            webhookURL: this.webhook,
            didMethod: "did:quarkid"
        });

        return {
            did: result.data.did,
        };
    }

    async getIssuanceInvitationCode(body: any): Promise<{
        invitationId: string,
        oobContentData: string
    }> {
        const result = await axios.put(`${this.baseUrl}/credentialsbbs/wacioob`, body);
        return result.data;
    }
}