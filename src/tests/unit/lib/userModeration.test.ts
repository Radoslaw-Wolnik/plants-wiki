import { checkUserBanStatus } from '@/lib/userModeration';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

describe('userModeration', () => {
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    (PrismaClient as jest.Mock).mockImplementation(() => prisma);
  });

  it('throws an error if user is banned', async () => {
    prisma.user.findUnique.mockResolvedValue({ isBanned: true, banExpiresAt: null });

    await expect(checkUserBanStatus(1)).rejects.toThrow('User is banned');
  });

  it('does not throw an error if user is not banned', async () => {
    prisma.user.findUnique.mockResolvedValue({ isBanned: false, banExpiresAt: null });

    await expect(checkUserBanStatus(1)).resolves.not.toThrow();
  });
});