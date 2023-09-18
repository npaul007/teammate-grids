const generateRandomID = (length) => {
  let randomID = "";

  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    randomID += randomNumber;
  }

  return randomID;
};

module.exports = { generateRandomID };
