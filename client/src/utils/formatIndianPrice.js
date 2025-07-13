export const formatIndianPrice = (price) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2, // ✅ allow up to 2 decimals
  });

  const trimZeros = (str) => str.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");

  if (price >= 1e7) {
    return `${trimZeros(formatter.format(price / 1e7))} Crore`;
  } else if (price >= 1e5) {
    return `${trimZeros(formatter.format(price / 1e5))} Lakh`;
  }
  return `₹${formatter.format(price)}`;
};
export default formatIndianPrice;
