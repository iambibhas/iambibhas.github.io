// Generated from vb.txt by tools/train-to-take/update-from-vb.mjs.
// Intermediate stops are retained from the curated list when endpoint codes match.
const TRAINS = [
  {
    "name": "Shri Mata Vaishno Devi Katra - New Delhi Vande Bharat Express",
    "number": "22440 / 22439",
    "type": "VB",
    "stops": [
      "SVDK",
      "JAT",
      "LDH",
      "UMB",
      "NDLS"
    ]
  },
  {
    "name": "Mysuru - MGR Chennai Central Vande Bharat Express",
    "number": "20608 / 20607",
    "type": "VB",
    "stops": [
      "MYS",
      "KSR",
      "KPD",
      "MAS"
    ]
  },
  {
    "name": "New Delhi - Varanasi Vande Bharat Express",
    "number": "22436 / 22435",
    "type": "VB",
    "stops": [
      "NDLS",
      "CNB",
      "PRYJ",
      "BSB"
    ]
  },
  {
    "name": "Gandhinagar Capital - Mumbai Central Vande Bharat Express (PT)",
    "number": "20902 / 20901",
    "type": "VB",
    "stops": [
      "GNC",
      "ADI",
      "BRC",
      "ST",
      "BVI",
      "MMCT"
    ]
  },
  {
    "name": "New Delhi - Amb Andaura Vande Bharat Express",
    "number": "22447 / 22448",
    "type": "VB",
    "stops": [
      "NDLS",
      "AADR"
    ]
  },
  {
    "name": "Secunderabad - Tirupati Vande Bharat Express",
    "number": "20701 / 20702",
    "type": "VB",
    "stops": [
      "SC",
      "GNT",
      "OGL",
      "NLR",
      "TPTY"
    ]
  },
  {
    "name": "Nagpur - Bilaspur Vande Bharat Express",
    "number": "20826 / 20825",
    "type": "VB",
    "stops": [
      "NGP",
      "G",
      "DURG",
      "R",
      "BSP"
    ]
  },
  {
    "name": "New Jalpaiguri - Howrah Vande Bharat Express",
    "number": "22302 / 22301",
    "type": "VB",
    "stops": [
      "NJP",
      "MLDT",
      "BHP",
      "BWN",
      "HWH"
    ]
  },
  {
    "name": "Kasaragod - Thiruvananthapuram Central Vande Bharat Express",
    "number": "20633 / 20634",
    "type": "VB",
    "stops": [
      "KGQ",
      "CAN",
      "CLT",
      "SRR",
      "TCR",
      "ERS",
      "KTYM",
      "QLN",
      "TVC"
    ]
  },
  {
    "name": "Visakhapatnam - Secunderabad Vande Bharat Express",
    "number": "20833 / 20834",
    "type": "VB",
    "stops": [
      "VSKP",
      "RJY",
      "BZA",
      "KMT",
      "WL",
      "SC"
    ]
  },
  {
    "name": "Mumbai CSMT - Solapur Vande Bharat Express",
    "number": "22225 / 22226",
    "type": "VB",
    "stops": [
      "CSMT",
      "DR",
      "TNA",
      "KYN",
      "LNL",
      "PUNE",
      "SUR"
    ]
  },
  {
    "name": "Sainagar Shirdi - Mumbai CSMT Vande Bharat Express",
    "number": "22224 / 22223",
    "type": "VB",
    "stops": [
      "SNSI",
      "NK",
      "KYN",
      "TNA",
      "DR",
      "CSMT"
    ]
  },
  {
    "name": "Rani Kamalapati (Habibganj) - Hazrat Nizamuddin Vande Bharat Express",
    "number": "20171 / 20172",
    "type": "VB",
    "stops": [
      "RKMP",
      "JHS",
      "GWL",
      "AGC",
      "NZM"
    ]
  },
  {
    "name": "Puri - Rourkela Vande Bharat Express",
    "number": "20836 / 20835",
    "type": "VB",
    "stops": [
      "PURI",
      "ROU"
    ]
  },
  {
    "name": "MGR Chennai Central - Coimbatore Vande Bharat Express",
    "number": "20643 / 20644",
    "type": "VB",
    "stops": [
      "MAS",
      "SA",
      "ED",
      "CBE"
    ]
  },
  {
    "name": "New Jalpaiguri - Guwahati Vande Bharat Express",
    "number": "22227 / 22228",
    "type": "VB",
    "stops": [
      "NJP",
      "NOQ",
      "KOJ",
      "GHY"
    ]
  },
  {
    "name": "Howrah - Ranchi Vande Bharat Express",
    "number": "20897 / 20898",
    "type": "VB",
    "stops": [
      "HWH",
      "KGP",
      "TATA",
      "RNC"
    ]
  },
  {
    "name": "Ajmer - Chandigarh Vande Bharat Express",
    "number": "20977 / 20978",
    "type": "VB",
    "stops": [
      "AII",
      "CDG"
    ]
  },
  {
    "name": "Howrah - Puri Vande Bharat Express",
    "number": "22895 / 22896",
    "type": "VB",
    "stops": [
      "HWH",
      "KGP",
      "BLS",
      "CTC",
      "BBS",
      "PURI"
    ]
  },
  {
    "name": "Dehradun - Anand Vihar Terminal Vande Bharat Express",
    "number": "22458 / 22457",
    "type": "VB",
    "stops": [
      "DDN",
      "HW",
      "RK",
      "SRE",
      "MTC",
      "ANVT"
    ]
  },
  {
    "name": "Mumbai CSMT - Madgaon Vande Bharat Express",
    "number": "22229 / 22230",
    "type": "VB",
    "stops": [
      "CSMT",
      "DR",
      "PNVL",
      "RN",
      "THVM",
      "MAO"
    ]
  },
  {
    "name": "Patna - Ranchi Vande Bharat Express",
    "number": "22349 / 22350",
    "type": "VB",
    "stops": [
      "PNBE",
      "RNC"
    ]
  },
  {
    "name": "Indore - Nagpur Vande Bharat Express",
    "number": "20911 / 20912",
    "type": "VB",
    "stops": [
      "INDB",
      "NGP"
    ]
  },
  {
    "name": "KSR Bengaluru - Dharwad Vande Bharat Express",
    "number": "20661 / 20662",
    "type": "VB",
    "stops": [
      "SBC",
      "YPR",
      "TK",
      "DVG",
      "HVR",
      "SSS",
      "DWR"
    ]
  },
  {
    "name": "Rewa - Rani Kamalapati (Habibganj) Vande Bharat Express",
    "number": "20174 / 20173",
    "type": "VB",
    "stops": [
      "REWA",
      "RKMP"
    ]
  },
  {
    "name": "Jodhpur - Sabarmati Vande Bharat Express",
    "number": "12461 / 12462",
    "type": "VB",
    "stops": [
      "JU",
      "SBIB"
    ]
  },
  {
    "name": "Prayagraj - Gorakhpur Vande Bharat Express",
    "number": "22550 / 22549",
    "type": "VB",
    "stops": [
      "PRYJ",
      "GKP"
    ]
  },
  {
    "name": "Patna - Howrah Vande Bharat Express",
    "number": "22348 / 22347",
    "type": "VB",
    "stops": [
      "PNBE",
      "GAYA",
      "DHN",
      "ASN",
      "BWN",
      "HWH"
    ]
  },
  {
    "name": "Agra Cantt. - Banaras Vande Bharat Express",
    "number": "20176 / 20175",
    "type": "VB",
    "stops": [
      "AGC",
      "BNRS"
    ]
  },
  {
    "name": "Tirunelveli - Chennai Egmore Vande Bharat Express",
    "number": "20666 / 20665",
    "type": "VB",
    "stops": [
      "TEN",
      "MDU",
      "TPJ",
      "VM",
      "MS"
    ]
  },
  {
    "name": "Kacheguda - Yesvantpur Vande Bharat Express",
    "number": "20703 / 20704",
    "type": "VB",
    "stops": [
      "KCG",
      "MBNR",
      "KRNT",
      "ATP",
      "YPR"
    ]
  },
  {
    "name": "Mangaluru Central - Thiruvananthapuram Central Vande Bharat Express",
    "number": "20631 / 20632",
    "type": "VB",
    "stops": [
      "MAQ",
      "KGQ",
      "CAN",
      "CLT",
      "SRR",
      "TCR",
      "ERS",
      "ALLP",
      "QLN",
      "TVC"
    ]
  },
  {
    "name": "Narasapur - MGR Chennai Central Vande Bharat Express",
    "number": "20678 / 20677",
    "type": "VB",
    "stops": [
      "NS",
      "MAS"
    ]
  },
  {
    "name": "Patna - Tatanagar Vande Bharat Express (via Gomoh)",
    "number": "20894 / 20893",
    "type": "VB",
    "stops": [
      "PNBE",
      "TATA"
    ]
  },
  {
    "name": "Okha - Sabarmati Jn. Vande Bharat Express",
    "number": "22926 / 22925",
    "type": "VB",
    "stops": [
      "OKHA",
      "SBT"
    ]
  },
  {
    "name": "Varanasi - New Delhi Vande Bharat Express",
    "number": "22415 / 22416",
    "type": "VB",
    "stops": [
      "BSB",
      "PRYJ",
      "CNB",
      "NDLS"
    ]
  },
  {
    "name": "Amritsar - Delhi Vande Bharat Express",
    "number": "22488 / 22487",
    "type": "VB",
    "stops": [
      "ASR",
      "DLI"
    ]
  },
  {
    "name": "Mangaluru Central - Madgaon Vande Bharat Express",
    "number": "20646 / 20645",
    "type": "VB",
    "stops": [
      "MAQ",
      "UD",
      "KAWR",
      "MAO"
    ]
  },
  {
    "name": "Hazur Sahib Nanded - Mumbai CSMT Vande Bharat Express",
    "number": "20705 / 20706",
    "type": "VB",
    "stops": [
      "NED",
      "CSMT"
    ]
  },
  {
    "name": "Coimbatore - Bengaluru Cantt. Vande Bharat Express",
    "number": "20642 / 20641",
    "type": "VB",
    "stops": [
      "CBE",
      "BNC"
    ]
  },
  {
    "name": "Shri Mata Vaishno Devi Katra - New Delhi Vande Bharat Express",
    "number": "22478 / 22477",
    "type": "VB",
    "stops": [
      "SVDK",
      "JAT",
      "LDH",
      "UMB",
      "NDLS"
    ]
  },
  {
    "name": "Ayodhya Cantt. - Anand Vihar Terminal Vande Bharat Express",
    "number": "22425 / 22426",
    "type": "VB",
    "stops": [
      "AYC",
      "ANVT"
    ]
  },
  {
    "name": "Varanasi - Ranchi Vande Bharat Express",
    "number": "20888 / 20887",
    "type": "VB",
    "stops": [
      "BSB",
      "RNC"
    ]
  },
  {
    "name": "Bhubaneswar - Visakhapatnam Vande Bharat Express",
    "number": "20841 / 20842",
    "type": "VB",
    "stops": [
      "BBS",
      "VSKP"
    ]
  },
  {
    "name": "Khajuraho - Hazrat Nizamuddin Vande Bharat Express",
    "number": "22469 / 22470",
    "type": "VB",
    "stops": [
      "KURJ",
      "NZM"
    ]
  },
  {
    "name": "Kalaburagi - SMVT Bengaluru Vande Bharat Express",
    "number": "22231 / 22232",
    "type": "VB",
    "stops": [
      "KLBG",
      "SMVB"
    ]
  },
  {
    "name": "Mysuru - MGR Chennai Central Vande Bharat Express",
    "number": "20663 / 20664",
    "type": "VB",
    "stops": [
      "MYS",
      "KSR",
      "KPD",
      "MAS"
    ]
  },
  {
    "name": "Secunderabad - Visakhapatnam Vande Bharat Express",
    "number": "20707 / 20708",
    "type": "VB",
    "stops": [
      "SC",
      "WL",
      "KMT",
      "BZA",
      "RJY",
      "VSKP"
    ]
  },
  {
    "name": "Ahmedabad - Mumbai Central Vande Bharat Express (PT)",
    "number": "22962 / 22961",
    "type": "VB",
    "stops": [
      "ADI",
      "MMCT"
    ]
  },
  {
    "name": "New Jalpaiguri - Patna Vande Bharat Express",
    "number": "22233 / 22234",
    "type": "VB",
    "stops": [
      "NJP",
      "PNBE"
    ]
  },
  {
    "name": "Patna - Gomti Nagar Vande Bharat Express",
    "number": "22345 / 22346",
    "type": "VB",
    "stops": [
      "PNBE",
      "GTNR"
    ]
  },
  {
    "name": "Dehradun - Lucknow Jn. Vande Bharat Express",
    "number": "22546 / 22545",
    "type": "VB",
    "stops": [
      "DDN",
      "LJN"
    ]
  },
  {
    "name": "Madurai - Bengaluru Cantt. Vande Bharat Express",
    "number": "20671 / 20672",
    "type": "VB",
    "stops": [
      "MDU",
      "BNC"
    ]
  },
  {
    "name": "Chennai Egmore - Nagercoil Vande Bharat Express",
    "number": "20627 / 20628",
    "type": "VB",
    "stops": [
      "MS",
      "VM",
      "TPJ",
      "MDU",
      "TEN",
      "NCJ"
    ]
  },
  {
    "name": "Varanasi - Meerut City Vande Bharat Express",
    "number": "22489 / 22490",
    "type": "VB",
    "stops": [
      "BSB",
      "MTC"
    ]
  },
  {
    "name": "SSS Hubballi - Pune Vande Bharat Express",
    "number": "20669 / 20670",
    "type": "VB",
    "stops": [
      "UBL",
      "DWR",
      "BGM",
      "MRJ",
      "SAT",
      "PUNE"
    ]
  },
  {
    "name": "Varanasi - Deoghar Vande Bharat Express",
    "number": "22500 / 22499",
    "type": "VB",
    "stops": [
      "BSB",
      "DGHR"
    ]
  },
  {
    "name": "Visakhapatnam - Durg Vande Bharat Express",
    "number": "20830 / 20829",
    "type": "VB",
    "stops": [
      "VSKP",
      "DURG"
    ]
  },
  {
    "name": "Gaya - Howrah Vande Bharat Express",
    "number": "22304 / 22303",
    "type": "VB",
    "stops": [
      "GAYA",
      "HWH"
    ]
  },
  {
    "name": "Howrah - Jamalpur Vande Bharat Express",
    "number": "22309 / 22310",
    "type": "VB",
    "stops": [
      "HWH",
      "JMP"
    ]
  },
  {
    "name": "Brahmapur - Tatanagar Vande Bharat Express",
    "number": "20892 / 20891",
    "type": "VB",
    "stops": [
      "BAM",
      "TATA"
    ]
  },
  {
    "name": "Rourkela - Howrah Vande Bharat Express",
    "number": "20872 / 20871",
    "type": "VB",
    "stops": [
      "ROU",
      "HWH"
    ]
  },
  {
    "name": "SCSMT Kolhapur - Pune Vande Bharat Express",
    "number": "20673 / 20674",
    "type": "VB",
    "stops": [
      "KOP",
      "PUNE"
    ]
  },
  {
    "name": "Nagpur - Secunderabad Vande Bharat Express",
    "number": "20101 / 20102",
    "type": "VB",
    "stops": [
      "NGP",
      "BPQ",
      "KZJ",
      "SC"
    ]
  },
  {
    "name": "Patna - Tatanagar Vande Bharat Express (via Barkakana)",
    "number": "21894 / 21893",
    "type": "VB",
    "stops": [
      "PNBE",
      "TATA"
    ]
  },
  {
    "name": "Tatanagar - Patna Vande Bharat Express (via Gomoh)",
    "number": "21895 / 21896",
    "type": "VB",
    "stops": [
      "TATA",
      "PNBE"
    ]
  },
  {
    "name": "Sabarmati BG - Veraval Vande Bharat Express",
    "number": "26901 / 26902",
    "type": "VB",
    "stops": [
      "SBIB",
      "VRL"
    ]
  },
  {
    "name": "Jammu Tawi - Srinagar Vande Bharat Express",
    "number": "26401 / 26402",
    "type": "VB",
    "stops": [
      "JAT",
      "SINA"
    ]
  },
  {
    "name": "Srinagar - Jammu Tawi Vande Bharat Express",
    "number": "26404 / 26403",
    "type": "VB",
    "stops": [
      "SINA",
      "JAT"
    ]
  },
  {
    "name": "Gorakhpur - Patliputra Vande Bharat Express",
    "number": "26502 / 26501",
    "type": "VB",
    "stops": [
      "GKP",
      "PPTA"
    ]
  },
  {
    "name": "Ajni (Nagpur) - Pune Vande Bharat Express",
    "number": "26102 / 26101",
    "type": "VB",
    "stops": [
      "AJNI",
      "PUNE"
    ]
  },
  {
    "name": "Belagavi - KSR Bengaluru Vande Bharat Express",
    "number": "26751 / 26752",
    "type": "VB",
    "stops": [
      "BGM",
      "DWR",
      "SSS",
      "HVR",
      "DVG",
      "TK",
      "YPR",
      "SBC"
    ]
  },
  {
    "name": "SMVD Katra - Amritsar Vande Bharat Express",
    "number": "26406 / 26405",
    "type": "VB",
    "stops": [
      "SVDK",
      "ASR"
    ]
  },
  {
    "name": "Danapur - Jogbani Vande Bharat Express",
    "number": "26302 / 26301",
    "type": "VB",
    "stops": [
      "DNR",
      "JBN"
    ]
  },
  {
    "name": "Jodhpur - Delhi Cantt. Vande Bharat Express",
    "number": "26481 / 26482",
    "type": "VB",
    "stops": [
      "JU",
      "DEC"
    ]
  },
  {
    "name": "Bikaner - Delhi Cantt Vande Bharat Express",
    "number": "26471 / 26472",
    "type": "VB",
    "stops": [
      "BKN",
      "DEC"
    ]
  },
  {
    "name": "Firozpur Cantt. - Delhi Vande Bharat Express",
    "number": "26462 / 26461",
    "type": "VB",
    "stops": [
      "FZR",
      "DLI"
    ]
  },
  {
    "name": "KSR Bengaluru - Ernakulam Jn. Vande Bharat Express",
    "number": "26651 / 26652",
    "type": "VB",
    "stops": [
      "SBC",
      "SA",
      "ED",
      "CBE",
      "PGT",
      "TCR",
      "ERS"
    ]
  },
  {
    "name": "Banaras - Khajuraho Vande Bharat Express",
    "number": "26506 / 26505",
    "type": "VB",
    "stops": [
      "BNRS",
      "KURJ"
    ]
  },
  {
    "name": "Gomti Nagar - Saharanpur Vande Bharat Express",
    "number": "26504 / 26503",
    "type": "VB",
    "stops": [
      "GTNR",
      "SRE"
    ]
  },
  {
    "name": "Surat - Udaipur City Vande Bharat Express",
    "number": "26903 / 26904",
    "type": "VB",
    "stops": [
      "ST",
      "UDZ"
    ]
  }
];
