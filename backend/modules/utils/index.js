const generateRandomID = () => {
  // Generate a random 16-character hexadecimal string.
  const randomId = Math.random().toString(16).substring(2);

  // Return the random ID.
  return randomId;
};

const getCurDate = () => {
  return new Date().toJSON().slice(0, 19).replace("T", " ");
};

module.exports = { generateRandomID, getCurDate };
