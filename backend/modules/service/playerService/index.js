const axios = require("axios");
const fs = require("fs");
const { get } = require("lodash");
const { NHL_API_HOST, SEASONS } = require("../../constants");
const { getQueryResult } = require("../../../database");

const writePath = __dirname.replace("modules/service/playerService", "static/");

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

const formatPlayerData = (json, data, season) => {
  const teams = get(json, "teams", []);
  teams.forEach((team) => {
    const roster = get(team, "roster.roster", []);

    roster.forEach((player) => {
      if (!data[player?.person?.id]) {
        const fullName = player?.person?.fullName ?? "";
        const nameArr = fullName.split(" ");

        data[player?.person?.id] = {
          id: player?.person?.id,
          first_name: nameArr[0],
          last_name: nameArr[1],
          teams_played: {
            [team?.id]: {
              team_id: team?.id,
              season: season,
            },
          },
        };
      } else {
        data[player?.person?.id].teams_played[team?.id] = {
          team_id: team?.id,
          season: season,
        };
      }
    });
  });
};

const savePlayerDataToDB = async () => {
  const result = await getQueryResult(`SELECT COUNT(*) as count FROM players`);

  if (result[0] && !result[0].count) {
    const players = {};

    SEASONS.forEach(async (season, idx) => {
      const fileName = `${writePath}team_${season}.json`;
      if (fs.existsSync(fileName)) {
        const data = await fs.readFileSync(fileName);
        const json = JSON.parse(data.toString());
        formatPlayerData(json, players, season);
      }

      if (idx === SEASONS.length - 1) {
        if (players && !fs.existsSync(`${writePath}/test`)) {
          fs.writeFileSync(`${writePath}/test`, JSON.stringify(players));
        }
      }
    });
  }
};

const runPlayerService = () => {
  saveJsons();
  savePlayerDataToDB();
};

module.exports = {
  runPlayerService,
};
