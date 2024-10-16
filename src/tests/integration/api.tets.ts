import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/plants/[id]';

describe('Plant API integration', () => {
  test('creates a plant and retrieves it', async () => {
    // Create a plant
    const { req: postReq, res: postRes } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        name: 'Test Plant',
        scientificName: 'Testus plantus',
        care: 'Water daily',
      },
    });

    await handler(postReq, postRes);
    expect(postRes._getStatusCode()).toBe(201);
    const createdPlant = JSON.parse(postRes._getData());

    // Retrieve the created plant
    const { req: getReq, res: getRes } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: createdPlant.id.toString() },
    });

    await handler(getReq, getRes);
    expect(getRes._getStatusCode()).toBe(200);
    expect(JSON.parse(getRes._getData())).toEqual(createdPlant);
  });
});