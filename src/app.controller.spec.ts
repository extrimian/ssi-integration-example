import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsController } from './app.controller';
import { IssuerService } from './issuer.service';

describe('AppController', () => {
  let appController: CredentialsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CredentialsController],
      providers: [IssuerService],
    }).compile();

    appController = app.get<CredentialsController>(CredentialsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
