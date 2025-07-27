const fs = require("fs");
const { exec } = require("child_process");
const VoiceModel = require("../models/Voice");
const { stderr, stdout } = require("process");

const parseVoices = (voices_text) => {
  const lines = voices_text.trim().split("\n").slice(2);

  return lines.map((line) => {
    const [name, gender, categories, personalities] = line.trim().split(/\s{2,}/);
    return { name, gender, categories, personalities };
  });
};

const fetchVoiceListFromEdge = async () => {
  exec("edge-tts --list-voices", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    const lines = parseVoices(stdout);

    const ops = lines.map((line) => ({
      updateOne: {
        filter: { name: line.name },
        update: {
          $set: {
            gender: line.gender,
            categories: line.categories,
            personalities: line.personalities,
          },
        },
        upsert: true,
      },
    }));

    VoiceModel.bulkWrite(ops);

    console.log("Voice list saved to voices_list.json");
  });
};

const generateVoice = (voice_name, text, username) => {
  const folderPath = "./storage";

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const fileName = `voice-${username}-${Date.now()}.mp3`;
  const filePath = `${folderPath}/${fileName}`;
  const commandExec = `edge-tts --voice "${voice_name}" --text "${text}" --write-media "${filePath}"`;

  exec(commandExec, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    console.log("Voice file created:", fileName);
  });

  return fileName;
};
module.exports = { fetchVoiceListFromEdge, generateVoice };