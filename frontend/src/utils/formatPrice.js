/**
 * Formats a number as Pakistani Rupees
 * formatPrice(1500)   → "Rs. 1,500"
 * formatPrice(250.5)  → "Rs. 251"
 * formatPrice(0)      → "Rs. 0"
 */
const formatPrice = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "Rs. 0";

  return (
    "Rs. " +
    Math.round(amount).toLocaleString("en-PK")
  );
};

export default formatPrice;