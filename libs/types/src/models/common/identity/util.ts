export const toCompleteYear = (
  partialYearString: string,
  rnnSexChar: string
) => {
  const is1900s = rnnSexChar == '1' || rnnSexChar == '2';

  return `${is1900s ? '19' : '20'}${partialYearString}`;
};
