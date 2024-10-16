import { UnauthorizedError } from './errors';
import prisma from './prisma';

export async function checkUserBanStatus(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isBanned: true, banExpiresAt: true },
  });

  if (user?.isBanned) {
    if (user.banExpiresAt && user.banExpiresAt <= new Date()) {
      await prisma.user.update({
        where: { id: userId },
        data: { isBanned: false, banExpiresAt: null },
      });
    } else {
      throw new UnauthorizedError('User is banned');
    }
  }
}