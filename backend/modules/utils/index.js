const generateRandomID = (length) => {
  let randomID = "";

  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    randomID += randomNumber;
  }

  return randomID;
};

const getCurDate = () => {
  return new Date().toJSON().slice(0, 19).replace("T", " ");
};

module.exports = { generateRandomID, getCurDate };
