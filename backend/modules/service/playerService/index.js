const axios = require("axios");
const fs = require("fs");
const { NHL_API_HOST, SEASONS } = require("../../constants");

const fetchJson = async (season) => {
  try {
    const response = await axios.get(
      `${NHL_API_HOST}teams?expand=team.roster&season=${season}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Failed to get resource due to error", error);
  }

  return null;
};

const saveJsons = async () => {
  try {
    const writePath = __dirname.replace(
      "modules/service/playerService",
      "static/"
    );
    SEASONS.forEach(async (season) => {
      const response = await fetchJson(season);
      const { data } = response;
      const fileName = `${writePath}team_${season}.json`;
      if (data && !fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, JSON.stringify(data));
      }
    });
  } catch (error) {
    console.log("Failed to save jsons due to error", error);
  }
};

const runPlayerService = () => {
  saveJsons();
};

module.exports = {
  runPlayerService,
};
