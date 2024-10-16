import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import articlesHandler from '@/pages/api/articles';

describe('/api/articles', () => {
  test('creates a new article', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        title: 'Test Article',
        content: 'This is a test article',
        plantId: 1,
      },
    });

    await articlesHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title: 'Test Article',
        content: 'This is a test article',
        plantId: 1,
      })
    );
  });
});