import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import usersHandler from '@/pages/api/users';

describe('/api/users', () => {
  test('retrieves user profile', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: '1' },
    });

    await usersHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: 1,
        username: expect.any(String),
        email: expect.any(String),
      })
    );
  });
});