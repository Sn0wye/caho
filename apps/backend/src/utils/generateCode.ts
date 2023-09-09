export const generateCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  const randomCharacter = () =>
    characters.charAt(Math.floor(Math.random() * characters.length));
  const randomNumber = () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length));

  return (
    Array.from({ length: 3 }, randomCharacter).join('') +
    Array.from({ length: 3 }, randomNumber).join('')
  );
};
