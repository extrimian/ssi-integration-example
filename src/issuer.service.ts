import { Injectable } from '@nestjs/common';
import { DataStorageService } from './data-storage.service';
import { APISSIService } from './api-ssi.service';

import issuerStyles from "./issuer-styles.json";
import outputDescriptors from "./output-descriptor.json";

@Injectable()
export class IssuerService {
  did: string;

  constructor(private dataStorageService: DataStorageService,
    private apiSSIService: APISSIService) {

  }

  async initialize() {
    let did = await this.dataStorageService.getDID();

    if (!did) {
      did = (await this.apiSSIService.createDID()).did;
      this.dataStorageService.saveDID(did);
    }

    this.did = did;
  }

  async createInvitationCode(params: CreateCredentialPayload) {
    const credential = this.getCredential(params);

    const result = {
      did: this.did,
      oneTimeUse: false,
      vc: credential,
      outputDescriptor: outputDescriptors,
      issuer: issuerStyles,
    }

    return await this.apiSSIService.getIssuanceInvitationCode(result);
  }

  getCredential(params: CreateCredentialPayload) {
    return {
      "@context": [
        "https://w3id.org/security/bbs/v1",
        "https://www.w3.org/2018/credentials/v1",
        "https://contextvc.blob.core.windows.net/v100/passport.json"
      ],
      id: (new Date().getTime()).toString(),
      type: ["VerifiableCredential", "TuristCredential"],
      issuer: {
        id: this.did,
        name: "Ministerio de Turismo"
      },
      issuanceDate: (new Date()).toString(),
      expirationDate: params.validTo,
      credentialSubject: {
        name: params.name,
        passport: params.passportNumber,
        period: `${params.validFrom} - ${params.validTo}`
      }
    };
  }
}

export class CreateCredentialPayload {
  name: string;
  passportNumber: string;
  validFrom: string;
  validTo: string;
}