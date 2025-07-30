import crypto from 'crypto';

export const generateCompliantPassword = (length = 15) => {
  if (length < 8 || length > 64) {
    throw new Error('Password length must be between 8 and 64 characters.');
  }

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const all = upper + lower + digits;

  const passwordChars = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
  ];

  while (passwordChars.length < length) {
    const randomByte = crypto.randomBytes(1)[0];
    passwordChars.push(all[randomByte % all.length]);
  }

  const password = passwordChars.sort(() => Math.random() - 0.5).join('');

  return password;
};
