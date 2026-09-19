/** Curated sites: publicly visitable, mappable, built before 1950. */
const HERITAGE_SITES = [
  {
    id: "begur-nageshwara",
    name: "Begur Nageshwara (Nageshvara) Temple",
    lat: 12.8779,
    lng: 77.6321,
    builtYear: 890,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Among the oldest dated temples in Bengaluru Urban district; a 9th-century Nagara inscription records a battle fought here.",
    visitNotes: "Active temple in Begur; open for darshan during usual temple hours.",
    sources: [
      {
        label: "Wikipedia — Nageshvara Temple, Begur",
        url: "https://en.wikipedia.org/wiki/Nageshvara_Temple,_Begur",
      },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Nageshvara_Temple,_Begur",
  },
  {
    id: "gavi-gangadhareshwara",
    name: "Gavi Gangadhareshwara Temple",
    lat: 12.9488,
    lng: 77.561,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Rock-cut cave shrine dedicated to Shiva; associated with Kempe Gowda-era renovations and the famous solar alignment on Makara Sankranti.",
    visitNotes: "Cave temple in Gavipuram; accessible to visitors (donations/common dress codes apply).",
    sources: [{ label: "Karnataka Tourism", url: "https://karnatakatourism.org/" }],
    wikipedia: "https://en.wikipedia.org/wiki/Gavi_Gangadhareshwara_Temple",
  },
  {
    id: "domlur-chokkanathaswamy",
    name: "Chokkanathaswamy Temple (Domlur)",
    lat: 12.9624,
    lng: 77.6351,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Chola-period Vishnu temple with inscriptions; one of the oldest standing temples within modern Bengaluru city limits.",
    visitNotes: "Active temple in Domlur; visitor access during temple hours.",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Domlur_Chokkanathaswamy_temple",
      },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Domlur_Chokkanathaswamy_temple",
  },
  {
    id: "ulsoor-someshwara",
    name: "Halasuru Someshwara Temple",
    lat: 12.9789,
    lng: 77.621,
    builtYear: 1150,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Dravidian Shiva temple traditionally linked to the Chola period, later expanded under Vijayanagara patronage.",
    visitNotes: "Major active temple near Ulsoor Lake; open to devotees and visitors.",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Halasuru_Someshwara_Temple,_Bangalore",
      },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Halasuru_Someshwara_Temple,_Bangalore",
  },
  {
    id: "madivala-someshwara",
    name: "Madivala Someshwara Temple",
    lat: 12.9245,
    lng: 77.6125,
    builtYear: 1200,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Medieval Shiva temple with Chola-era epigraphy near the ancient Madivala tank.",
    visitNotes: "Active neighbourhood temple; accessible during puja hours.",
    sources: [
      { label: "Wikipedia — Madivala", url: "https://en.wikipedia.org/wiki/Madivala" },
    ],
  },
  {
    id: "mukthi-natheshwara",
    name: "Mukthi Natheshwara Temple (Binnamangala)",
    lat: 13.055,
    lng: 77.717,
    builtYear: 1000,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Small Chola-period temple near Nandi Hills foothills; noted for early medieval sculpture and inscriptions.",
    visitNotes: "Rural shrine north-east of the city; reachable by road, active worship continues.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Mukthi_Natheshwara_Temple" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Mukthi_Natheshwara_Temple",
  },
  {
    id: "bull-temple",
    name: "Dodda Basavana Gudi (Bull Temple)",
    lat: 12.9419,
    lng: 77.5674,
    builtYear: 1537,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Kempe Gowda I’s monolithic Nandi and Dravidian temple in Basavanagudi, tied to the origin story of Bengaluru’s name.",
    visitNotes: "Iconic city landmark; ticketed/monitored access; busy on weekends.",
    sources: [{ label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bull_Temple" }],
    wikipedia: "https://en.wikipedia.org/wiki/Bull_Temple",
  },
  {
    id: "bangalore-fort",
    name: "Bangalore Fort (Kempe Gowda / Tipu remnants)",
    lat: 12.9628,
    lng: 77.5774,
    builtYear: 1537,
    era: "vijayanagara_kempegowda",
    kind: "fort",
    summary:
      "Originally mud fort of Kempe Gowda I; rebuilt in stone by Hyder Ali and Tipu. British siege of 1791 left only fragments, including Delhi Gate.",
    visitNotes: "ASI-protected ruins beside Kote Venkataramana; walk-in during daylight hours.",
    sources: [{ label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bangalore_Fort" }],
    wikipedia: "https://en.wikipedia.org/wiki/Bangalore_Fort",
  },
  {
    id: "kote-venkataramana",
    name: "Kote Venkataramana Temple",
    lat: 12.9595,
    lng: 77.577,
    builtYear: 1689,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Vijayanagara-style temple beside the fort, built by the Wodeyars of Mysore for the garrison community.",
    visitNotes: "Active temple inside the old pete; visitors welcome outside ritual peaks.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Kote_Venkataramana_Temple" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Kote_Venkataramana_Temple",
  },
  {
    id: "tipu-summer-palace",
    name: "Tipu Sultan's Summer Palace",
    lat: 12.9592,
    lng: 77.5734,
    builtYear: 1791,
    era: "tipu_late_medieval",
    kind: "palace",
    summary:
      "Teak palace in the Bangalore Pete with Indo-Islamic arches and frescoes; served as Tipu’s durbar hall until his death in 1799.",
    visitNotes: "ASI ticketed monument; open Tue–Sun, closed Mondays.",
    sources: [{ label: "ASI Bengaluru Circle", url: "https://asi.nic.in/" }],
    wikipedia: "https://en.wikipedia.org/wiki/Tipu_Sultan%27s_Summer_Palace",
  },
  {
    id: "jamia-masjid-bangalore",
    name: "Jamia Masjid (City Market)",
    lat: 12.9708,
    lng: 77.6075,
    builtYear: 1790,
    era: "tipu_late_medieval",
    kind: "mosque",
    summary:
      "Grand mosque raised under Tipu Sultan with ornate minarets in granite; still the principal jama masjid of the old city.",
    visitNotes: "Active mosque; non-Muslim visitors should avoid prayer times and dress modestly.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Jamia_Masjid,_Bangalore" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Jamia_Masjid,_Bangalore",
  },
  {
    id: "devanahalli-fort",
    name: "Devanahalli Fort",
    lat: 13.2461,
    lng: 77.7067,
    builtYear: 1501,
    era: "vijayanagara_kempegowda",
    kind: "fort",
    summary:
      "Medieval fort near Tipu’s birthplace; mud origins with later stone walls under the Mysore sultans.",
    visitNotes: "Town fort with walkable ramparts; free access; combine with nearby Tipu birthplace memorial.",
    sources: [{ label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Devanahalli_Fort" }],
    wikipedia: "https://en.wikipedia.org/wiki/Devanahalli_Fort",
  },
  {
    id: "nandi-hills-fort",
    name: "Nandi Hills (Tipu’s hill fort)",
    lat: 13.37,
    lng: 77.6833,
    builtYear: 1700,
    era: "tipu_late_medieval",
    kind: "fort",
    summary:
      "Hill fortress used by Tipu Sultan as a summer retreat; British took it in 1791. Walls, gates, and Tipu’s Drop remain.",
    visitNotes: "Karnataka forest department park; day visit ticket; roads open daytime hours.",
    sources: [
      { label: "Wikipedia — Nandi Hills", url: "https://en.wikipedia.org/wiki/Nandi_Hills,_India" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Nandi_Hills,_India",
  },
  {
    id: "savandurga",
    name: "Savandurga (fort hill)",
    lat: 12.919,
    lng: 77.23,
    builtYear: 1600,
    era: "vijayanagara_kempegowda",
    kind: "fort",
    summary:
      "Monolithic hill fort of the Magadi rulers, later contested by Mysore and the British; ruins of walls and gateways on the summit trail.",
    visitNotes: "Popular trekking hill ~60 km west; start early; carry water; no ticket for hill access.",
    sources: [{ label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Savandurga" }],
    wikipedia: "https://en.wikipedia.org/wiki/Savandurga",
  },
  {
    id: "shivagange",
    name: "Shivagange (hill temple & fort)",
    lat: 13.023,
    lng: 77.225,
    builtYear: 1600,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Sacred granite hill with Olakala Teertha, Shiva shrines, and medieval fortifications linked to local chieftains.",
    visitNotes: "Pilgrimage hill north-west of Bengaluru; steep climb; temple open daytime.",
    sources: [{ label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Shivagange" }],
    wikipedia: "https://en.wikipedia.org/wiki/Shivagange",
  },
  {
    id: "st-marys-basilica",
    name: "St. Mary's Basilica",
    lat: 12.9844,
    lng: 77.6011,
    builtYear: 1882,
    era: "british",
    kind: "church",
    summary:
      "Gothic revival basilica in Shivajinagar; oldest church in Bengaluru, rebuilt in stone during British rule.",
    visitNotes: "Open for mass and heritage visits; respect service times.",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/St._Mary%27s_Basilica,_Bangalore",
      },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/St._Mary%27s_Basilica,_Bangalore",
  },
  {
    id: "bangalore-palace",
    name: "Bangalore Palace",
    lat: 12.9983,
    lng: 77.592,
    builtYear: 1878,
    era: "british",
    kind: "palace",
    summary:
      "Tudor-revival palace of the Wodeyars, constructed during British paramountcy; interiors and grounds open for tours.",
    visitNotes: "Ticketed entry; audio guides available; photography rules apply indoors.",
    sources: [{ label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bangalore_Palace" }],
    wikipedia: "https://en.wikipedia.org/wiki/Bangalore_Palace",
  },
  {
    id: "attara-kacheri",
    name: "Attara Kacheri (High Court)",
    lat: 12.9776,
    lng: 77.5928,
    builtYear: 1867,
    era: "british",
    kind: "heritage_building",
    summary:
      "Neoclassical red public offices facing Cubbon Park; served as the secretariat under British rule before the High Court moved in.",
    visitNotes: "Working court complex; exterior viewing from Cubbon Park side; entry restricted.",
    sources: [{ label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Attara_Kacheri" }],
    wikipedia: "https://en.wikipedia.org/wiki/Attara_Kacheri",
  },
  {
    id: "govt-museum",
    name: "Government Museum (State Museum)",
    lat: 12.9769,
    lng: 77.5966,
    builtYear: 1876,
    era: "british",
    kind: "heritage_building",
    summary:
      "One of India’s oldest museums, housed in colonial-era buildings within Cubbon Park; holds Hoysala and Vijayanagara sculpture.",
    visitNotes: "Ticketed museum; closed Mondays and public holidays.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Karnataka_State_Museum" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Karnataka_State_Museum",
  },
  {
    id: "dharmaraya-swamy",
    name: "Sri Dharmaraya Swamy Temple (Karaga)",
    lat: 12.9654,
    lng: 77.5834,
    builtYear: 1200,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Shrine of the Pandavas and Draupadi in Thigalarapete; over 800 years old and spiritual anchor of the Bengaluru Karaga festival.",
    visitNotes: "Active temple near KR Market; check hours before festivals.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Dharmaraya_Swamy_Temple" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Dharmaraya_Swamy_Temple",
  },
  {
    id: "kaalikaamba-kamatheshwara",
    name: "Kaalikaamba Kamatheshwara Temple (Nagarathpet)",
    lat: 12.9625,
    lng: 77.5788,
    builtYear: 1250,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Medieval Shiva temple in the old pete; listed among Chola-period foundations in central Bengaluru.",
    visitNotes: "Active temple in congested pete lanes; walk-in darshan.",
    sources: [
      {
        label: "Wikipedia — Chola temples in Bengaluru",
        url: "https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore",
      },
    ],
  },
  {
    id: "kengeri-eshwara",
    name: "Sri Eshwara Temple (Kengeri)",
    lat: 12.908,
    lng: 77.484,
    builtYear: 1050,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Chola-era Eshwara shrine on the Arkavathi bank at Kengeri, with inscriptions from the 11th century.",
    visitNotes: "Active temple west of the city; reachable by road and commuter rail.",
    sources: [
      {
        label: "Wikipedia — Chola temples in Bengaluru",
        url: "https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore",
      },
    ],
  },
  {
    id: "kondrahalli-dharmesvara",
    name: "Dharmesvara Temple (Kondrahalli)",
    lat: 12.893,
    lng: 77.748,
    builtYear: 1065,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Remote Chola-period Shiva temple east of the city, noted in epigraphic surveys of Bengaluru Rural.",
    visitNotes: "Village temple; day visit by car; confirm local access on village roads.",
    sources: [
      {
        label: "Wikipedia — Chola temples in Bengaluru",
        url: "https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore",
      },
    ],
  },
  {
    id: "huskur-madduramma",
    name: "Sri Madduramma Temple (Huskur)",
    lat: 12.815,
    lng: 77.695,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "11th-century village goddess temple near the Hosur road corridor, part of the Chola temple corpus around Bengaluru.",
    visitNotes: "Active rural shrine; festival days draw large crowds.",
    sources: [
      {
        label: "Wikipedia — Chola temples in Bengaluru",
        url: "https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore",
      },
    ],
  },
  {
    id: "marathahalli-someshwara",
    name: "Someshwara Temple (Marathahalli)",
    lat: 12.955,
    lng: 77.694,
    builtYear: 1508,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Someshwara shrine with a dated 16th-century inscription, serving the old Marathahalli agrahara.",
    visitNotes: "Neighbourhood temple amid IT corridor traffic; temple hours apply.",
    sources: [
      {
        label: "Wikipedia — Chola temples in Bengaluru",
        url: "https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore",
      },
    ],
  },
  {
    id: "thindlu-veerabhadra",
    name: "Sri Veerabhadra Swamy Temple (Thindlu)",
    lat: 13.058,
    lng: 77.548,
    builtYear: 1000,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Early medieval Veerabhadra temple north of Yelahanka with Chola-period antecedents.",
    visitNotes: "Active temple in Thindlu village; day visit.",
    sources: [
      {
        label: "Wikipedia — Chola temples in Bengaluru",
        url: "https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore",
      },
    ],
  },
  {
    id: "ghati-subramanya",
    name: "Ghati Subramanya Temple",
    lat: 13.4085,
    lng: 77.5281,
    builtYear: 600,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Ancient Subramanya–Lakshmi Narasimha cave shrine in a scenic valley; pilgrimage site for centuries.",
    visitNotes: "Popular day trip (~60 km north); queues on weekends and Subramanya shashti.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ghati_Subramanya" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Ghati_Subramanya",
  },
  {
    id: "kaadu-malleshwara",
    name: "Kaadu Malleshwara Temple (Malleswaram)",
    lat: 13.0036,
    lng: 77.5703,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Forest Shiva temple that gave Malleswaram its name; Chola origins with later Vijayanagara work.",
    visitNotes: "Active temple on 15th Cross; calm weekday visits.",
    sources: [
      { label: "Wikipedia — Malleshwaram", url: "https://en.wikipedia.org/wiki/Malleshwaram" },
    ],
  },
  {
    id: "dodda-ganapathi",
    name: "Dodda Ganapathi Temple (Basavanagudi)",
    lat: 12.9418,
    lng: 77.5642,
    builtYear: 1537,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Kempe Gowda’s monolithic Ganapathi beside the Bull Temple, cut from a single boulder.",
    visitNotes: "Open with Basavanagudi temple cluster; butter coating on festival days.",
    sources: [
      { label: "Wikipedia — Bull Temple", url: "https://en.wikipedia.org/wiki/Bull_Temple" },
    ],
  },
  {
    id: "bande-mahakali",
    name: "Sri Bande Mahakali Temple (Gavipuram)",
    lat: 12.9948,
    lng: 77.5682,
    builtYear: 1537,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Kempe Gowda-era Mahakali shrine near Kempambudhi tank; tied to the Gavipuram watch-tower landmark.",
    visitNotes: "Active hill-edge temple; steep steps; modest dress expected.",
    sources: [
      { label: "Kempe Gowda towers (INTACH context)", url: "https://en.wikipedia.org/wiki/Kempe_Gowda_I" },
    ],
  },
  {
    id: "lalbagh-gardens",
    name: "Lalbagh Botanical Garden",
    lat: 12.9507,
    lng: 77.5848,
    builtYear: 1760,
    era: "tipu_late_medieval",
    kind: "monument",
    summary:
      "Hyder Ali’s 18th-century mughal-style garden, expanded by Tipu; famous gate, lake, and colonial-era glasshouse.",
    visitNotes: "Ticketed garden; open daily morning to evening; glasshouse shows seasonal.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Lal_Bagh" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Lal_Bagh",
  },
  {
    id: "lalbagh-glasshouse",
    name: "Lalbagh Glass House",
    lat: 12.9497,
    lng: 77.584,
    builtYear: 1889,
    era: "british",
    kind: "heritage_building",
    summary:
      "Cast-iron and glass conservatory modelled on London’s Crystal Palace, built during British rule inside Lalbagh.",
    visitNotes: "Inside Lalbagh; entry via garden ticket; flower shows twice yearly.",
    sources: [
      { label: "Wikipedia — Lal Bagh", url: "https://en.wikipedia.org/wiki/Lal_Bagh" },
    ],
  },
  {
    id: "yelahanka-fort",
    name: "Yelahanka (Kempe Gowda birthplace & fort)",
    lat: 13.1003,
    lng: 77.5963,
    builtYear: 1510,
    era: "vijayanagara_kempegowda",
    kind: "fort",
    summary:
      "Home of the Yelahanka Nadu chiefs who founded Bengaluru; surviving fort walls and Kempe Gowda memorial in old Yelahanka.",
    visitNotes: "Walkable fort fragments in Yelahanka Old Town; combine with nearby Kempe Gowda statue.",
    sources: [
      { label: "Wikipedia — Yelahanka", url: "https://en.wikipedia.org/wiki/Yelahanka" },
      { label: "Wikipedia — Kempe Gowda I", url: "https://en.wikipedia.org/wiki/Kempe_Gowda_I" },
    ],
  },
  {
    id: "champakadhama-bannerghatta",
    name: "Sri Champakadhama Swamy Temple (Bannerghatta hills)",
    lat: 12.741,
    lng: 77.593,
    builtYear: 1600,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Hill temple of Vishnu as Champakadhama above the Bannerghatta forest; medieval pilgrimage stop south of the city.",
    visitNotes: "Climb or drive to hilltop shrine; national park ticket separate if continuing to safari.",
    sources: [
      {
        label: "Wikipedia — Bannerghatta",
        url: "https://en.wikipedia.org/wiki/Bannerghatta",
      },
    ],
  },
  {
    id: "huliyurdurga",
    name: "Huliyur Durga (fort hill)",
    lat: 13.052,
    lng: 77.384,
    builtYear: 1600,
    era: "vijayanagara_kempegowda",
    kind: "fort",
    summary:
      "Granite hill fort west of Bengaluru with Kempe Gowda–era walls and a small hilltop shrine.",
    visitNotes: "Moderate trek; start early; carry water; no formal ticket.",
    sources: [
      { label: "Wikipedia — Huliyur Durga", url: "https://en.wikipedia.org/wiki/Huliyur_Durga" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Huliyur_Durga",
  },
  {
    id: "makalidurga",
    name: "Makalidurga (fort hill)",
    lat: 13.451,
    lng: 77.443,
    builtYear: 1600,
    era: "vijayanagara_kempegowda",
    kind: "fort",
    summary:
      "Hill fort on the Guntakal line with ruined bastions and a lakeside trek popular with heritage hikers.",
    visitNotes: "Railhead Makalidurga; trek to summit; day trip from Bengaluru.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Makalidurga" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Makalidurga",
  },
  {
    id: "mayo-hall",
    name: "Mayo Hall",
    lat: 12.9714,
    lng: 77.6097,
    builtYear: 1883,
    era: "british",
    kind: "heritage_building",
    summary:
      "Neo-classical public hall on Residency Road; houses the Kempegowda Museum on the first floor.",
    visitNotes: "Museum open Mon–Sat ~9–5 (verify); exterior always viewable from MG Road area.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Mayo_Hall_(Bengaluru)" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Mayo_Hall_(Bengaluru)",
  },
  {
    id: "holy-trinity",
    name: "Holy Trinity Church",
    lat: 12.9693,
    lng: 77.619,
    builtYear: 1852,
    era: "british",
    kind: "church",
    summary:
      "English Renaissance cantonment church at Trinity Circle, built for the British garrison in the 1850s.",
    visitNotes: "Active CSI church; respect Sunday services; exterior always accessible.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Holy_Trinity_Church,_Bangalore" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Holy_Trinity_Church,_Bangalore",
  },
  {
    id: "st-marks-cathedral",
    name: "St. Mark's Cathedral",
    lat: 12.9742,
    lng: 77.6065,
    builtYear: 1808,
    era: "british",
    kind: "church",
    summary:
      "Oldest Anglican cathedral in Bengaluru; current stone building follows the 1808 garrison church foundation.",
    visitNotes: "Open for worship and quiet visits; gardens buffer noise from MG Road.",
    sources: [
      { label: "St. Mark's Cathedral history", url: "https://saintmarks.in/church_history" },
    ],
  },
  {
    id: "east-parade-church",
    name: "East Parade Church",
    lat: 12.973,
    lng: 77.612,
    builtYear: 1865,
    kind: "church",
    era: "british",
    summary:
      "Wesleyan church on Dickenson Road with prominent Corinthian columns; among the earliest Methodist buildings in Mysore State.",
    visitNotes: "Active church; services on Sunday; view facade from street anytime.",
    sources: [
      {
        label: "Citizen Matters — Cantonment churches",
        url: "https://citizenmatters.in/a-walker-s-guide-to-the-churches-in-bengaluru-cantonment/",
      },
    ],
  },
  {
    id: "central-college",
    name: "Central College (Bangalore University)",
    lat: 12.9749,
    lng: 77.5658,
    builtYear: 1858,
    era: "british",
    kind: "heritage_building",
    summary:
      "Gothic revival campus of one of India’s first modern universities, facing the city railway station.",
    visitNotes: "Working university; heritage blocks best viewed from gates on Ambedkar Veedhi.",
    sources: [
      { label: "Wikipedia — Central College", url: "https://en.wikipedia.org/wiki/Central_College_of_Bangalore" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Central_College_of_Bangalore",
  },
  {
    id: "ksr-railway-station",
    name: "Bangalore City Railway Station (KSR)",
    lat: 12.9767,
    lng: 77.5663,
    builtYear: 1864,
    era: "british",
    kind: "heritage_building",
    summary:
      "Indo-Gothic terminal of the Madras Railway era; still the main rail gateway to the pete and cantonment.",
    visitNotes: "Public concourse with valid ticket; heritage façade on station frontage.",
    sources: [
      {
        label: "Wikipedia — Bangalore City railway station",
        url: "https://en.wikipedia.org/wiki/Krantivira_Sangolli_Rayanna_railway_station",
      },
    ],
  },
  {
    id: "bowring-institute",
    name: "Bowring Institute",
    lat: 12.9685,
    lng: 77.6075,
    builtYear: 1888,
    era: "british",
    kind: "heritage_building",
    summary:
      "Victorian members’ club and library on St. Mark’s Road, among the oldest social institutions of the cantonment.",
    visitNotes: "Private club; heritage façade visible from the street; members-only interior.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bowring_Institute" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Bowring_Institute",
  },
  {
    id: "ananda-lingeshwara",
    name: "Sri Ananda Lingeshwara Temple (Hebbal)",
    lat: 13.0352,
    lng: 77.5974,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Medieval Shiva temple on the Hebbal tank bund, linked to Chola-period settlement north of the pete.",
    visitNotes: "Active temple overlooking Hebbal lake; accessible from flyover service roads.",
    sources: [
      {
        label: "INTACH Bengaluru — temple trails",
        url: "https://www.intachblr.org/",
      },
    ],
  },
  {
    id: "kote-jalakanteshwara",
    name: "Sri Kote Jalakanteshwara Temple (Fort)",
    lat: 12.9624,
    lng: 77.5782,
    builtYear: 1680,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Fort Shiva temple within the Bangalore Fort enclosure, worshipped by the pete garrison for centuries.",
    visitNotes: "Inside fort area near Summer Palace; combine with Delhi Gate walk.",
    sources: [
      { label: "Wikipedia — Bangalore Fort", url: "https://en.wikipedia.org/wiki/Bangalore_Fort" },
    ],
  },
  {
    id: "kadugodi-kashi-vishweshwar",
    name: "Kashi Vishweshwara Temple (Kadugodi)",
    lat: 12.9975,
    lng: 77.7683,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Chola-period Shiva temple that gave Kadugodi (‘forest temple’) its name; inscriptions name the deity Rajadhiraja Bhangisvaram.",
    visitNotes: "Active temple east of Whitefield; quiet weekday darshan.",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Kashi_Vishweshwar_Temple,_Kadugodi,_Bengaluru",
      },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Kashi_Vishweshwar_Temple,_Kadugodi,_Bengaluru",
  },
  {
    id: "vasantha-vallabharaya",
    name: "Vasantha Vallabharaya Temple (Vasantapura)",
    lat: 12.8955,
    lng: 77.5519,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Hilltop Vishnu shrine south of the city; Chola-era work with Alwar sculptures and surviving sacred springs.",
    visitNotes: "Climb from Vasantapura; popular for weddings; modest dress.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Vasantha_Vallabharaya_Temple" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Vasantha_Vallabharaya_Temple",
  },
  {
    id: "agara-someshwara",
    name: "Someshwara Swamy Temple (Agara)",
    lat: 12.9181,
    lng: 77.6183,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Shiva temple on Sarjapur Road with about 1,200 years of worship tradition in the Agara agrahara.",
    visitNotes: "Neighbourhood temple near Agara lake; open during puja hours.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Someshwara_Swamy_Temple" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Someshwara_Swamy_Temple",
  },
  {
    id: "gunjur-someshwara",
    name: "Someshwara Swamy Temple (Gunjur)",
    lat: 12.912,
    lng: 77.738,
    builtYear: 1150,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "12th-century Chola foundation east of Varthur; present shrine renovated but linga worship continues.",
    visitNotes: "Village temple on the Varthur–Gunjur road; morning and evening puja.",
    sources: [
      {
        label: "Wikipedia — Chola temples in Bengaluru",
        url: "https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore",
      },
    ],
  },
  {
    id: "hulimavu-cave",
    name: "Hulimavu Cave Temple (Ramalingeshwara)",
    lat: 12.877,
    lng: 77.5997,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Rock-cut cave shrine on Bannerghatta Road—Bengaluru’s second major cave temple after Gavipuram—with Rama and Shiva sanctums.",
    visitNotes: "Managed by Bala Gangadharaswami Mutt; low ceilings in parts; open 6 a.m.–12 p.m. and evenings.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hulimavu_Shiva_cave_temple" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Hulimavu_Shiva_cave_temple",
  },
  {
    id: "begur-panchalingeshwara",
    name: "Begur Panchalingeshwara (Choleshwara shrines)",
    lat: 12.8782,
    lng: 77.6315,
    builtYear: 1000,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Expanded Shaiva complex with Choleshwara, Nagareshwara, and Karaneshwara lingas added to the 9th-century Nageshwara core.",
    visitNotes: "Same precinct as the Begur inscription temple; walk the prakara to see all five lingas.",
    sources: [
      { label: "Wikipedia — Begur inscriptions", url: "https://en.wikipedia.org/wiki/Begur_inscriptions_and_hero_stones" },
    ],
  },
  {
    id: "ranganathaswamy-chickpet",
    name: "Ranganathaswamy Temple (Chickpet)",
    lat: 12.9682,
    lng: 77.5748,
    builtYear: 1550,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "16th-century Vaikhanasa Vishnu temple in Chikkapete with granite pillars blending Vijayanagara and Hoysala motifs.",
    visitNotes: "Active temple on Ranganatha Temple Street; busy during Vaikunta Ekadashi.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Ranganathaswamy_Temple,_Bangalore" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Ranganathaswamy_Temple,_Bangalore",
  },
  {
    id: "yelahanka-gate-anjaneya",
    name: "Yelahanka Gate Anjaneya Temple",
    lat: 12.9625,
    lng: 77.5825,
    builtYear: 1680,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Kempe Gowda-era Hanuman shrine at the old Yelahanka Gate of the pete, on Avenue Road.",
    visitNotes: "Street-corner temple in the wholesale market area; quick darshan on foot.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Yelahanka_Gate_Anjaneya_Temple" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Yelahanka_Gate_Anjaneya_Temple",
  },
  {
    id: "dodda-anjaneya",
    name: "Dodda Anjaneya Swamy Temple (Basavanagudi)",
    lat: 12.9426,
    lng: 77.5688,
    builtYear: 1537,
    era: "vijayanagara_kempegowda",
    kind: "temple",
    summary:
      "Large Hanuman idol installed by Kempe Gowda outside the southern fort gate, part of the Basavanagudi temple cluster.",
    visitNotes: "Open with Bull and Dodda Ganapathi temples; expect crowds on Saturdays.",
    sources: [
      { label: "Wikipedia — Kempe Gowda I", url: "https://en.wikipedia.org/wiki/Kempe_Gowda_I" },
    ],
  },
  {
    id: "gangavara-someshwara",
    name: "Someshwara Temple (Gangavara)",
    lat: 13.045,
    lng: 77.725,
    builtYear: 1100,
    era: "ancient_medieval",
    kind: "temple",
    summary:
      "Medieval Shiva temple in the Gangavara village belt, listed among Chola-period foundations around Bengaluru.",
    visitNotes: "Rural temple north-east of the city; best visited by car.",
    sources: [
      {
        label: "Wikipedia — Chola temples in Bengaluru",
        url: "https://en.wikipedia.org/wiki/List_of_Chola_temples_in_Bangalore",
      },
    ],
  },
  {
    id: "st-andrews-church",
    name: "St. Andrew's Church (Kirk)",
    lat: 12.9792,
    lng: 77.6042,
    builtYear: 1866,
    era: "british",
    kind: "church",
    summary:
      "Scottish Presbyterian ‘Red Kirk’ on Cubbon Road; Gothic design by Sankey, echoing Central College across the street.",
    visitNotes: "Active CSI church; Sunday worship; quiet weekday visits often welcome.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/St._Andrew%27s_Church,_Bengaluru" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/St._Andrew%27s_Church,_Bengaluru",
  },
  {
    id: "all-saints-church",
    name: "All Saints' Church (Richmond Town)",
    lat: 12.9658,
    lng: 77.6075,
    builtYear: 1870,
    era: "british",
    kind: "church",
    summary:
      "Robert Chisholm’s Gothic revival ‘garden church’ on Hosur Road, built for retired soldiers and their families.",
    visitNotes: "Active church with tree-filled grounds; respect services and Metro construction zones nearby.",
    sources: [
      {
        label: "The Hindu — architecture",
        url: "https://www.thehindu.com/society/history-and-culture/rich-in-symbolism-with-innovative-designs/article28411374.ece",
      },
    ],
  },
  {
    id: "st-johns-church",
    name: "St. John's Church (Cleveland Town)",
    lat: 12.9917,
    lng: 77.6006,
    builtYear: 1858,
    era: "british",
    kind: "church",
    summary:
      "Red-brick Anglican church with a tall steeple; fourth oldest Protestant church in the cantonment.",
    visitNotes: "Active parish church near Promenade Road; check service times before visiting.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/St._John%27s_Church,_Bangalore" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/St._John%27s_Church,_Bangalore",
  },
  {
    id: "wesley-english-church",
    name: "Wesley English Church",
    lat: 12.9912,
    lng: 77.6098,
    builtYear: 1888,
    era: "british",
    kind: "church",
    summary:
      "Methodist chapel on Promenade Road (formerly St. John’s Hill Church), paired historically with East Parade Wesleyan church.",
    visitNotes: "Active church beside Coles Park; Sunday service at 9 a.m.",
    sources: [{ label: "Wesley English Church — history", url: "https://wesleychurch.in/history" }],
  },
  {
    id: "seshadri-iyer-memorial",
    name: "Seshadri Iyer Memorial Hall (State Central Library)",
    lat: 12.9762,
    lng: 77.593,
    builtYear: 1908,
    era: "british",
    kind: "heritage_building",
    summary:
      "Public memorial to Dewan Seshadri Iyer in Cubbon Park; Richard Sankey design, home to Karnataka’s reference library since 1915.",
    visitNotes: "Free reference library; reading halls and rose garden open during library hours.",
    sources: [
      {
        label: "The Hindu — architecture",
        url: "https://www.thehindu.com/life-and-style/homes-and-gardens/an-eclectic-mix-of-architectural-elements/article29409682.ece",
      },
    ],
  },
  {
    id: "raj-bhavan",
    name: "Raj Bhavan (Lok Bhavan)",
    lat: 12.9823,
    lng: 77.5914,
    builtYear: 1842,
    era: "british",
    kind: "heritage_building",
    summary:
      "Former British Residency on High Grounds; Mark Cubbon’s bungalow became the Mysore Resident’s seat and later the governor’s house.",
    visitNotes: "Official residence; view heritage façade from High Grounds roads; no casual entry.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Raj_Bhavan,_Bangalore" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Raj_Bhavan,_Bangalore",
  },
  {
    id: "town-hall",
    name: "Sir Puttanna Chetty Town Hall",
    lat: 12.9636,
    lng: 77.5858,
    builtYear: 1935,
    era: "british",
    kind: "heritage_building",
    summary:
      "Neoclassical BBMP town hall on J C Road by Sir Mirza Ismail; public auditorium since the Wodeyar era.",
    visitNotes: "Event venue; exterior and foyer accessible when public programmes are listed.",
    sources: [
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Bengaluru_Town_Hall" },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Bengaluru_Town_Hall",
  },
  {
    id: "victoria-hospital",
    name: "Victoria Hospital (heritage block)",
    lat: 12.9634,
    lng: 77.5738,
    builtYear: 1900,
    era: "british",
    kind: "heritage_building",
    summary:
      "Victorian Gothic civic hospital opened by Lord Curzon; granite includes stone reused from dismantled fort walls.",
    visitNotes: "Working government hospital; heritage block visible from campus roads; follow hospital security rules.",
    sources: [
      {
        label: "Wikipedia",
        url: "https://en.wikipedia.org/wiki/Victoria_Hospital_(Bangalore_Medical_College)",
      },
    ],
    wikipedia: "https://en.wikipedia.org/wiki/Victoria_Hospital_(Bangalore_Medical_College)",
  },
  {
    id: "balabrooie-guest-house",
    name: "Balabrooie Guest House",
    lat: 12.9893,
    lng: 77.5865,
    builtYear: 1850,
    era: "british",
    kind: "heritage_building",
    summary:
      "Colonial bungalow on Palace Road where Mark Cubbon once lived; now a Karnataka government guest house in a wooded compound.",
    visitNotes: "Secured government estate; heritage trees and roofline visible from Palace Road perimeter.",
    sources: [
      {
        label: "The South First — colonial buildings",
        url: "https://thesouthfirst.com/featured/the-many-lives-of-bengalurus-colonial-era-buildings/",
      },
    ],
  },
  {
    id: "cubbon-bandstand",
    name: "Cubbon Park Band Stand",
    lat: 12.9768,
    lng: 77.598,
    builtYear: 1870,
    era: "british",
    kind: "monument",
    summary:
      "Victorian bandstand in Cubbon Park from the Sankey-era layout; focal point of colonial public promenades.",
    visitNotes: "Inside Cubbon Park; open with park hours; popular photo stop near the museum cluster.",
    sources: [
      { label: "Wikipedia — Cubbon Park", url: "https://en.wikipedia.org/wiki/Cubbon_Park" },
    ],
  },
];

const ERA_LABELS = {
  ancient_medieval: "Ancient & medieval (pre-16th c.)",
  vijayanagara_kempegowda: "Vijayanagara & Kempe Gowda",
  tipu_late_medieval: "Tipu & late Mysore",
  british: "British era (to 1947)",
};

const ERA_COLORS = {
  ancient_medieval: "#8b4513",
  vijayanagara_kempegowda: "#b8860b",
  tipu_late_medieval: "#2d6a4f",
  british: "#4a5568",
};

const KIND_LABELS = {
  temple: "Temple",
  fort: "Fort / hill fort",
  palace: "Palace",
  mosque: "Mosque",
  church: "Church",
  monument: "Monument",
  heritage_building: "Heritage building",
};
