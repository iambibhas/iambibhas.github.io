// Regenerates the Vande Bharat routes and schedule summaries from vb.txt.
// Existing curated intermediate stops are retained wherever route endpoints match.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../../static/train-to-take");
const read = file => fs.readFileSync(path.join(dataDir, file), "utf8");
const load = (file, declaration) => {
  const context = {};
  vm.createContext(context);
  vm.runInContext(read(file).replace(new RegExp(`^const ${declaration} =`, "m"), `var ${declaration} =`), context, { filename: file });
  return context[declaration];
};

const stations = load("stations.js", "STATIONS");
const previousTrains = load("trains-vande-bharat.js", "TRAINS");
const previousTimings = load("timings.js", "TIMINGS");
const lines = read("vb.txt").split(/\r?\n/);
const recordStarts = lines.map((line, i) => /^\d{4,5}$/.test(line.trim()) && lines[i + 2]?.trim() === "VB" ? i : -1).filter(i => i >= 0);
const timePattern = /^\d{2}:\d{2}$/;
const durationPattern = /^\d+h(?: \d+m)?$/;
const numberPattern = /^\d{4,5}$/;
const records = [];

for (let i = 0; i < recordStarts.length; i++) {
  const start = recordStarts[i];
  const end = recordStarts[i + 1] ?? lines.length;
  const fields = lines.slice(start, end).map(value => value.trim()).filter(Boolean);
  const number = fields[0];
  const name = fields[1];
  if (name.includes("Special Fare") || !name.includes("Vande Bharat Express")) continue;

  const departureIndex = fields.findIndex((value, index) => index > 2 && timePattern.test(value));
  if (departureIndex < 1 || !timePattern.test(fields[departureIndex + 2] ?? "")) {
    throw new Error(`Could not parse schedule for train ${number}`);
  }

  const origin = fields[departureIndex - 1];
  const destination = fields[departureIndex + 1];
  const returnNumber = fields.filter(value => numberPattern.test(value)).at(-1);
  const journey = fields.slice(departureIndex + 3).find(value => durationPattern.test(value));
  const distance = fields.find(value => /^\d+ km$/.test(value));
  const speed = fields.find(value => /^\d+ km\/hr$/.test(value));

  const days = fields.find(value => /^S\s+M\s+T\s+W\s+T\s+F\s+S$/.test(value));
  const classes = fields.find(value => /^(CC|EC|CC Ex|EC Ex)(\s|$)/.test(value));

  if (!returnNumber || returnNumber === number || !journey || !distance || !stations[origin] || !stations[destination]) {
    throw new Error(`Incomplete VB row for train ${number}: ${origin} to ${destination}`);
  }

  records.push({
    number, returnNumber, name, origin, destination,
    departure: fields[departureIndex], arrival: fields[departureIndex + 2], journey,
    km: Number(distance.match(/^\d+/)[0]), halts: Number(fields[departureIndex + 4]),
    speed: speed ? Number(speed.match(/^\d+/)[0]) : null,
    freq: days ? "Daily" : "Check timetable", classes: classes ?? ""
  });
}

const aliases = { SBC: "KSR", UBL: "SSS" };
const normalize = code => aliases[code] ?? code;
const endpointKey = (a, b) => [normalize(a), normalize(b)].sort().join("|");
const previousByEndpoints = new Map();
for (const train of previousTrains) {
  const key = endpointKey(train.stops[0], train.stops.at(-1));
  if (!previousByEndpoints.has(key)) previousByEndpoints.set(key, train);
}

const servicePairs = new Map();
for (const record of records) {
  const key = [record.number, record.returnNumber].sort().join("|");
  if (!servicePairs.has(key)) servicePairs.set(key, record);
}

const trains = [];
const timings = {};
for (const record of servicePairs.values()) {
  const prior = previousByEndpoints.get(endpointKey(record.origin, record.destination));
  let stops = [record.origin, record.destination];
  if (prior) {
    const priorStartsAtOrigin = normalize(prior.stops[0]) === normalize(record.origin);
    const candidate = priorStartsAtOrigin ? prior.stops : prior.stops.slice().reverse();
    if (normalize(candidate[0]) === normalize(record.origin) && normalize(candidate.at(-1)) === normalize(record.destination)) {
      stops = candidate;
    }
  }
  trains.push({ name: record.name, number: `${record.number} / ${record.returnNumber}`, type: "VB", stops });

  for (const number of [record.number, record.returnNumber]) {
    const row = records.find(item => item.number === number);
    if (!row) continue;
    const oldStops = previousTimings[number]?.stops ?? [];
    const stopsWithTimes = oldStops.length && oldStops[0].c === row.origin ? oldStops : [];
    timings[number] = {
      journey: row.journey, km: row.km, freq: row.freq,
      origin: row.origin, destination: row.destination,
      departure: row.departure, arrival: row.arrival,
      halts: row.halts, speed: row.speed, classes: row.classes,
      stops: stopsWithTimes
    };
  }
}

Object.assign(timings, {
  "12051": { journey: "9h 20m", km: null, freq: "Daily service", stops: [] },
  "12052": { journey: "", km: null, freq: "Daily service", stops: [] },
  "12123": { journey: "3h 10m", km: 192, freq: "Daily", stops: [] },
  "12124": { journey: "3h 10m", km: 192, freq: "Daily", stops: [] },
  "18551": { journey: "13h 55m", km: 469, freq: "Daily", stops: [] },
  "18552": { journey: "13h 55m", km: 469, freq: "Daily", stops: [] }
});

const trainSource = `// Generated from vb.txt by tools/train-to-take/update-from-vb.mjs.\n// Intermediate stops are retained from the curated list when endpoint codes match.\nconst TRAINS = ${JSON.stringify(trains, null, 2)};\n`;
const timingSource = `// Generated from vb.txt by tools/train-to-take/update-from-vb.mjs.\n// Vistadome summaries are retained alongside the VB schedules.\n// Terminal schedules and service details are indicative; check the current timetable.\nconst TIMINGS = ${JSON.stringify(timings, null, 2)};\n`;
fs.writeFileSync(path.join(dataDir, "trains-vande-bharat.js"), trainSource);
fs.writeFileSync(path.join(dataDir, "timings.js"), timingSource);
console.log(`Updated ${trains.length} train routes and ${Object.keys(timings).length} train schedules from vb.txt`);
