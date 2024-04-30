import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import * as request from 'supertest';

describe('Idempotency', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('has to drop duplicate requests', async () => {
    const responses = await Promise.all([
      request(app.getHttpServer()).post('/idempotency/test'),
      request(app.getHttpServer()).post('/idempotency/test'),
      request(app.getHttpServer()).post('/idempotency/test'),
      request(app.getHttpServer()).post('/idempotency/test'),
      request(app.getHttpServer()).post('/idempotency/test'),
    ]);

    const created = responses.filter((response) => response.status == 201);
    expect(created.length).toBe(1);
  });
});
