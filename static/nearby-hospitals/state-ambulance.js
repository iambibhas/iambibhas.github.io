/** State/UT ambulance & related helplines (NHM Dial 108/102; see nhm.gov.in ERS). */
const NATIONAL_EMERGENCY = [
  { n: "112", label: "All emergencies (national)" },
];

const STATE_AMBULANCE = {
  "Andhra Pradesh": [
    { n: "108", label: "Emergency ambulance" },
    { n: "104", label: "Health helpline" },
  ],
  "Arunachal Pradesh": [{ n: "108", label: "Emergency ambulance" }],
  Assam: [
    { n: "108", label: "Emergency ambulance" },
    { n: "1070", label: "Disaster management" },
  ],
  Bihar: [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Patient transport" },
    { n: "104", label: "Health helpline" },
  ],
  Chhattisgarh: [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Patient transport" },
    { n: "104", label: "Health helpline" },
  ],
  Goa: [{ n: "108", label: "Emergency ambulance" }],
  Gujarat: [
    { n: "108", label: "Emergency ambulance" },
    { n: "1077", label: "Disaster helpline" },
  ],
  Haryana: [
    { n: "108", label: "Emergency ambulance" },
    { n: "104", label: "Health helpline" },
  ],
  "Himachal Pradesh": [
    { n: "108", label: "Emergency ambulance" },
    { n: "1077", label: "Disaster helpline" },
  ],
  Jharkhand: [
    { n: "108", label: "Emergency ambulance" },
    { n: "104", label: "Health helpline" },
  ],
  Karnataka: [
    { n: "108", label: "Emergency ambulance (Arogya Kavacha)" },
    { n: "104", label: "Health helpline" },
  ],
  Kerala: [
    { n: "108", label: "Emergency ambulance" },
    { n: "1070", label: "Disaster management" },
  ],
  "Madhya Pradesh": [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Janani Express / patient transport" },
    { n: "1075", label: "Health helpline" },
  ],
  Maharashtra: [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Patient transport" },
    { n: "104", label: "Health helpline" },
  ],
  Manipur: [{ n: "108", label: "Emergency ambulance" }],
  Meghalaya: [
    { n: "108", label: "Emergency ambulance" },
    { n: "1077", label: "Disaster helpline" },
  ],
  Mizoram: [{ n: "108", label: "Emergency ambulance" }],
  Nagaland: [{ n: "108", label: "Emergency ambulance" }],
  Odisha: [
    { n: "108", label: "Emergency ambulance (EMAS)" },
    { n: "102", label: "Janani Express referral" },
    { n: "104", label: "Health helpline" },
  ],
  Punjab: [
    { n: "108", label: "Emergency ambulance" },
    { n: "104", label: "Health helpline" },
  ],
  Rajasthan: [
    { n: "108", label: "Emergency ambulance" },
    { n: "1077", label: "Disaster helpline" },
  ],
  Sikkim: [{ n: "108", label: "Emergency ambulance" }],
  "Tamil Nadu": [
    { n: "108", label: "Emergency ambulance" },
    { n: "104", label: "Health helpline" },
  ],
  Telangana: [
    { n: "108", label: "Emergency ambulance" },
    { n: "104", label: "Health helpline" },
  ],
  Tripura: [{ n: "108", label: "Emergency ambulance" }],
  "Uttar Pradesh": [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Patient transport" },
    { n: "1070", label: "Disaster management" },
  ],
  Uttarakhand: [
    { n: "108", label: "Emergency ambulance" },
    { n: "1077", label: "Disaster helpline" },
  ],
  "West Bengal": [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Patient transport" },
    { n: "1070", label: "Disaster management" },
  ],
  Delhi: [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Patient transport" },
  ],
  Chandigarh: [{ n: "108", label: "Emergency ambulance" }],
  Puducherry: [{ n: "108", label: "Emergency ambulance" }],
  Ladakh: [{ n: "108", label: "Emergency ambulance" }],
  "Jammu and Kashmir": [{ n: "108", label: "Emergency ambulance" }],
  "Andaman and Nicobar Islands": [{ n: "108", label: "Emergency ambulance" }],
  Dadra: [{ n: "108", label: "Emergency ambulance" }],
  "Daman and Diu": [{ n: "108", label: "Emergency ambulance" }],
  Lakshadweep: [{ n: "108", label: "Emergency ambulance" }],
};

const STATE_ALIASES = {
  "nct of delhi": "Delhi",
  "national capital territory of delhi": "Delhi",
  delhi: "Delhi",
  orissa: "Odisha",
  "dadra and nagar haveli": "Dadra",
  "dadra and nagar haveli and daman and diu": "Dadra",
  "jammu & kashmir": "Jammu and Kashmir",
  "andaman and nicobar": "Andaman and Nicobar Islands",
};

function normalizeStateName(raw) {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  if (STATE_ALIASES[key]) return STATE_ALIASES[key];
  for (const name of Object.keys(STATE_AMBULANCE)) {
    if (name.toLowerCase() === key) return name;
  }
  return raw.trim();
}

function ambulanceForState(stateName) {
  const normalized = normalizeStateName(stateName);
  const stateNums = STATE_AMBULANCE[normalized] || [
    { n: "108", label: "Emergency ambulance" },
    { n: "102", label: "Patient transport" },
  ];
  return {
    stateLabel: normalized || stateName || "Your region",
    numbers: stateNums,
  };
}
