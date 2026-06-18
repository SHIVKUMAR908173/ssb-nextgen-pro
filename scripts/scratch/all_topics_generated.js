const ALL_TOPICS = [
  {
    "id": "afcat-ga-01-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "History of Indian Air Force (formation, milestones, evolution)"
  },
  {
    "id": "afcat-ga-01-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF in Indo-Pak Wars (1947, 1965, 1971)"
  },
  {
    "id": "afcat-ga-01-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF in Kargil War (Operation Safed Sagar)"
  },
  {
    "id": "afcat-ga-01-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "Major IAF Operations (Meghdoot, Poomalai, Cactus, Parakram, Balakot Airstrikes)"
  },
  {
    "id": "afcat-ga-01-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF Rank Structure (Airman to Air Chief Marshal)"
  },
  {
    "id": "afcat-ga-01-t06",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF Commands (Western, Eastern, Central, Southern, South-Western, Training, Maintenance)"
  },
  {
    "id": "afcat-ga-01-t07",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF Fighter Aircraft (Rafale, Su-30MKI, Tejas, MiG-29, Mirage 2000, Jaguar)"
  },
  {
    "id": "afcat-ga-01-t08",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF Helicopters (Apache AH-64E, Chinook CH-47, Prachand, Mi-17, Dhruv, Chetak)"
  },
  {
    "id": "afcat-ga-01-t09",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF Transport Aircraft (C-17 Globemaster, C-130J Super Hercules, Il-76, An-32, C-295)"
  },
  {
    "id": "afcat-ga-01-t10",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF Trainer Aircraft (Hawk, Pilatus PC-7, HTT-40, Kiran)"
  },
  {
    "id": "afcat-ga-01-t11",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF UAVs (Heron, Searcher, indigenous drones)"
  },
  {
    "id": "afcat-ga-01-t12",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF AWACS & Special Mission Aircraft (A-50, Netra)"
  },
  {
    "id": "afcat-ga-01-t13",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "Indian Missiles — Surface-to-Air (Akash, S-400)"
  },
  {
    "id": "afcat-ga-01-t14",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "Indian Missiles — Air-to-Air (Astra, Python, Derby)"
  },
  {
    "id": "afcat-ga-01-t15",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "Indian Missiles — Ballistic (Agni series, Prithvi)"
  },
  {
    "id": "afcat-ga-01-t16",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "Indian Missiles — Cruise (BrahMos, Nirbhay)"
  },
  {
    "id": "afcat-ga-01-t17",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "Indian Missiles — Anti-Tank (Nag, HELINA)"
  },
  {
    "id": "afcat-ga-01-t18",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF Bases & Stations (major locations)"
  },
  {
    "id": "afcat-ga-01-t19",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "Gallantry Awards — IAF specific (Vir Chakra, Kirti Chakra, Param Vir Chakra)"
  },
  {
    "id": "afcat-ga-01-t20",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-01",
    "title": "IAF Motto, Flag, Insignia, Air Force Day"
  },
  {
    "id": "afcat-ga-02-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-02",
    "title": "Indian Army Rank Structure & Organization"
  },
  {
    "id": "afcat-ga-02-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-02",
    "title": "Indian Navy Rank Structure & Organization"
  },
  {
    "id": "afcat-ga-02-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-02",
    "title": "Major Army Commands & Formations"
  },
  {
    "id": "afcat-ga-02-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-02",
    "title": "Naval Fleets & Commands (Western, Eastern, Southern)"
  },
  {
    "id": "afcat-ga-02-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-02",
    "title": "Key warships, submarines, aircraft carriers (INS Vikrant, INS Vikramaditya)"
  },
  {
    "id": "afcat-ga-03-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-03",
    "title": "Joint International Military Exercises (Garuda, Cope India, Red Flag, Tarang Shakti, Malabar, RIMPAC)"
  },
  {
    "id": "afcat-ga-03-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-03",
    "title": "Bilateral Defence Exercises with major countries (US, France, Russia, Japan, Australia)"
  },
  {
    "id": "afcat-ga-03-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-03",
    "title": "Recent Defence Operations & Humanitarian Missions"
  },
  {
    "id": "afcat-ga-03-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-03",
    "title": "Defence Procurement & Modernization (Make in India defence, Atmanirbhar Bharat)"
  },
  {
    "id": "afcat-ga-03-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-03",
    "title": "DRDO — Key Projects & Achievements"
  },
  {
    "id": "afcat-ga-04-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-04",
    "title": "Principles of Flight (Lift, Drag, Thrust, Weight)"
  },
  {
    "id": "afcat-ga-04-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-04",
    "title": "Basic Aerodynamics & Bernoulli's Principle"
  },
  {
    "id": "afcat-ga-04-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-04",
    "title": "Types of Aircraft (Fixed-wing, Rotary-wing, VTOL)"
  },
  {
    "id": "afcat-ga-04-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-04",
    "title": "Aviation History — Wright Brothers to modern aviation milestones"
  },
  {
    "id": "afcat-ga-05-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-05",
    "title": "Ancient India (Indus Valley, Vedic Period, Maurya, Gupta Empires)"
  },
  {
    "id": "afcat-ga-05-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-05",
    "title": "Medieval India (Delhi Sultanate, Mughal Empire, Vijayanagara, Bhakti & Sufi Movements)"
  },
  {
    "id": "afcat-ga-05-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-05",
    "title": "Modern India — British Rule & Revolt of 1857"
  },
  {
    "id": "afcat-ga-05-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-05",
    "title": "Indian National Movement (INC formation to independence)"
  },
  {
    "id": "afcat-ga-05-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-05",
    "title": "Key Freedom Fighters & their contributions"
  },
  {
    "id": "afcat-ga-05-t06",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-05",
    "title": "Post-Independence India (Integration of states, Five-Year Plans, wars)"
  },
  {
    "id": "afcat-ga-06-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-06",
    "title": "Physical Geography of India (Mountains, Plateaus, Plains, Islands)"
  },
  {
    "id": "afcat-ga-06-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-06",
    "title": "Indian River Systems (Himalayan & Peninsular rivers)"
  },
  {
    "id": "afcat-ga-06-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-06",
    "title": "Climate & Monsoons of India"
  },
  {
    "id": "afcat-ga-06-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-06",
    "title": "Soils & Vegetation Types"
  },
  {
    "id": "afcat-ga-06-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-06",
    "title": "Natural Resources & Minerals"
  },
  {
    "id": "afcat-ga-06-t06",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-06",
    "title": "Agriculture — Major crops, Green Revolution, irrigation"
  },
  {
    "id": "afcat-ga-06-t07",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-06",
    "title": "Indian States, Capitals, and Union Territories"
  },
  {
    "id": "afcat-ga-06-t08",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-06",
    "title": "Important Passes, Straits, and Water Bodies"
  },
  {
    "id": "afcat-ga-07-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Preamble & its significance"
  },
  {
    "id": "afcat-ga-07-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Fundamental Rights (Articles 12–35)"
  },
  {
    "id": "afcat-ga-07-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Directive Principles of State Policy (Articles 36–51)"
  },
  {
    "id": "afcat-ga-07-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Fundamental Duties (Article 51A)"
  },
  {
    "id": "afcat-ga-07-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Union Executive — President, PM, Council of Ministers"
  },
  {
    "id": "afcat-ga-07-t06",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Parliament — Lok Sabha, Rajya Sabha, legislative process"
  },
  {
    "id": "afcat-ga-07-t07",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "State Government structure (Governor, CM)"
  },
  {
    "id": "afcat-ga-07-t08",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Judiciary — Supreme Court, High Courts, subordinate courts"
  },
  {
    "id": "afcat-ga-07-t09",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Important Constitutional Amendments (1st, 7th, 42nd, 44th, 73rd, 74th, 86th, 101st, 106th)"
  },
  {
    "id": "afcat-ga-07-t10",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Emergency Provisions (Articles 352, 356, 360)"
  },
  {
    "id": "afcat-ga-07-t11",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Local Self-Government — Panchayati Raj & Municipalities"
  },
  {
    "id": "afcat-ga-07-t12",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Constitutional Bodies (CAG, Election Commission, UPSC, Finance Commission)"
  },
  {
    "id": "afcat-ga-07-t13",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-07",
    "title": "Schedules of the Constitution"
  },
  {
    "id": "afcat-ga-08-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Basic Economic Concepts (GDP, GNP, NI, Per Capita Income)"
  },
  {
    "id": "afcat-ga-08-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Five-Year Plans & NITI Aayog"
  },
  {
    "id": "afcat-ga-08-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Fiscal Policy — Budget, Taxation (GST, Income Tax)"
  },
  {
    "id": "afcat-ga-08-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Monetary Policy — RBI, Repo Rate, CRR, SLR"
  },
  {
    "id": "afcat-ga-08-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Banking & Financial Institutions"
  },
  {
    "id": "afcat-ga-08-t06",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Indian Agriculture & Food Security"
  },
  {
    "id": "afcat-ga-08-t07",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Poverty, Unemployment & Government Schemes"
  },
  {
    "id": "afcat-ga-08-t08",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Foreign Trade & Balance of Payments"
  },
  {
    "id": "afcat-ga-08-t09",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-08",
    "title": "Major Economic Reforms (LPG — 1991)"
  },
  {
    "id": "afcat-ga-09-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-09",
    "title": "Laws of Motion & Force (Newton's Laws)"
  },
  {
    "id": "afcat-ga-09-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-09",
    "title": "Work, Energy & Power"
  },
  {
    "id": "afcat-ga-09-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-09",
    "title": "Light — Reflection, Refraction, Lenses, Mirrors"
  },
  {
    "id": "afcat-ga-09-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-09",
    "title": "Sound — Properties, Doppler Effect, Echoes"
  },
  {
    "id": "afcat-ga-09-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-09",
    "title": "Electricity — Circuits, Ohm's Law, Heating Effects"
  },
  {
    "id": "afcat-ga-09-t06",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-09",
    "title": "Magnetism — Magnets, Electromagnetic Induction"
  },
  {
    "id": "afcat-ga-09-t07",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-09",
    "title": "Heat & Thermodynamics (Conduction, Convection, Radiation)"
  },
  {
    "id": "afcat-ga-09-t08",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-09",
    "title": "Modern Physics — Lasers, Semiconductors, Communication Systems"
  },
  {
    "id": "afcat-ga-10-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-10",
    "title": "Atoms, Molecules & Chemical Bonding"
  },
  {
    "id": "afcat-ga-10-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-10",
    "title": "States of Matter (Solid, Liquid, Gas, Plasma)"
  },
  {
    "id": "afcat-ga-10-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-10",
    "title": "Acids, Bases & Salts (pH scale, common chemicals)"
  },
  {
    "id": "afcat-ga-10-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-10",
    "title": "Metals, Non-metals & Alloys"
  },
  {
    "id": "afcat-ga-10-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-10",
    "title": "Types of Chemical Reactions"
  },
  {
    "id": "afcat-ga-10-t06",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-10",
    "title": "Carbon Compounds & Organic Chemistry Basics"
  },
  {
    "id": "afcat-ga-10-t07",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-10",
    "title": "Fuels, Polymers & Everyday Chemistry"
  },
  {
    "id": "afcat-ga-10-t08",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-10",
    "title": "Environmental Chemistry (Pollution, Ozone, Greenhouse Effect)"
  },
  {
    "id": "afcat-ga-11-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-11",
    "title": "Cell Structure & Cell Division (Mitosis, Meiosis)"
  },
  {
    "id": "afcat-ga-11-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-11",
    "title": "Human Physiology — Circulatory System"
  },
  {
    "id": "afcat-ga-11-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-11",
    "title": "Human Physiology — Respiratory & Digestive Systems"
  },
  {
    "id": "afcat-ga-11-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-11",
    "title": "Human Physiology — Nervous & Excretory Systems"
  },
  {
    "id": "afcat-ga-11-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-11",
    "title": "Nutrition, Vitamins & Deficiency Diseases"
  },
  {
    "id": "afcat-ga-11-t06",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-11",
    "title": "Common Diseases — Causes, Symptoms, Prevention (Bacterial, Viral, Protozoan)"
  },
  {
    "id": "afcat-ga-11-t07",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-11",
    "title": "Plant Biology — Photosynthesis, Tissues, Reproduction"
  },
  {
    "id": "afcat-ga-11-t08",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-11",
    "title": "Basic Genetics & Heredity"
  },
  {
    "id": "afcat-ga-12-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-12",
    "title": "National Current Affairs (last 6–12 months)"
  },
  {
    "id": "afcat-ga-12-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-12",
    "title": "International Current Affairs & Summits"
  },
  {
    "id": "afcat-ga-12-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-12",
    "title": "Defence News — New Inductions, Tests, Agreements"
  },
  {
    "id": "afcat-ga-12-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-12",
    "title": "Space & Technology — ISRO missions, satellites"
  },
  {
    "id": "afcat-ga-13-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-13",
    "title": "Major Sports Events & Trophies (Olympics, CWG, Asian Games)"
  },
  {
    "id": "afcat-ga-13-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-13",
    "title": "National & International Awards (Nobel, Bharat Ratna, Padma Awards)"
  },
  {
    "id": "afcat-ga-13-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-13",
    "title": "Books & Authors (recent notable publications)"
  },
  {
    "id": "afcat-ga-14-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-14",
    "title": "Ecosystems & Biodiversity"
  },
  {
    "id": "afcat-ga-14-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-14",
    "title": "Environmental Conservation & Wildlife (National Parks, Sanctuaries, Tiger Reserves)"
  },
  {
    "id": "afcat-ga-14-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-14",
    "title": "International Environmental Agreements (Paris, Kyoto, COP summits)"
  },
  {
    "id": "afcat-ga-15-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-15",
    "title": "Classical Dance Forms of India"
  },
  {
    "id": "afcat-ga-15-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-15",
    "title": "Music — Hindustani & Carnatic traditions"
  },
  {
    "id": "afcat-ga-15-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-15",
    "title": "Indian Architecture & UNESCO World Heritage Sites"
  },
  {
    "id": "afcat-ga-15-t04",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-15",
    "title": "Festivals, Fairs & Tribal Culture"
  },
  {
    "id": "afcat-ga-15-t05",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-15",
    "title": "Indian Paintings & Literary Traditions"
  },
  {
    "id": "afcat-ga-16-t01",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-16",
    "title": "National Days (Republic Day, Independence Day, etc.)"
  },
  {
    "id": "afcat-ga-16-t02",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-16",
    "title": "International Days (UN designated days)"
  },
  {
    "id": "afcat-ga-16-t03",
    "exam": "afcat",
    "subject": "General Awareness",
    "chapter": "afcat-ga-16",
    "title": "Defence-related Days (Air Force Day, Army Day, Navy Day)"
  },
  {
    "id": "afcat-num-01-t01",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Number System — Types of Numbers, Properties, Divisibility Rules"
  },
  {
    "id": "afcat-num-01-t02",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "HCF & LCM"
  },
  {
    "id": "afcat-num-01-t03",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Number Series & Sequences (Pattern Recognition)"
  },
  {
    "id": "afcat-num-01-t04",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Simplification & Approximation (BODMAS)"
  },
  {
    "id": "afcat-num-01-t05",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Decimal Fractions"
  },
  {
    "id": "afcat-num-01-t06",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Percentage — Calculations & Applications"
  },
  {
    "id": "afcat-num-01-t07",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Average — Simple, Weighted Average"
  },
  {
    "id": "afcat-num-01-t08",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Ratio & Proportion"
  },
  {
    "id": "afcat-num-01-t09",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Profit, Loss & Discount"
  },
  {
    "id": "afcat-num-01-t10",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Simple Interest"
  },
  {
    "id": "afcat-num-01-t11",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Compound Interest"
  },
  {
    "id": "afcat-num-01-t12",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Time & Work (including Pipes & Cisterns)"
  },
  {
    "id": "afcat-num-01-t13",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Time, Speed & Distance"
  },
  {
    "id": "afcat-num-01-t14",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Problems on Trains"
  },
  {
    "id": "afcat-num-01-t15",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Boats & Streams"
  },
  {
    "id": "afcat-num-01-t16",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Mixture & Allegation"
  },
  {
    "id": "afcat-num-01-t17",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-01",
    "title": "Clocks & Calendar Problems"
  },
  {
    "id": "afcat-num-02-t01",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-02",
    "title": "Basic Algebraic Expressions & Identities"
  },
  {
    "id": "afcat-num-02-t02",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-02",
    "title": "Linear Equations (one & two variables)"
  },
  {
    "id": "afcat-num-02-t03",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-02",
    "title": "Quadratic Equations"
  },
  {
    "id": "afcat-num-02-t04",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-02",
    "title": "Indices & Surds"
  },
  {
    "id": "afcat-num-03-t01",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-03",
    "title": "Lines, Angles & Triangles (properties, congruence, similarity)"
  },
  {
    "id": "afcat-num-03-t02",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-03",
    "title": "Circles — Properties, Arcs, Chords"
  },
  {
    "id": "afcat-num-03-t03",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-03",
    "title": "Area & Perimeter of 2D shapes (Square, Rectangle, Circle, Triangle, Parallelogram)"
  },
  {
    "id": "afcat-num-03-t04",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-03",
    "title": "Surface Area & Volume of 3D solids (Cube, Cuboid, Cylinder, Cone, Sphere)"
  },
  {
    "id": "afcat-num-04-t01",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-04",
    "title": "Trigonometric Ratios & Identities"
  },
  {
    "id": "afcat-num-04-t02",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-04",
    "title": "Heights & Distances"
  },
  {
    "id": "afcat-num-05-t01",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-05",
    "title": "Mean, Median & Mode"
  },
  {
    "id": "afcat-num-05-t02",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-05",
    "title": "Probability — Basic Concepts & Problems"
  },
  {
    "id": "afcat-num-05-t03",
    "exam": "afcat",
    "subject": "Numerical Ability",
    "chapter": "afcat-num-05",
    "title": "Data Interpretation — Bar Graphs, Pie Charts, Line Graphs, Tables"
  },
  {
    "id": "afcat-rea-01-t01",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Analogy (Word-based Relationships)"
  },
  {
    "id": "afcat-rea-01-t02",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Classification / Odd One Out"
  },
  {
    "id": "afcat-rea-01-t03",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Series Completion (Number, Alphabet, Mixed)"
  },
  {
    "id": "afcat-rea-01-t04",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Coding & Decoding"
  },
  {
    "id": "afcat-rea-01-t05",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Blood Relations"
  },
  {
    "id": "afcat-rea-01-t06",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Direction & Distance Problems"
  },
  {
    "id": "afcat-rea-01-t07",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Logical Venn Diagrams"
  },
  {
    "id": "afcat-rea-01-t08",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Alphabet Test & Ranking / Ordering"
  },
  {
    "id": "afcat-rea-01-t09",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Seating Arrangement & Puzzles (Linear, Circular)"
  },
  {
    "id": "afcat-rea-01-t10",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Syllogism / Statement & Conclusions"
  },
  {
    "id": "afcat-rea-01-t11",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Data Sufficiency"
  },
  {
    "id": "afcat-rea-01-t12",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Mathematical Operations (Symbol substitution)"
  },
  {
    "id": "afcat-rea-01-t13",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-01",
    "title": "Clocks & Calendars (Logical)"
  },
  {
    "id": "afcat-rea-02-t01",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-02",
    "title": "Figure Series Completion"
  },
  {
    "id": "afcat-rea-02-t02",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-02",
    "title": "Pattern Recognition & Completion"
  },
  {
    "id": "afcat-rea-02-t03",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-02",
    "title": "Figure Classification"
  },
  {
    "id": "afcat-rea-02-t04",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-02",
    "title": "Embedded / Hidden Figures"
  },
  {
    "id": "afcat-rea-02-t05",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-02",
    "title": "Missing Characters in Figures"
  },
  {
    "id": "afcat-rea-03-t01",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-03",
    "title": "Dot Situation Analysis"
  },
  {
    "id": "afcat-rea-03-t02",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-03",
    "title": "Rotated Blocks / Dice Problems"
  },
  {
    "id": "afcat-rea-03-t03",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-03",
    "title": "Mirror & Water Images"
  },
  {
    "id": "afcat-rea-03-t04",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-03",
    "title": "Paper Folding & Cutting"
  },
  {
    "id": "afcat-rea-03-t05",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-03",
    "title": "Spatial Orientation & Visualization"
  },
  {
    "id": "afcat-rea-03-t06",
    "exam": "afcat",
    "subject": "Reasoning",
    "chapter": "afcat-rea-03",
    "title": "Figure Matrix"
  },
  {
    "id": "afcat-eng-01-t01",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-01",
    "title": "Reading Comprehension Passages (Factual, Inferential, Analytical)"
  },
  {
    "id": "afcat-eng-02-t01",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Error Detection / Spotting Errors"
  },
  {
    "id": "afcat-eng-02-t02",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Sentence Improvement / Correction"
  },
  {
    "id": "afcat-eng-02-t03",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Tenses (Past, Present, Future & variations)"
  },
  {
    "id": "afcat-eng-02-t04",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Subject-Verb Agreement"
  },
  {
    "id": "afcat-eng-02-t05",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Articles (a, an, the)"
  },
  {
    "id": "afcat-eng-02-t06",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Prepositions"
  },
  {
    "id": "afcat-eng-02-t07",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Active & Passive Voice"
  },
  {
    "id": "afcat-eng-02-t08",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Direct & Indirect Speech (Narration)"
  },
  {
    "id": "afcat-eng-02-t09",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-02",
    "title": "Sentence Rearrangement / Para Jumbles"
  },
  {
    "id": "afcat-eng-03-t01",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-03",
    "title": "Synonyms"
  },
  {
    "id": "afcat-eng-03-t02",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-03",
    "title": "Antonyms"
  },
  {
    "id": "afcat-eng-03-t03",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-03",
    "title": "One Word Substitution"
  },
  {
    "id": "afcat-eng-03-t04",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-03",
    "title": "Spelling Correction"
  },
  {
    "id": "afcat-eng-03-t05",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-03",
    "title": "Homonyms & Homophones"
  },
  {
    "id": "afcat-eng-04-t01",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-04",
    "title": "Sentence Completion / Fill in the Blanks"
  },
  {
    "id": "afcat-eng-04-t02",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-04",
    "title": "Idioms & Phrases"
  },
  {
    "id": "afcat-eng-04-t03",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-04",
    "title": "Cloze Test (Passage with blanks)"
  },
  {
    "id": "afcat-eng-04-t04",
    "exam": "afcat",
    "subject": "English",
    "chapter": "afcat-eng-04",
    "title": "Verbal Analogy"
  },
  {
    "id": "ssb-prep-01-t01",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-01",
    "title": "OIR Test — Verbal Reasoning (word-based, analogy, classification)"
  },
  {
    "id": "ssb-prep-01-t02",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-01",
    "title": "OIR Test — Non-Verbal Reasoning (figure series, pattern, matrices)"
  },
  {
    "id": "ssb-prep-01-t03",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-01",
    "title": "PPDT — Picture Perception (identifying characters, mood, action in hazy picture)"
  },
  {
    "id": "ssb-prep-01-t04",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-01",
    "title": "PPDT — Story Writing technique (structure, positivity, OLQ reflection)"
  },
  {
    "id": "ssb-prep-01-t05",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-01",
    "title": "PPDT — Group Discussion & Narration (reaching consensus, assertiveness)"
  },
  {
    "id": "ssb-prep-02-t01",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-02",
    "title": "TAT — Thematic Apperception Test (11 pictures + 1 blank, story writing)"
  },
  {
    "id": "ssb-prep-02-t02",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-02",
    "title": "WAT — Word Association Test (60 words, 15 sec each, sentence formation)"
  },
  {
    "id": "ssb-prep-02-t03",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-02",
    "title": "SRT — Situation Reaction Test (60 situations, practical responses)"
  },
  {
    "id": "ssb-prep-02-t04",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-02",
    "title": "SD — Self Description Test (self-perception, parents/teachers/friends views)"
  },
  {
    "id": "ssb-prep-03-t01",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Group Discussion (GD) — Topics on social issues, current affairs, defence"
  },
  {
    "id": "ssb-prep-03-t02",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Group Planning Exercise (GPE) — Model-based tactical problem solving"
  },
  {
    "id": "ssb-prep-03-t03",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Progressive Group Task (PGT) — Team obstacle crossing with resources"
  },
  {
    "id": "ssb-prep-03-t04",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Half Group Task (HGT) — Smaller team obstacle task"
  },
  {
    "id": "ssb-prep-03-t05",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Lecturette — 3-minute individual talk on chosen topic (4 options)"
  },
  {
    "id": "ssb-prep-03-t06",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Snake Race / Group Obstacle Race"
  },
  {
    "id": "ssb-prep-03-t07",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Individual Obstacles — 10 physical obstacles (rope, wall, ditch, etc.)"
  },
  {
    "id": "ssb-prep-03-t08",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Command Task — Leading 2–3 members to complete an obstacle"
  },
  {
    "id": "ssb-prep-03-t09",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-03",
    "title": "Final Group Task (FGT) — Last team assessment obstacle"
  },
  {
    "id": "ssb-prep-04-t01",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "Personal Background & Family (upbringing, values, responsibilities)"
  },
  {
    "id": "ssb-prep-04-t02",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "Education & Academic Achievements"
  },
  {
    "id": "ssb-prep-04-t03",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "Hobbies & Extracurricular Activities (in-depth discussion)"
  },
  {
    "id": "ssb-prep-04-t04",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "Motivation for joining Indian Air Force/Defence"
  },
  {
    "id": "ssb-prep-04-t05",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "Knowledge of Armed Forces — Current affairs, operations"
  },
  {
    "id": "ssb-prep-04-t06",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "Situational & Behavioral Questions"
  },
  {
    "id": "ssb-prep-04-t07",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "PIQ (Personal Information Questionnaire) preparation"
  },
  {
    "id": "ssb-prep-04-t08",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "Friends & Social Life discussion"
  },
  {
    "id": "ssb-prep-04-t09",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-04",
    "title": "Strengths, Weaknesses & Self-Awareness"
  },
  {
    "id": "ssb-prep-05-t01",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-05",
    "title": "Conference Procedure — Final board assessment, do's & don'ts"
  },
  {
    "id": "ssb-prep-05-t02",
    "exam": "ssb",
    "subject": "SSB Preparation",
    "chapter": "ssb-prep-05",
    "title": "Officer Like Qualities (OLQs) — 15 qualities assessed"
  },
  {
    "id": "nda-mat-01-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Sets — Definition, Representation (Roster and Set-Builder)"
  },
  {
    "id": "nda-mat-01-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Types of Sets — Empty, Finite, Infinite, Equal, Subset, Power Set, Universal"
  },
  {
    "id": "nda-mat-01-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Set Operations — Union, Intersection, Difference, Complement"
  },
  {
    "id": "nda-mat-01-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Venn Diagrams and Applications"
  },
  {
    "id": "nda-mat-01-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "De Morgan's Laws"
  },
  {
    "id": "nda-mat-01-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Cartesian Product of Sets"
  },
  {
    "id": "nda-mat-01-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Relations — Domain, Range, Co-domain"
  },
  {
    "id": "nda-mat-01-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Types of Relations — Reflexive, Symmetric, Transitive, Equivalence"
  },
  {
    "id": "nda-mat-01-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Functions — Concept, Domain, Range, Graph"
  },
  {
    "id": "nda-mat-01-t10",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Types of Functions — One-to-One, Onto, Bijective, Inverse"
  },
  {
    "id": "nda-mat-01-t11",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-01",
    "title": "Composite Functions"
  },
  {
    "id": "nda-mat-02-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-02",
    "title": "Real Numbers — Representation on Number Line"
  },
  {
    "id": "nda-mat-02-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-02",
    "title": "Complex Numbers — Basic Properties and Operations"
  },
  {
    "id": "nda-mat-02-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-02",
    "title": "Modulus and Argument of a Complex Number"
  },
  {
    "id": "nda-mat-02-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-02",
    "title": "Conjugate of a Complex Number"
  },
  {
    "id": "nda-mat-02-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-02",
    "title": "Cube Roots of Unity"
  },
  {
    "id": "nda-mat-02-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-02",
    "title": "Binary Number System — Conversion to/from Decimal"
  },
  {
    "id": "nda-mat-03-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-03",
    "title": "Quadratic Equations with Real Coefficients"
  },
  {
    "id": "nda-mat-03-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-03",
    "title": "Relation Between Roots and Coefficients"
  },
  {
    "id": "nda-mat-03-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-03",
    "title": "Nature of Roots — Discriminant"
  },
  {
    "id": "nda-mat-03-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-03",
    "title": "Formation of Quadratic Equations from Given Roots"
  },
  {
    "id": "nda-mat-03-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-03",
    "title": "Linear Inequations — Graphical Solution"
  },
  {
    "id": "nda-mat-04-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-04",
    "title": "Fundamental Principle of Counting"
  },
  {
    "id": "nda-mat-04-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-04",
    "title": "Permutations (nPr) — Formulae and Problems"
  },
  {
    "id": "nda-mat-04-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-04",
    "title": "Combinations (nCr) — Formulae and Problems"
  },
  {
    "id": "nda-mat-04-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-04",
    "title": "Applications and Word Problems"
  },
  {
    "id": "nda-mat-05-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-05",
    "title": "Binomial Theorem for Positive Integral Index"
  },
  {
    "id": "nda-mat-05-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-05",
    "title": "General Term and Middle Term"
  },
  {
    "id": "nda-mat-05-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-05",
    "title": "Binomial Coefficients and Properties"
  },
  {
    "id": "nda-mat-05-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-05",
    "title": "Applications of Binomial Theorem"
  },
  {
    "id": "nda-mat-06-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-06",
    "title": "Arithmetic Progression — nth Term, Sum of n Terms"
  },
  {
    "id": "nda-mat-06-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-06",
    "title": "Geometric Progression — nth Term, Sum of n Terms, Sum to Infinity"
  },
  {
    "id": "nda-mat-06-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-06",
    "title": "Harmonic Progression — Basics"
  },
  {
    "id": "nda-mat-06-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-06",
    "title": "Relation Between AM, GM, HM"
  },
  {
    "id": "nda-mat-06-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-06",
    "title": "Special Series — Sum of Squares, Cubes of First n Natural Numbers"
  },
  {
    "id": "nda-mat-07-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-07",
    "title": "Definition and Laws of Logarithms"
  },
  {
    "id": "nda-mat-07-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-07",
    "title": "Common and Natural Logarithms"
  },
  {
    "id": "nda-mat-07-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-07",
    "title": "Applications of Logarithms"
  },
  {
    "id": "nda-mat-08-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "Types of Matrices — Row, Column, Square, Diagonal, Scalar, Identity, Zero"
  },
  {
    "id": "nda-mat-08-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "Operations on Matrices — Addition, Scalar Multiplication, Matrix Multiplication"
  },
  {
    "id": "nda-mat-08-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "Transpose, Symmetric and Skew-Symmetric Matrices"
  },
  {
    "id": "nda-mat-08-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "Determinants — Definition and Evaluation (2x2, 3x3)"
  },
  {
    "id": "nda-mat-08-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "Properties of Determinants"
  },
  {
    "id": "nda-mat-08-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "Minors and Cofactors"
  },
  {
    "id": "nda-mat-08-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "Adjoint and Inverse of a Matrix"
  },
  {
    "id": "nda-mat-08-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "System of Linear Equations — Cramer's Rule"
  },
  {
    "id": "nda-mat-08-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-08",
    "title": "System of Linear Equations — Matrix Method"
  },
  {
    "id": "nda-mat-09-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Angles — Degrees and Radians"
  },
  {
    "id": "nda-mat-09-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Trigonometric Ratios and Standard Values"
  },
  {
    "id": "nda-mat-09-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Pythagorean, Reciprocal and Quotient Identities"
  },
  {
    "id": "nda-mat-09-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Trigonometric Ratios of Allied Angles"
  },
  {
    "id": "nda-mat-09-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Sum and Difference (Compound Angle) Formulas"
  },
  {
    "id": "nda-mat-09-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Double and Triple Angle Formulas"
  },
  {
    "id": "nda-mat-09-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Sub-Multiple Angle Formulas (Half Angle)"
  },
  {
    "id": "nda-mat-09-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Product-to-Sum and Sum-to-Product Formulas"
  },
  {
    "id": "nda-mat-09-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Trigonometric Equations — General Solutions"
  },
  {
    "id": "nda-mat-09-t10",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Inverse Trigonometric Functions — Domain, Range, Principal Values"
  },
  {
    "id": "nda-mat-09-t11",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Properties of Inverse Trigonometric Functions"
  },
  {
    "id": "nda-mat-09-t12",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Heights and Distances Applications"
  },
  {
    "id": "nda-mat-09-t13",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-09",
    "title": "Properties of Triangles — Sine, Cosine, Tangent Rule, Area"
  },
  {
    "id": "nda-mat-10-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Cartesian Coordinate System"
  },
  {
    "id": "nda-mat-10-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Distance Formula Between Two Points"
  },
  {
    "id": "nda-mat-10-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Section Formula — Internal and External Division"
  },
  {
    "id": "nda-mat-10-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Area of Triangle Using Coordinates"
  },
  {
    "id": "nda-mat-10-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Straight Line — Slope-Intercept Form"
  },
  {
    "id": "nda-mat-10-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Straight Line — Point-Slope, Two-Point, Intercept, Normal Forms"
  },
  {
    "id": "nda-mat-10-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Angle Between Two Lines, Parallelism and Perpendicularity"
  },
  {
    "id": "nda-mat-10-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Distance of a Point from a Line"
  },
  {
    "id": "nda-mat-10-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Equation of Circle — Standard and General Form"
  },
  {
    "id": "nda-mat-10-t10",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Parametric Equations of a Circle"
  },
  {
    "id": "nda-mat-10-t11",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Parabola — Standard Forms and Properties"
  },
  {
    "id": "nda-mat-10-t12",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Ellipse — Standard Form, Eccentricity, Foci, Directrix"
  },
  {
    "id": "nda-mat-10-t13",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-10",
    "title": "Hyperbola — Standard Form, Asymptotes"
  },
  {
    "id": "nda-mat-11-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Coordinates in 3D Space"
  },
  {
    "id": "nda-mat-11-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Distance Between Two Points in 3D"
  },
  {
    "id": "nda-mat-11-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Section Formula in 3D"
  },
  {
    "id": "nda-mat-11-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Direction Cosines and Direction Ratios"
  },
  {
    "id": "nda-mat-11-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Equation of Line in 3D — Cartesian and Parametric"
  },
  {
    "id": "nda-mat-11-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Equation of Plane — Various Forms"
  },
  {
    "id": "nda-mat-11-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Angle Between Lines, Planes, Line and Plane"
  },
  {
    "id": "nda-mat-11-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Distance of a Point from a Plane"
  },
  {
    "id": "nda-mat-11-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-11",
    "title": "Equation of Sphere — Standard and General Form"
  },
  {
    "id": "nda-mat-12-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Real-Valued Functions — Domain, Range, Graph"
  },
  {
    "id": "nda-mat-12-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Composite, One-to-One, Onto, Inverse Functions"
  },
  {
    "id": "nda-mat-12-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Limits — Definition and Standard Results"
  },
  {
    "id": "nda-mat-12-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Continuity and Types of Discontinuity"
  },
  {
    "id": "nda-mat-12-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Algebraic Operations on Continuous Functions"
  },
  {
    "id": "nda-mat-12-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Derivative — First Principles and Geometrical Interpretation"
  },
  {
    "id": "nda-mat-12-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Physical Interpretation — Velocity, Rate of Change"
  },
  {
    "id": "nda-mat-12-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Derivatives of Sum, Difference, Product, Quotient"
  },
  {
    "id": "nda-mat-12-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Chain Rule — Derivative of Composite Functions"
  },
  {
    "id": "nda-mat-12-t10",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Derivatives of Trig, Exponential, Logarithmic, Implicit Functions"
  },
  {
    "id": "nda-mat-12-t11",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Second-Order Derivatives"
  },
  {
    "id": "nda-mat-12-t12",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Increasing and Decreasing Functions"
  },
  {
    "id": "nda-mat-12-t13",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Maxima and Minima — Word Problems"
  },
  {
    "id": "nda-mat-12-t14",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-12",
    "title": "Tangents and Normals"
  },
  {
    "id": "nda-mat-13-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Integration as Inverse of Differentiation"
  },
  {
    "id": "nda-mat-13-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Integration by Substitution"
  },
  {
    "id": "nda-mat-13-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Integration by Parts"
  },
  {
    "id": "nda-mat-13-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Integration by Partial Fractions"
  },
  {
    "id": "nda-mat-13-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Standard Integrals — Algebraic Expressions"
  },
  {
    "id": "nda-mat-13-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Standard Integrals — Trigonometric Functions"
  },
  {
    "id": "nda-mat-13-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Standard Integrals — Exponential Functions"
  },
  {
    "id": "nda-mat-13-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Standard Integrals — Hyperbolic Functions"
  },
  {
    "id": "nda-mat-13-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Definite Integrals — Definition and Evaluation"
  },
  {
    "id": "nda-mat-13-t10",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Properties of Definite Integrals"
  },
  {
    "id": "nda-mat-13-t11",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-13",
    "title": "Area Under Curves and Between Curves"
  },
  {
    "id": "nda-mat-14-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-14",
    "title": "Order and Degree of Differential Equations"
  },
  {
    "id": "nda-mat-14-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-14",
    "title": "Formation by Elimination of Constants"
  },
  {
    "id": "nda-mat-14-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-14",
    "title": "General and Particular Solutions"
  },
  {
    "id": "nda-mat-14-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-14",
    "title": "Variable Separable Method"
  },
  {
    "id": "nda-mat-14-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-14",
    "title": "Homogeneous Differential Equations"
  },
  {
    "id": "nda-mat-14-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-14",
    "title": "Linear Differential Equations (First Order)"
  },
  {
    "id": "nda-mat-14-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-14",
    "title": "Applications — Growth and Decay Problems"
  },
  {
    "id": "nda-mat-15-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Vectors in 2D and 3D — Magnitude and Direction"
  },
  {
    "id": "nda-mat-15-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Unit Vectors and Null Vectors"
  },
  {
    "id": "nda-mat-15-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Position Vectors"
  },
  {
    "id": "nda-mat-15-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Addition and Subtraction of Vectors"
  },
  {
    "id": "nda-mat-15-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Scalar Multiplication"
  },
  {
    "id": "nda-mat-15-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Scalar (Dot) Product — Properties and Applications"
  },
  {
    "id": "nda-mat-15-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Vector (Cross) Product — Properties and Applications"
  },
  {
    "id": "nda-mat-15-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Scalar Triple Product and Applications"
  },
  {
    "id": "nda-mat-15-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-15",
    "title": "Applications — Work Done, Moment of Force"
  },
  {
    "id": "nda-mat-16-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Classification of Data — Frequency Distribution"
  },
  {
    "id": "nda-mat-16-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Cumulative Frequency Distribution"
  },
  {
    "id": "nda-mat-16-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Graphical Representation — Histogram, Pie Chart, Ogive"
  },
  {
    "id": "nda-mat-16-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Measures of Central Tendency — Mean"
  },
  {
    "id": "nda-mat-16-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Measures of Central Tendency — Median"
  },
  {
    "id": "nda-mat-16-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Measures of Central Tendency — Mode"
  },
  {
    "id": "nda-mat-16-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Measures of Dispersion — Variance"
  },
  {
    "id": "nda-mat-16-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Measures of Dispersion — Standard Deviation"
  },
  {
    "id": "nda-mat-16-t09",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-16",
    "title": "Correlation and Regression Basics"
  },
  {
    "id": "nda-mat-17-t01",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-17",
    "title": "Random Experiments and Sample Space"
  },
  {
    "id": "nda-mat-17-t02",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-17",
    "title": "Types of Events — Mutually Exclusive, Exhaustive, Complementary"
  },
  {
    "id": "nda-mat-17-t03",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-17",
    "title": "Classical and Statistical Probability"
  },
  {
    "id": "nda-mat-17-t04",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-17",
    "title": "Addition and Multiplication Theorems"
  },
  {
    "id": "nda-mat-17-t05",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-17",
    "title": "Conditional Probability"
  },
  {
    "id": "nda-mat-17-t06",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-17",
    "title": "Bayes' Theorem and Applications"
  },
  {
    "id": "nda-mat-17-t07",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-17",
    "title": "Random Variables and Probability Distributions"
  },
  {
    "id": "nda-mat-17-t08",
    "exam": "nda",
    "subject": "Mathematics",
    "chapter": "nda-mat-17",
    "title": "Binomial Distribution"
  },
  {
    "id": "nda-eng-01-t01",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Parts of Speech — Nouns, Pronouns, Verbs, Adjectives, Adverbs"
  },
  {
    "id": "nda-eng-01-t02",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Tenses — Present, Past, Future and All Forms"
  },
  {
    "id": "nda-eng-01-t03",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Subject-Verb Agreement"
  },
  {
    "id": "nda-eng-01-t04",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Active and Passive Voice Conversion"
  },
  {
    "id": "nda-eng-01-t05",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Direct and Indirect Speech Conversion"
  },
  {
    "id": "nda-eng-01-t06",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Articles and Determiners"
  },
  {
    "id": "nda-eng-01-t07",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Degrees of Comparison"
  },
  {
    "id": "nda-eng-01-t08",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Sentence Structure and Punctuation"
  },
  {
    "id": "nda-eng-01-t09",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Spotting Errors in Sentences"
  },
  {
    "id": "nda-eng-01-t10",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-01",
    "title": "Sentence Improvement and Correction"
  },
  {
    "id": "nda-eng-02-t01",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "Synonyms and Antonyms"
  },
  {
    "id": "nda-eng-02-t02",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "Idioms and Phrases"
  },
  {
    "id": "nda-eng-02-t03",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "One-Word Substitution"
  },
  {
    "id": "nda-eng-02-t04",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "Commonly Confused Words and Homophones"
  },
  {
    "id": "nda-eng-02-t05",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "Spelling Correction"
  },
  {
    "id": "nda-eng-02-t06",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "Reading Comprehension Passages"
  },
  {
    "id": "nda-eng-02-t07",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "Para Jumbles — Sentence Rearrangement"
  },
  {
    "id": "nda-eng-02-t08",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "Cloze Test"
  },
  {
    "id": "nda-eng-02-t09",
    "exam": "nda",
    "subject": "English",
    "chapter": "nda-eng-02",
    "title": "Fill in the Blanks"
  },
  {
    "id": "nda-phy-01-t01",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Physical Properties and States of Matter"
  },
  {
    "id": "nda-phy-01-t02",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Mass, Weight, Volume, Density, Specific Gravity"
  },
  {
    "id": "nda-phy-01-t03",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Archimedes' Principle and Buoyancy"
  },
  {
    "id": "nda-phy-01-t04",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Pressure and Barometer"
  },
  {
    "id": "nda-phy-01-t05",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Motion — Velocity and Acceleration"
  },
  {
    "id": "nda-phy-01-t06",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Newton's Laws of Motion"
  },
  {
    "id": "nda-phy-01-t07",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Force, Momentum and Impulse"
  },
  {
    "id": "nda-phy-01-t08",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Parallelogram of Forces"
  },
  {
    "id": "nda-phy-01-t09",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Stability, Equilibrium and Centre of Gravity"
  },
  {
    "id": "nda-phy-01-t10",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Gravitation — Universal Law"
  },
  {
    "id": "nda-phy-01-t11",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Work, Power and Energy — Conservation"
  },
  {
    "id": "nda-phy-01-t12",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-01",
    "title": "Simple Pendulum, Pulleys, Levers, Inclined Plane"
  },
  {
    "id": "nda-phy-02-t01",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-02",
    "title": "Modes of Heat Transfer — Conduction, Convection, Radiation"
  },
  {
    "id": "nda-phy-02-t02",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-02",
    "title": "Measurement of Temperature and Calorimetry"
  },
  {
    "id": "nda-phy-02-t03",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-02",
    "title": "Effects of Heat — Thermal Expansion"
  },
  {
    "id": "nda-phy-02-t04",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-02",
    "title": "Change of State — Melting, Boiling, Latent Heat"
  },
  {
    "id": "nda-phy-02-t05",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-02",
    "title": "Specific Heat Capacity"
  },
  {
    "id": "nda-phy-03-t01",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-03",
    "title": "Sound Waves — Nature, Propagation, Properties"
  },
  {
    "id": "nda-phy-03-t02",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-03",
    "title": "Characteristics — Pitch, Loudness, Quality"
  },
  {
    "id": "nda-phy-03-t03",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-03",
    "title": "Simple Musical Instruments and Acoustics"
  },
  {
    "id": "nda-phy-03-t04",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-03",
    "title": "Echo and Resonance"
  },
  {
    "id": "nda-phy-04-t01",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-04",
    "title": "Rectilinear Propagation of Light"
  },
  {
    "id": "nda-phy-04-t02",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-04",
    "title": "Reflection — Laws, Plane and Spherical Mirrors"
  },
  {
    "id": "nda-phy-04-t03",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-04",
    "title": "Refraction — Laws, Total Internal Reflection"
  },
  {
    "id": "nda-phy-04-t04",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-04",
    "title": "Lenses — Convex, Concave, Image Formation"
  },
  {
    "id": "nda-phy-04-t05",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-04",
    "title": "Human Eye — Structure, Defects, Corrections"
  },
  {
    "id": "nda-phy-05-t01",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-05",
    "title": "Static Electricity — Charge, Coulomb's Law"
  },
  {
    "id": "nda-phy-05-t02",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-05",
    "title": "Current Electricity — Current, Potential Difference, EMF"
  },
  {
    "id": "nda-phy-05-t03",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-05",
    "title": "Ohm's Law — Resistance, Series and Parallel Circuits"
  },
  {
    "id": "nda-phy-05-t04",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-05",
    "title": "Conductors, Insulators, Semiconductors"
  },
  {
    "id": "nda-phy-05-t05",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-05",
    "title": "Heating Effect of Current — Power"
  },
  {
    "id": "nda-phy-05-t06",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-05",
    "title": "Lighting Effect of Current"
  },
  {
    "id": "nda-phy-05-t07",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-05",
    "title": "Primary and Secondary Cells (Batteries)"
  },
  {
    "id": "nda-phy-06-t01",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-06",
    "title": "Natural and Artificial Magnets — Properties"
  },
  {
    "id": "nda-phy-06-t02",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-06",
    "title": "Earth as a Magnet — Magnetic Field, Compass"
  },
  {
    "id": "nda-phy-06-t03",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-06",
    "title": "Magnetic Effect of Electric Current — Electromagnets"
  },
  {
    "id": "nda-phy-06-t04",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-06",
    "title": "Electric Motors and Generators"
  },
  {
    "id": "nda-phy-07-t01",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-07",
    "title": "Siphon, Pumps, Hydraulic Press"
  },
  {
    "id": "nda-phy-07-t02",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-07",
    "title": "Balloon, Hydrometer, Pressure Cooker, Thermos Flask"
  },
  {
    "id": "nda-phy-07-t03",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-07",
    "title": "Periscope, Telescope, Microscope"
  },
  {
    "id": "nda-phy-07-t04",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-07",
    "title": "Lightning Conductor and Safety Fuses"
  },
  {
    "id": "nda-phy-07-t05",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-07",
    "title": "X-Rays — Properties and Uses"
  },
  {
    "id": "nda-phy-07-t06",
    "exam": "nda",
    "subject": "Physics",
    "chapter": "nda-phy-07",
    "title": "Gramophone, Telegraph, Telephone"
  },
  {
    "id": "nda-che-01-t01",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-01",
    "title": "Physical and Chemical Changes — Distinction"
  },
  {
    "id": "nda-che-01-t02",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-01",
    "title": "Elements, Compounds and Mixtures"
  },
  {
    "id": "nda-che-01-t03",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-01",
    "title": "Symbols, Formulae, Chemical Equations — Balancing"
  },
  {
    "id": "nda-che-01-t04",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-01",
    "title": "Law of Chemical Combination"
  },
  {
    "id": "nda-che-02-t01",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-02",
    "title": "Structure of Atom — Proton, Neutron, Electron"
  },
  {
    "id": "nda-che-02-t02",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-02",
    "title": "Atomic Number, Mass Number, Isotopes, Isobars"
  },
  {
    "id": "nda-che-02-t03",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-02",
    "title": "Valency and Chemical Bonding (Ionic, Covalent)"
  },
  {
    "id": "nda-che-02-t04",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-02",
    "title": "Periodic Table — Trends and Classification"
  },
  {
    "id": "nda-che-03-t01",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-03",
    "title": "Properties of Air and Water"
  },
  {
    "id": "nda-che-03-t02",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-03",
    "title": "Preparation and Properties of Hydrogen"
  },
  {
    "id": "nda-che-03-t03",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-03",
    "title": "Preparation and Properties of Oxygen"
  },
  {
    "id": "nda-che-03-t04",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-03",
    "title": "Preparation and Properties of Nitrogen"
  },
  {
    "id": "nda-che-03-t05",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-03",
    "title": "Preparation and Properties of Carbon Dioxide"
  },
  {
    "id": "nda-che-04-t01",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-04",
    "title": "Oxidation and Reduction Concepts"
  },
  {
    "id": "nda-che-04-t02",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-04",
    "title": "Types of Chemical Reactions"
  },
  {
    "id": "nda-che-04-t03",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-04",
    "title": "Exothermic and Endothermic Reactions"
  },
  {
    "id": "nda-che-04-t04",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-04",
    "title": "Acids, Bases and Salts — pH Scale"
  },
  {
    "id": "nda-che-05-t01",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-05",
    "title": "Metals and Non-Metals"
  },
  {
    "id": "nda-che-05-t02",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-05",
    "title": "Extraction of Metals — Basic Metallurgy"
  },
  {
    "id": "nda-che-05-t03",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-05",
    "title": "Alloys — Composition and Uses"
  },
  {
    "id": "nda-che-05-t04",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-05",
    "title": "Carbon and its Allotropes (Diamond, Graphite)"
  },
  {
    "id": "nda-che-05-t05",
    "exam": "nda",
    "subject": "Chemistry",
    "chapter": "nda-che-05",
    "title": "Important Compounds — Soap, Glass, Ink, Paper, Cement, Fertilizers"
  },
  {
    "id": "nda-bio-01-t01",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-01",
    "title": "Difference between Living and Non-living"
  },
  {
    "id": "nda-bio-01-t02",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-01",
    "title": "Basis of Life — Cells, Protoplasm and Tissues"
  },
  {
    "id": "nda-bio-01-t03",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-01",
    "title": "Plant and Animal Cell Structure"
  },
  {
    "id": "nda-bio-01-t04",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-01",
    "title": "Growth and Reproduction in Plants and Animals"
  },
  {
    "id": "nda-bio-01-t05",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-01",
    "title": "Elementary Knowledge of Human Body and its Important Organs"
  },
  {
    "id": "nda-bio-02-t01",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-02",
    "title": "Common Epidemics, their Causes and Prevention"
  },
  {
    "id": "nda-bio-02-t02",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-02",
    "title": "Food — Source of Energy for Man"
  },
  {
    "id": "nda-bio-02-t03",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-02",
    "title": "Constituents of Food, Balanced Diet"
  },
  {
    "id": "nda-bio-02-t04",
    "exam": "nda",
    "subject": "Biology",
    "chapter": "nda-bio-02",
    "title": "Solar System — Meteors and Comets, Eclipses"
  },
  {
    "id": "nda-his-01-t01",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-01",
    "title": "Ancient India — Indus Valley Civilization"
  },
  {
    "id": "nda-his-01-t02",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-01",
    "title": "Vedic Period and Early Society"
  },
  {
    "id": "nda-his-01-t03",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-01",
    "title": "Buddhism and Jainism"
  },
  {
    "id": "nda-his-01-t04",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-01",
    "title": "Mauryan Empire — Ashoka's Dhamma"
  },
  {
    "id": "nda-his-01-t05",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-01",
    "title": "Gupta Empire and Golden Age"
  },
  {
    "id": "nda-his-02-t01",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-02",
    "title": "Medieval India — Delhi Sultanate"
  },
  {
    "id": "nda-his-02-t02",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-02",
    "title": "Mughal Empire — Akbar to Aurangzeb"
  },
  {
    "id": "nda-his-02-t03",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-02",
    "title": "Maratha Empire and Shivaji"
  },
  {
    "id": "nda-his-02-t04",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-02",
    "title": "Bhakti and Sufi Movements"
  },
  {
    "id": "nda-his-03-t01",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-03",
    "title": "Modern India — Advent of Europeans"
  },
  {
    "id": "nda-his-03-t02",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-03",
    "title": "British Expansion and Impact"
  },
  {
    "id": "nda-his-03-t03",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-03",
    "title": "Revolt of 1857"
  },
  {
    "id": "nda-his-03-t04",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-03",
    "title": "Indian National Congress Formation"
  },
  {
    "id": "nda-his-03-t05",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-03",
    "title": "Freedom Movement — Extremists and Moderates"
  },
  {
    "id": "nda-his-03-t06",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-03",
    "title": "Gandhian Era — Non-Cooperation, Civil Disobedience, Quit India"
  },
  {
    "id": "nda-his-03-t07",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-03",
    "title": "Important Personalities of Freedom Struggle"
  },
  {
    "id": "nda-his-04-t01",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-04",
    "title": "French Revolution"
  },
  {
    "id": "nda-his-04-t02",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-04",
    "title": "Russian Revolution"
  },
  {
    "id": "nda-his-04-t03",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-04",
    "title": "Industrial Revolution"
  },
  {
    "id": "nda-his-04-t04",
    "exam": "nda",
    "subject": "History",
    "chapter": "nda-his-04",
    "title": "World War I and II Basics"
  },
  {
    "id": "nda-geo-01-t01",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-01",
    "title": "Earth — Shape, Size, Latitudes, Longitudes"
  },
  {
    "id": "nda-geo-01-t02",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-01",
    "title": "Movements of Earth — Rotation and Revolution"
  },
  {
    "id": "nda-geo-01-t03",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-01",
    "title": "Origin of Earth and Solar System"
  },
  {
    "id": "nda-geo-01-t04",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-01",
    "title": "Rocks and their Classification"
  },
  {
    "id": "nda-geo-01-t05",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-01",
    "title": "Earthquakes and Volcanoes"
  },
  {
    "id": "nda-geo-01-t06",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-01",
    "title": "Ocean Currents and Tides"
  },
  {
    "id": "nda-geo-02-t01",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-02",
    "title": "Atmosphere — Composition and Structure"
  },
  {
    "id": "nda-geo-02-t02",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-02",
    "title": "Temperature and Pressure Belts"
  },
  {
    "id": "nda-geo-02-t03",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-02",
    "title": "Wind Systems and Cyclones"
  },
  {
    "id": "nda-geo-02-t04",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-02",
    "title": "Types of Rainfall"
  },
  {
    "id": "nda-geo-02-t05",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-02",
    "title": "Major Climatic Regions of the World"
  },
  {
    "id": "nda-geo-03-t01",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-03",
    "title": "Physical Features of India — Himalayas, Plains, Peninsula"
  },
  {
    "id": "nda-geo-03-t02",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-03",
    "title": "River Systems of India"
  },
  {
    "id": "nda-geo-03-t03",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-03",
    "title": "Climate of India — Monsoons"
  },
  {
    "id": "nda-geo-03-t04",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-03",
    "title": "Soils and Natural Vegetation of India"
  },
  {
    "id": "nda-geo-03-t05",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-03",
    "title": "Mineral and Power Resources in India"
  },
  {
    "id": "nda-geo-03-t06",
    "exam": "nda",
    "subject": "Geography",
    "chapter": "nda-geo-03",
    "title": "Agriculture and Industries in India"
  },
  {
    "id": "nda-cur-01-t01",
    "exam": "nda",
    "subject": "Current Affairs",
    "chapter": "nda-cur-01",
    "title": "Important Recent National Events"
  },
  {
    "id": "nda-cur-01-t02",
    "exam": "nda",
    "subject": "Current Affairs",
    "chapter": "nda-cur-01",
    "title": "Important Recent International Events"
  },
  {
    "id": "nda-cur-01-t03",
    "exam": "nda",
    "subject": "Current Affairs",
    "chapter": "nda-cur-01",
    "title": "Prominent Personalities in News"
  },
  {
    "id": "nda-cur-01-t04",
    "exam": "nda",
    "subject": "Current Affairs",
    "chapter": "nda-cur-01",
    "title": "Sports and Awards"
  },
  {
    "id": "nda-cur-01-t05",
    "exam": "nda",
    "subject": "Current Affairs",
    "chapter": "nda-cur-01",
    "title": "Defence Updates — New Inductions, Exercises"
  },
  {
    "id": "cds-mat-01-t01",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Number System — Natural Numbers, Integers, Rational & Real"
  },
  {
    "id": "cds-mat-01-t02",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Fundamental Operations — Addition, Subtraction, Multiplication, Division"
  },
  {
    "id": "cds-mat-01-t03",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Square Roots & Cube Roots"
  },
  {
    "id": "cds-mat-01-t04",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Decimal Fractions"
  },
  {
    "id": "cds-mat-01-t05",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Unitary Method"
  },
  {
    "id": "cds-mat-01-t06",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Time and Distance"
  },
  {
    "id": "cds-mat-01-t07",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Time and Work"
  },
  {
    "id": "cds-mat-01-t08",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Percentages"
  },
  {
    "id": "cds-mat-01-t09",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Applications to Simple and Compound Interest"
  },
  {
    "id": "cds-mat-01-t10",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Profit and Loss"
  },
  {
    "id": "cds-mat-01-t11",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Ratio and Proportion"
  },
  {
    "id": "cds-mat-01-t12",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Variation"
  },
  {
    "id": "cds-mat-01-t13",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Basic Operations in Algebra"
  },
  {
    "id": "cds-mat-01-t14",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Simple Factors"
  },
  {
    "id": "cds-mat-01-t15",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Remainder Theorem"
  },
  {
    "id": "cds-mat-01-t16",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "HCF and LCM"
  },
  {
    "id": "cds-mat-01-t17",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Theory of Polynomials"
  },
  {
    "id": "cds-mat-01-t18",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Solutions of Quadratic Equations"
  },
  {
    "id": "cds-mat-01-t19",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Relation between its Roots and Coefficients"
  },
  {
    "id": "cds-mat-01-t20",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Simultaneous Linear Equations in Two Unknowns"
  },
  {
    "id": "cds-mat-01-t21",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Analytical and Graphical Solutions"
  },
  {
    "id": "cds-mat-01-t22",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Simultaneous Linear Inequations in Two Variables"
  },
  {
    "id": "cds-mat-01-t23",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Practical Problems on Simultaneous Linear Equations"
  },
  {
    "id": "cds-mat-01-t24",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Set Language and Set Notation"
  },
  {
    "id": "cds-mat-01-t25",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Rational Expressions and Conditional Identities"
  },
  {
    "id": "cds-mat-01-t26",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Laws of Indices"
  },
  {
    "id": "cds-mat-01-t27",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Sine × Cosine, Tangent, Secant, Cosecant, Cotangent values"
  },
  {
    "id": "cds-mat-01-t28",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Trigonometric Identities"
  },
  {
    "id": "cds-mat-01-t29",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Use of Trigonometric Tables"
  },
  {
    "id": "cds-mat-01-t30",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Simple Cases of Heights and Distances"
  },
  {
    "id": "cds-mat-01-t31",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Lines and Angles"
  },
  {
    "id": "cds-mat-01-t32",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Plane and Plane Figures"
  },
  {
    "id": "cds-mat-01-t33",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Theorems on Properties of Angles at a Point"
  },
  {
    "id": "cds-mat-01-t34",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Parallel Lines"
  },
  {
    "id": "cds-mat-01-t35",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Sides and Angles of a Triangle"
  },
  {
    "id": "cds-mat-01-t36",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Congruency of Triangles"
  },
  {
    "id": "cds-mat-01-t37",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Similar Triangles"
  },
  {
    "id": "cds-mat-01-t38",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Concurrence of Medians and Altitudes"
  },
  {
    "id": "cds-mat-01-t39",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Properties of Angles, Sides and Diagonals of a Parallelogram"
  },
  {
    "id": "cds-mat-01-t40",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Rectangle and Square properties"
  },
  {
    "id": "cds-mat-01-t41",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Circles and its properties"
  },
  {
    "id": "cds-mat-01-t42",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Tangents and Normals"
  },
  {
    "id": "cds-mat-01-t43",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Loci problems"
  },
  {
    "id": "cds-mat-01-t44",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Areas of Squares, Rectangles, Parallelograms, Triangle and Circle"
  },
  {
    "id": "cds-mat-01-t45",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Areas of Figures which can be split up"
  },
  {
    "id": "cds-mat-01-t46",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Surface area and volume of Cuboids"
  },
  {
    "id": "cds-mat-01-t47",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Surface area and volume of lateral Surface and volume of right circular cones"
  },
  {
    "id": "cds-mat-01-t48",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Surface area and volume of cylinders"
  },
  {
    "id": "cds-mat-01-t49",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Surface area and volume of spheres"
  },
  {
    "id": "cds-mat-01-t50",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Collection and Tabulation of Statistical Data"
  },
  {
    "id": "cds-mat-01-t51",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Graphical Representation — Frequency Polygons, Histograms"
  },
  {
    "id": "cds-mat-01-t52",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Bar Charts"
  },
  {
    "id": "cds-mat-01-t53",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Pie Charts"
  },
  {
    "id": "cds-mat-01-t54",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-01",
    "title": "Measures of Central Tendency"
  },
  {
    "id": "cds-eng-01-t01",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Reading Comprehension Passages"
  },
  {
    "id": "cds-eng-01-t02",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Spotting Errors in Sentences"
  },
  {
    "id": "cds-eng-01-t03",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Sentence Improvement / Correction"
  },
  {
    "id": "cds-eng-01-t04",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Synonyms and Antonyms"
  },
  {
    "id": "cds-eng-01-t05",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Idioms and Phrases"
  },
  {
    "id": "cds-eng-01-t06",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Fill in the Blanks"
  },
  {
    "id": "cds-eng-01-t07",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Cloze Test"
  },
  {
    "id": "cds-eng-01-t08",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Para Jumbles (Sentence Arrangement)"
  },
  {
    "id": "cds-eng-01-t09",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Word Substitution"
  },
  {
    "id": "cds-eng-01-t10",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Active and Passive Voice Conversion"
  },
  {
    "id": "cds-eng-01-t11",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Direct and Indirect Speech"
  },
  {
    "id": "cds-eng-01-t12",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Subject-Verb Agreement"
  },
  {
    "id": "cds-eng-01-t13",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-01",
    "title": "Prepositions and Articles"
  },
  {
    "id": "cds-gen-01-t01",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Ancient Indian History"
  },
  {
    "id": "cds-gen-01-t02",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Medieval Indian History"
  },
  {
    "id": "cds-gen-01-t03",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Modern Indian History & Freedom Struggle"
  },
  {
    "id": "cds-gen-01-t04",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "World History Basics"
  },
  {
    "id": "cds-gen-01-t05",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Physical Geography"
  },
  {
    "id": "cds-gen-01-t06",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Indian Geography"
  },
  {
    "id": "cds-gen-01-t07",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "World Geography"
  },
  {
    "id": "cds-gen-01-t08",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Indian Polity — Constitution & Preamble"
  },
  {
    "id": "cds-gen-01-t09",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Fundamental Rights & Duties"
  },
  {
    "id": "cds-gen-01-t10",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Union and State Executive"
  },
  {
    "id": "cds-gen-01-t11",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Parliament and Judiciary"
  },
  {
    "id": "cds-gen-01-t12",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Indian Economy — Basics and Planning"
  },
  {
    "id": "cds-gen-01-t13",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Banking, RBI and Inflation"
  },
  {
    "id": "cds-gen-01-t14",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Government Schemes and Policies"
  },
  {
    "id": "cds-gen-01-t15",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Physics — Mechanics, Heat, Light, Sound"
  },
  {
    "id": "cds-gen-01-t16",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Chemistry — Matter, Elements, Reactions"
  },
  {
    "id": "cds-gen-01-t17",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Biology — Cells, Diseases, Human Body"
  },
  {
    "id": "cds-gen-01-t18",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Defence Awareness — Ranks, Commands, Equipment"
  },
  {
    "id": "cds-gen-01-t19",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Environment and Ecology"
  },
  {
    "id": "cds-gen-01-t20",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Current Affairs — National and International"
  },
  {
    "id": "cds-gen-01-t21",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Sports, Awards and Honors"
  },
  {
    "id": "cds-gen-01-t22",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Books and Authors"
  },
  {
    "id": "cds-gen-01-t23",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-01",
    "title": "Science and Technology Updates"
  },
  {
    "id": "cds-eng-02-t01",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 1"
  },
  {
    "id": "cds-eng-02-t02",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 2"
  },
  {
    "id": "cds-eng-02-t03",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 3"
  },
  {
    "id": "cds-eng-02-t04",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 4"
  },
  {
    "id": "cds-eng-02-t05",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 5"
  },
  {
    "id": "cds-eng-02-t06",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 6"
  },
  {
    "id": "cds-eng-02-t07",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 7"
  },
  {
    "id": "cds-eng-02-t08",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 8"
  },
  {
    "id": "cds-eng-02-t09",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 9"
  },
  {
    "id": "cds-eng-02-t10",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 10"
  },
  {
    "id": "cds-eng-02-t11",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 11"
  },
  {
    "id": "cds-eng-02-t12",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 12"
  },
  {
    "id": "cds-eng-02-t13",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 13"
  },
  {
    "id": "cds-eng-02-t14",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 14"
  },
  {
    "id": "cds-eng-02-t15",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 15"
  },
  {
    "id": "cds-eng-02-t16",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 16"
  },
  {
    "id": "cds-eng-02-t17",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 17"
  },
  {
    "id": "cds-eng-02-t18",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 18"
  },
  {
    "id": "cds-eng-02-t19",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 19"
  },
  {
    "id": "cds-eng-02-t20",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 20"
  },
  {
    "id": "cds-eng-02-t21",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 21"
  },
  {
    "id": "cds-eng-02-t22",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 22"
  },
  {
    "id": "cds-eng-02-t23",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 23"
  },
  {
    "id": "cds-eng-02-t24",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 24"
  },
  {
    "id": "cds-eng-02-t25",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 25"
  },
  {
    "id": "cds-eng-02-t26",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 26"
  },
  {
    "id": "cds-eng-02-t27",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 27"
  },
  {
    "id": "cds-eng-02-t28",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 28"
  },
  {
    "id": "cds-eng-02-t29",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 29"
  },
  {
    "id": "cds-eng-02-t30",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 30"
  },
  {
    "id": "cds-eng-02-t31",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 31"
  },
  {
    "id": "cds-eng-02-t32",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 32"
  },
  {
    "id": "cds-eng-02-t33",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 33"
  },
  {
    "id": "cds-eng-02-t34",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 34"
  },
  {
    "id": "cds-eng-02-t35",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 35"
  },
  {
    "id": "cds-eng-02-t36",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 36"
  },
  {
    "id": "cds-eng-02-t37",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 37"
  },
  {
    "id": "cds-eng-02-t38",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 38"
  },
  {
    "id": "cds-eng-02-t39",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 39"
  },
  {
    "id": "cds-eng-02-t40",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-02",
    "title": "Advanced English Grammar rules part 40"
  },
  {
    "id": "cds-eng-03-t01",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 1"
  },
  {
    "id": "cds-eng-03-t02",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 2"
  },
  {
    "id": "cds-eng-03-t03",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 3"
  },
  {
    "id": "cds-eng-03-t04",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 4"
  },
  {
    "id": "cds-eng-03-t05",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 5"
  },
  {
    "id": "cds-eng-03-t06",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 6"
  },
  {
    "id": "cds-eng-03-t07",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 7"
  },
  {
    "id": "cds-eng-03-t08",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 8"
  },
  {
    "id": "cds-eng-03-t09",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 9"
  },
  {
    "id": "cds-eng-03-t10",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 10"
  },
  {
    "id": "cds-eng-03-t11",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 11"
  },
  {
    "id": "cds-eng-03-t12",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 12"
  },
  {
    "id": "cds-eng-03-t13",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 13"
  },
  {
    "id": "cds-eng-03-t14",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 14"
  },
  {
    "id": "cds-eng-03-t15",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 15"
  },
  {
    "id": "cds-eng-03-t16",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 16"
  },
  {
    "id": "cds-eng-03-t17",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 17"
  },
  {
    "id": "cds-eng-03-t18",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 18"
  },
  {
    "id": "cds-eng-03-t19",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 19"
  },
  {
    "id": "cds-eng-03-t20",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 20"
  },
  {
    "id": "cds-eng-03-t21",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 21"
  },
  {
    "id": "cds-eng-03-t22",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 22"
  },
  {
    "id": "cds-eng-03-t23",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 23"
  },
  {
    "id": "cds-eng-03-t24",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 24"
  },
  {
    "id": "cds-eng-03-t25",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 25"
  },
  {
    "id": "cds-eng-03-t26",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 26"
  },
  {
    "id": "cds-eng-03-t27",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 27"
  },
  {
    "id": "cds-eng-03-t28",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 28"
  },
  {
    "id": "cds-eng-03-t29",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 29"
  },
  {
    "id": "cds-eng-03-t30",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 30"
  },
  {
    "id": "cds-eng-03-t31",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 31"
  },
  {
    "id": "cds-eng-03-t32",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 32"
  },
  {
    "id": "cds-eng-03-t33",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 33"
  },
  {
    "id": "cds-eng-03-t34",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 34"
  },
  {
    "id": "cds-eng-03-t35",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 35"
  },
  {
    "id": "cds-eng-03-t36",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 36"
  },
  {
    "id": "cds-eng-03-t37",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 37"
  },
  {
    "id": "cds-eng-03-t38",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 38"
  },
  {
    "id": "cds-eng-03-t39",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 39"
  },
  {
    "id": "cds-eng-03-t40",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-03",
    "title": "Vocabulary Builder word sets part 40"
  },
  {
    "id": "cds-eng-04-t01",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 1"
  },
  {
    "id": "cds-eng-04-t02",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 2"
  },
  {
    "id": "cds-eng-04-t03",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 3"
  },
  {
    "id": "cds-eng-04-t04",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 4"
  },
  {
    "id": "cds-eng-04-t05",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 5"
  },
  {
    "id": "cds-eng-04-t06",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 6"
  },
  {
    "id": "cds-eng-04-t07",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 7"
  },
  {
    "id": "cds-eng-04-t08",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 8"
  },
  {
    "id": "cds-eng-04-t09",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 9"
  },
  {
    "id": "cds-eng-04-t10",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 10"
  },
  {
    "id": "cds-eng-04-t11",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 11"
  },
  {
    "id": "cds-eng-04-t12",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 12"
  },
  {
    "id": "cds-eng-04-t13",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 13"
  },
  {
    "id": "cds-eng-04-t14",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 14"
  },
  {
    "id": "cds-eng-04-t15",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 15"
  },
  {
    "id": "cds-eng-04-t16",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 16"
  },
  {
    "id": "cds-eng-04-t17",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 17"
  },
  {
    "id": "cds-eng-04-t18",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 18"
  },
  {
    "id": "cds-eng-04-t19",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 19"
  },
  {
    "id": "cds-eng-04-t20",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 20"
  },
  {
    "id": "cds-eng-04-t21",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 21"
  },
  {
    "id": "cds-eng-04-t22",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 22"
  },
  {
    "id": "cds-eng-04-t23",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 23"
  },
  {
    "id": "cds-eng-04-t24",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 24"
  },
  {
    "id": "cds-eng-04-t25",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 25"
  },
  {
    "id": "cds-eng-04-t26",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 26"
  },
  {
    "id": "cds-eng-04-t27",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 27"
  },
  {
    "id": "cds-eng-04-t28",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 28"
  },
  {
    "id": "cds-eng-04-t29",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 29"
  },
  {
    "id": "cds-eng-04-t30",
    "exam": "cds",
    "subject": "English",
    "chapter": "cds-eng-04",
    "title": "Reading Comprehension Practice Set 30"
  },
  {
    "id": "cds-gen-02-t01",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 1"
  },
  {
    "id": "cds-gen-02-t02",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 2"
  },
  {
    "id": "cds-gen-02-t03",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 3"
  },
  {
    "id": "cds-gen-02-t04",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 4"
  },
  {
    "id": "cds-gen-02-t05",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 5"
  },
  {
    "id": "cds-gen-02-t06",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 6"
  },
  {
    "id": "cds-gen-02-t07",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 7"
  },
  {
    "id": "cds-gen-02-t08",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 8"
  },
  {
    "id": "cds-gen-02-t09",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 9"
  },
  {
    "id": "cds-gen-02-t10",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 10"
  },
  {
    "id": "cds-gen-02-t11",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 11"
  },
  {
    "id": "cds-gen-02-t12",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 12"
  },
  {
    "id": "cds-gen-02-t13",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 13"
  },
  {
    "id": "cds-gen-02-t14",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 14"
  },
  {
    "id": "cds-gen-02-t15",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 15"
  },
  {
    "id": "cds-gen-02-t16",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 16"
  },
  {
    "id": "cds-gen-02-t17",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 17"
  },
  {
    "id": "cds-gen-02-t18",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 18"
  },
  {
    "id": "cds-gen-02-t19",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 19"
  },
  {
    "id": "cds-gen-02-t20",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 20"
  },
  {
    "id": "cds-gen-02-t21",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 21"
  },
  {
    "id": "cds-gen-02-t22",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 22"
  },
  {
    "id": "cds-gen-02-t23",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 23"
  },
  {
    "id": "cds-gen-02-t24",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 24"
  },
  {
    "id": "cds-gen-02-t25",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 25"
  },
  {
    "id": "cds-gen-02-t26",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 26"
  },
  {
    "id": "cds-gen-02-t27",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 27"
  },
  {
    "id": "cds-gen-02-t28",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 28"
  },
  {
    "id": "cds-gen-02-t29",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 29"
  },
  {
    "id": "cds-gen-02-t30",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 30"
  },
  {
    "id": "cds-gen-02-t31",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 31"
  },
  {
    "id": "cds-gen-02-t32",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 32"
  },
  {
    "id": "cds-gen-02-t33",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 33"
  },
  {
    "id": "cds-gen-02-t34",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 34"
  },
  {
    "id": "cds-gen-02-t35",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 35"
  },
  {
    "id": "cds-gen-02-t36",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 36"
  },
  {
    "id": "cds-gen-02-t37",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 37"
  },
  {
    "id": "cds-gen-02-t38",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 38"
  },
  {
    "id": "cds-gen-02-t39",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 39"
  },
  {
    "id": "cds-gen-02-t40",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 40"
  },
  {
    "id": "cds-gen-02-t41",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 41"
  },
  {
    "id": "cds-gen-02-t42",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 42"
  },
  {
    "id": "cds-gen-02-t43",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 43"
  },
  {
    "id": "cds-gen-02-t44",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 44"
  },
  {
    "id": "cds-gen-02-t45",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 45"
  },
  {
    "id": "cds-gen-02-t46",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 46"
  },
  {
    "id": "cds-gen-02-t47",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 47"
  },
  {
    "id": "cds-gen-02-t48",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 48"
  },
  {
    "id": "cds-gen-02-t49",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 49"
  },
  {
    "id": "cds-gen-02-t50",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-02",
    "title": "Detailed Indian History Era Analysis part 50"
  },
  {
    "id": "cds-gen-03-t01",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 1"
  },
  {
    "id": "cds-gen-03-t02",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 2"
  },
  {
    "id": "cds-gen-03-t03",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 3"
  },
  {
    "id": "cds-gen-03-t04",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 4"
  },
  {
    "id": "cds-gen-03-t05",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 5"
  },
  {
    "id": "cds-gen-03-t06",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 6"
  },
  {
    "id": "cds-gen-03-t07",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 7"
  },
  {
    "id": "cds-gen-03-t08",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 8"
  },
  {
    "id": "cds-gen-03-t09",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 9"
  },
  {
    "id": "cds-gen-03-t10",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 10"
  },
  {
    "id": "cds-gen-03-t11",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 11"
  },
  {
    "id": "cds-gen-03-t12",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 12"
  },
  {
    "id": "cds-gen-03-t13",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 13"
  },
  {
    "id": "cds-gen-03-t14",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 14"
  },
  {
    "id": "cds-gen-03-t15",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 15"
  },
  {
    "id": "cds-gen-03-t16",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 16"
  },
  {
    "id": "cds-gen-03-t17",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 17"
  },
  {
    "id": "cds-gen-03-t18",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 18"
  },
  {
    "id": "cds-gen-03-t19",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 19"
  },
  {
    "id": "cds-gen-03-t20",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 20"
  },
  {
    "id": "cds-gen-03-t21",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 21"
  },
  {
    "id": "cds-gen-03-t22",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 22"
  },
  {
    "id": "cds-gen-03-t23",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 23"
  },
  {
    "id": "cds-gen-03-t24",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 24"
  },
  {
    "id": "cds-gen-03-t25",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 25"
  },
  {
    "id": "cds-gen-03-t26",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 26"
  },
  {
    "id": "cds-gen-03-t27",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 27"
  },
  {
    "id": "cds-gen-03-t28",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 28"
  },
  {
    "id": "cds-gen-03-t29",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 29"
  },
  {
    "id": "cds-gen-03-t30",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 30"
  },
  {
    "id": "cds-gen-03-t31",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 31"
  },
  {
    "id": "cds-gen-03-t32",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 32"
  },
  {
    "id": "cds-gen-03-t33",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 33"
  },
  {
    "id": "cds-gen-03-t34",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 34"
  },
  {
    "id": "cds-gen-03-t35",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 35"
  },
  {
    "id": "cds-gen-03-t36",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 36"
  },
  {
    "id": "cds-gen-03-t37",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 37"
  },
  {
    "id": "cds-gen-03-t38",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 38"
  },
  {
    "id": "cds-gen-03-t39",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 39"
  },
  {
    "id": "cds-gen-03-t40",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 40"
  },
  {
    "id": "cds-gen-03-t41",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 41"
  },
  {
    "id": "cds-gen-03-t42",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 42"
  },
  {
    "id": "cds-gen-03-t43",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 43"
  },
  {
    "id": "cds-gen-03-t44",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 44"
  },
  {
    "id": "cds-gen-03-t45",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 45"
  },
  {
    "id": "cds-gen-03-t46",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 46"
  },
  {
    "id": "cds-gen-03-t47",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 47"
  },
  {
    "id": "cds-gen-03-t48",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 48"
  },
  {
    "id": "cds-gen-03-t49",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 49"
  },
  {
    "id": "cds-gen-03-t50",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-03",
    "title": "Detailed Geography Topography study part 50"
  },
  {
    "id": "cds-gen-04-t01",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 1"
  },
  {
    "id": "cds-gen-04-t02",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 2"
  },
  {
    "id": "cds-gen-04-t03",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 3"
  },
  {
    "id": "cds-gen-04-t04",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 4"
  },
  {
    "id": "cds-gen-04-t05",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 5"
  },
  {
    "id": "cds-gen-04-t06",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 6"
  },
  {
    "id": "cds-gen-04-t07",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 7"
  },
  {
    "id": "cds-gen-04-t08",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 8"
  },
  {
    "id": "cds-gen-04-t09",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 9"
  },
  {
    "id": "cds-gen-04-t10",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 10"
  },
  {
    "id": "cds-gen-04-t11",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 11"
  },
  {
    "id": "cds-gen-04-t12",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 12"
  },
  {
    "id": "cds-gen-04-t13",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 13"
  },
  {
    "id": "cds-gen-04-t14",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 14"
  },
  {
    "id": "cds-gen-04-t15",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 15"
  },
  {
    "id": "cds-gen-04-t16",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 16"
  },
  {
    "id": "cds-gen-04-t17",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 17"
  },
  {
    "id": "cds-gen-04-t18",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 18"
  },
  {
    "id": "cds-gen-04-t19",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 19"
  },
  {
    "id": "cds-gen-04-t20",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 20"
  },
  {
    "id": "cds-gen-04-t21",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 21"
  },
  {
    "id": "cds-gen-04-t22",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 22"
  },
  {
    "id": "cds-gen-04-t23",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 23"
  },
  {
    "id": "cds-gen-04-t24",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 24"
  },
  {
    "id": "cds-gen-04-t25",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 25"
  },
  {
    "id": "cds-gen-04-t26",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 26"
  },
  {
    "id": "cds-gen-04-t27",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 27"
  },
  {
    "id": "cds-gen-04-t28",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 28"
  },
  {
    "id": "cds-gen-04-t29",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 29"
  },
  {
    "id": "cds-gen-04-t30",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 30"
  },
  {
    "id": "cds-gen-04-t31",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 31"
  },
  {
    "id": "cds-gen-04-t32",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 32"
  },
  {
    "id": "cds-gen-04-t33",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 33"
  },
  {
    "id": "cds-gen-04-t34",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 34"
  },
  {
    "id": "cds-gen-04-t35",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 35"
  },
  {
    "id": "cds-gen-04-t36",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 36"
  },
  {
    "id": "cds-gen-04-t37",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 37"
  },
  {
    "id": "cds-gen-04-t38",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 38"
  },
  {
    "id": "cds-gen-04-t39",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 39"
  },
  {
    "id": "cds-gen-04-t40",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 40"
  },
  {
    "id": "cds-gen-04-t41",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 41"
  },
  {
    "id": "cds-gen-04-t42",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 42"
  },
  {
    "id": "cds-gen-04-t43",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 43"
  },
  {
    "id": "cds-gen-04-t44",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 44"
  },
  {
    "id": "cds-gen-04-t45",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 45"
  },
  {
    "id": "cds-gen-04-t46",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 46"
  },
  {
    "id": "cds-gen-04-t47",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 47"
  },
  {
    "id": "cds-gen-04-t48",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 48"
  },
  {
    "id": "cds-gen-04-t49",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 49"
  },
  {
    "id": "cds-gen-04-t50",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-04",
    "title": "Indian Polity Constitutional Clauses part 50"
  },
  {
    "id": "cds-gen-05-t01",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 1"
  },
  {
    "id": "cds-gen-05-t02",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 2"
  },
  {
    "id": "cds-gen-05-t03",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 3"
  },
  {
    "id": "cds-gen-05-t04",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 4"
  },
  {
    "id": "cds-gen-05-t05",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 5"
  },
  {
    "id": "cds-gen-05-t06",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 6"
  },
  {
    "id": "cds-gen-05-t07",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 7"
  },
  {
    "id": "cds-gen-05-t08",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 8"
  },
  {
    "id": "cds-gen-05-t09",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 9"
  },
  {
    "id": "cds-gen-05-t10",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 10"
  },
  {
    "id": "cds-gen-05-t11",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 11"
  },
  {
    "id": "cds-gen-05-t12",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 12"
  },
  {
    "id": "cds-gen-05-t13",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 13"
  },
  {
    "id": "cds-gen-05-t14",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 14"
  },
  {
    "id": "cds-gen-05-t15",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 15"
  },
  {
    "id": "cds-gen-05-t16",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 16"
  },
  {
    "id": "cds-gen-05-t17",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 17"
  },
  {
    "id": "cds-gen-05-t18",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 18"
  },
  {
    "id": "cds-gen-05-t19",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 19"
  },
  {
    "id": "cds-gen-05-t20",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 20"
  },
  {
    "id": "cds-gen-05-t21",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 21"
  },
  {
    "id": "cds-gen-05-t22",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 22"
  },
  {
    "id": "cds-gen-05-t23",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 23"
  },
  {
    "id": "cds-gen-05-t24",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 24"
  },
  {
    "id": "cds-gen-05-t25",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 25"
  },
  {
    "id": "cds-gen-05-t26",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 26"
  },
  {
    "id": "cds-gen-05-t27",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 27"
  },
  {
    "id": "cds-gen-05-t28",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 28"
  },
  {
    "id": "cds-gen-05-t29",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 29"
  },
  {
    "id": "cds-gen-05-t30",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 30"
  },
  {
    "id": "cds-gen-05-t31",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 31"
  },
  {
    "id": "cds-gen-05-t32",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 32"
  },
  {
    "id": "cds-gen-05-t33",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 33"
  },
  {
    "id": "cds-gen-05-t34",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 34"
  },
  {
    "id": "cds-gen-05-t35",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 35"
  },
  {
    "id": "cds-gen-05-t36",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 36"
  },
  {
    "id": "cds-gen-05-t37",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 37"
  },
  {
    "id": "cds-gen-05-t38",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 38"
  },
  {
    "id": "cds-gen-05-t39",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 39"
  },
  {
    "id": "cds-gen-05-t40",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 40"
  },
  {
    "id": "cds-gen-05-t41",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 41"
  },
  {
    "id": "cds-gen-05-t42",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 42"
  },
  {
    "id": "cds-gen-05-t43",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 43"
  },
  {
    "id": "cds-gen-05-t44",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 44"
  },
  {
    "id": "cds-gen-05-t45",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 45"
  },
  {
    "id": "cds-gen-05-t46",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 46"
  },
  {
    "id": "cds-gen-05-t47",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 47"
  },
  {
    "id": "cds-gen-05-t48",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 48"
  },
  {
    "id": "cds-gen-05-t49",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 49"
  },
  {
    "id": "cds-gen-05-t50",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-05",
    "title": "Defence Tech & Strategy part 50"
  },
  {
    "id": "cds-gen-06-t01",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 1"
  },
  {
    "id": "cds-gen-06-t02",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 2"
  },
  {
    "id": "cds-gen-06-t03",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 3"
  },
  {
    "id": "cds-gen-06-t04",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 4"
  },
  {
    "id": "cds-gen-06-t05",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 5"
  },
  {
    "id": "cds-gen-06-t06",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 6"
  },
  {
    "id": "cds-gen-06-t07",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 7"
  },
  {
    "id": "cds-gen-06-t08",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 8"
  },
  {
    "id": "cds-gen-06-t09",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 9"
  },
  {
    "id": "cds-gen-06-t10",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 10"
  },
  {
    "id": "cds-gen-06-t11",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 11"
  },
  {
    "id": "cds-gen-06-t12",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 12"
  },
  {
    "id": "cds-gen-06-t13",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 13"
  },
  {
    "id": "cds-gen-06-t14",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 14"
  },
  {
    "id": "cds-gen-06-t15",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 15"
  },
  {
    "id": "cds-gen-06-t16",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 16"
  },
  {
    "id": "cds-gen-06-t17",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 17"
  },
  {
    "id": "cds-gen-06-t18",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 18"
  },
  {
    "id": "cds-gen-06-t19",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 19"
  },
  {
    "id": "cds-gen-06-t20",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 20"
  },
  {
    "id": "cds-gen-06-t21",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 21"
  },
  {
    "id": "cds-gen-06-t22",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 22"
  },
  {
    "id": "cds-gen-06-t23",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 23"
  },
  {
    "id": "cds-gen-06-t24",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 24"
  },
  {
    "id": "cds-gen-06-t25",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 25"
  },
  {
    "id": "cds-gen-06-t26",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 26"
  },
  {
    "id": "cds-gen-06-t27",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 27"
  },
  {
    "id": "cds-gen-06-t28",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 28"
  },
  {
    "id": "cds-gen-06-t29",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 29"
  },
  {
    "id": "cds-gen-06-t30",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 30"
  },
  {
    "id": "cds-gen-06-t31",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 31"
  },
  {
    "id": "cds-gen-06-t32",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 32"
  },
  {
    "id": "cds-gen-06-t33",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 33"
  },
  {
    "id": "cds-gen-06-t34",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 34"
  },
  {
    "id": "cds-gen-06-t35",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 35"
  },
  {
    "id": "cds-gen-06-t36",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 36"
  },
  {
    "id": "cds-gen-06-t37",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 37"
  },
  {
    "id": "cds-gen-06-t38",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 38"
  },
  {
    "id": "cds-gen-06-t39",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 39"
  },
  {
    "id": "cds-gen-06-t40",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-06",
    "title": "Economics Concepts & Terminology part 40"
  },
  {
    "id": "cds-gen-07-t01",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 1"
  },
  {
    "id": "cds-gen-07-t02",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 2"
  },
  {
    "id": "cds-gen-07-t03",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 3"
  },
  {
    "id": "cds-gen-07-t04",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 4"
  },
  {
    "id": "cds-gen-07-t05",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 5"
  },
  {
    "id": "cds-gen-07-t06",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 6"
  },
  {
    "id": "cds-gen-07-t07",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 7"
  },
  {
    "id": "cds-gen-07-t08",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 8"
  },
  {
    "id": "cds-gen-07-t09",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 9"
  },
  {
    "id": "cds-gen-07-t10",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 10"
  },
  {
    "id": "cds-gen-07-t11",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 11"
  },
  {
    "id": "cds-gen-07-t12",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 12"
  },
  {
    "id": "cds-gen-07-t13",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 13"
  },
  {
    "id": "cds-gen-07-t14",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 14"
  },
  {
    "id": "cds-gen-07-t15",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 15"
  },
  {
    "id": "cds-gen-07-t16",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 16"
  },
  {
    "id": "cds-gen-07-t17",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 17"
  },
  {
    "id": "cds-gen-07-t18",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 18"
  },
  {
    "id": "cds-gen-07-t19",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 19"
  },
  {
    "id": "cds-gen-07-t20",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 20"
  },
  {
    "id": "cds-gen-07-t21",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 21"
  },
  {
    "id": "cds-gen-07-t22",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 22"
  },
  {
    "id": "cds-gen-07-t23",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 23"
  },
  {
    "id": "cds-gen-07-t24",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 24"
  },
  {
    "id": "cds-gen-07-t25",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 25"
  },
  {
    "id": "cds-gen-07-t26",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 26"
  },
  {
    "id": "cds-gen-07-t27",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 27"
  },
  {
    "id": "cds-gen-07-t28",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 28"
  },
  {
    "id": "cds-gen-07-t29",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 29"
  },
  {
    "id": "cds-gen-07-t30",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-07",
    "title": "Environmental Science & Ecology part 30"
  },
  {
    "id": "cds-gen-08-t01",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 1"
  },
  {
    "id": "cds-gen-08-t02",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 2"
  },
  {
    "id": "cds-gen-08-t03",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 3"
  },
  {
    "id": "cds-gen-08-t04",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 4"
  },
  {
    "id": "cds-gen-08-t05",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 5"
  },
  {
    "id": "cds-gen-08-t06",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 6"
  },
  {
    "id": "cds-gen-08-t07",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 7"
  },
  {
    "id": "cds-gen-08-t08",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 8"
  },
  {
    "id": "cds-gen-08-t09",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 9"
  },
  {
    "id": "cds-gen-08-t10",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 10"
  },
  {
    "id": "cds-gen-08-t11",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 11"
  },
  {
    "id": "cds-gen-08-t12",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 12"
  },
  {
    "id": "cds-gen-08-t13",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 13"
  },
  {
    "id": "cds-gen-08-t14",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 14"
  },
  {
    "id": "cds-gen-08-t15",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 15"
  },
  {
    "id": "cds-gen-08-t16",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 16"
  },
  {
    "id": "cds-gen-08-t17",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 17"
  },
  {
    "id": "cds-gen-08-t18",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 18"
  },
  {
    "id": "cds-gen-08-t19",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 19"
  },
  {
    "id": "cds-gen-08-t20",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 20"
  },
  {
    "id": "cds-gen-08-t21",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 21"
  },
  {
    "id": "cds-gen-08-t22",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 22"
  },
  {
    "id": "cds-gen-08-t23",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 23"
  },
  {
    "id": "cds-gen-08-t24",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 24"
  },
  {
    "id": "cds-gen-08-t25",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 25"
  },
  {
    "id": "cds-gen-08-t26",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 26"
  },
  {
    "id": "cds-gen-08-t27",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 27"
  },
  {
    "id": "cds-gen-08-t28",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 28"
  },
  {
    "id": "cds-gen-08-t29",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 29"
  },
  {
    "id": "cds-gen-08-t30",
    "exam": "cds",
    "subject": "General Knowledge",
    "chapter": "cds-gen-08",
    "title": "Current Affairs & Global Events part 30"
  },
  {
    "id": "cds-mat-02-t01",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 1"
  },
  {
    "id": "cds-mat-02-t02",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 2"
  },
  {
    "id": "cds-mat-02-t03",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 3"
  },
  {
    "id": "cds-mat-02-t04",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 4"
  },
  {
    "id": "cds-mat-02-t05",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 5"
  },
  {
    "id": "cds-mat-02-t06",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 6"
  },
  {
    "id": "cds-mat-02-t07",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 7"
  },
  {
    "id": "cds-mat-02-t08",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 8"
  },
  {
    "id": "cds-mat-02-t09",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 9"
  },
  {
    "id": "cds-mat-02-t10",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 10"
  },
  {
    "id": "cds-mat-02-t11",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 11"
  },
  {
    "id": "cds-mat-02-t12",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 12"
  },
  {
    "id": "cds-mat-02-t13",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 13"
  },
  {
    "id": "cds-mat-02-t14",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 14"
  },
  {
    "id": "cds-mat-02-t15",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 15"
  },
  {
    "id": "cds-mat-02-t16",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 16"
  },
  {
    "id": "cds-mat-02-t17",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 17"
  },
  {
    "id": "cds-mat-02-t18",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 18"
  },
  {
    "id": "cds-mat-02-t19",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 19"
  },
  {
    "id": "cds-mat-02-t20",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 20"
  },
  {
    "id": "cds-mat-02-t21",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 21"
  },
  {
    "id": "cds-mat-02-t22",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 22"
  },
  {
    "id": "cds-mat-02-t23",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 23"
  },
  {
    "id": "cds-mat-02-t24",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 24"
  },
  {
    "id": "cds-mat-02-t25",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 25"
  },
  {
    "id": "cds-mat-02-t26",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 26"
  },
  {
    "id": "cds-mat-02-t27",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 27"
  },
  {
    "id": "cds-mat-02-t28",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 28"
  },
  {
    "id": "cds-mat-02-t29",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 29"
  },
  {
    "id": "cds-mat-02-t30",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 30"
  },
  {
    "id": "cds-mat-02-t31",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 31"
  },
  {
    "id": "cds-mat-02-t32",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 32"
  },
  {
    "id": "cds-mat-02-t33",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 33"
  },
  {
    "id": "cds-mat-02-t34",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 34"
  },
  {
    "id": "cds-mat-02-t35",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 35"
  },
  {
    "id": "cds-mat-02-t36",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 36"
  },
  {
    "id": "cds-mat-02-t37",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 37"
  },
  {
    "id": "cds-mat-02-t38",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 38"
  },
  {
    "id": "cds-mat-02-t39",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 39"
  },
  {
    "id": "cds-mat-02-t40",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-02",
    "title": "Advanced Arithmetic Practice Set 40"
  },
  {
    "id": "cds-mat-03-t01",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 1"
  },
  {
    "id": "cds-mat-03-t02",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 2"
  },
  {
    "id": "cds-mat-03-t03",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 3"
  },
  {
    "id": "cds-mat-03-t04",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 4"
  },
  {
    "id": "cds-mat-03-t05",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 5"
  },
  {
    "id": "cds-mat-03-t06",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 6"
  },
  {
    "id": "cds-mat-03-t07",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 7"
  },
  {
    "id": "cds-mat-03-t08",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 8"
  },
  {
    "id": "cds-mat-03-t09",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 9"
  },
  {
    "id": "cds-mat-03-t10",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 10"
  },
  {
    "id": "cds-mat-03-t11",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 11"
  },
  {
    "id": "cds-mat-03-t12",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 12"
  },
  {
    "id": "cds-mat-03-t13",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 13"
  },
  {
    "id": "cds-mat-03-t14",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 14"
  },
  {
    "id": "cds-mat-03-t15",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 15"
  },
  {
    "id": "cds-mat-03-t16",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 16"
  },
  {
    "id": "cds-mat-03-t17",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 17"
  },
  {
    "id": "cds-mat-03-t18",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 18"
  },
  {
    "id": "cds-mat-03-t19",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 19"
  },
  {
    "id": "cds-mat-03-t20",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 20"
  },
  {
    "id": "cds-mat-03-t21",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 21"
  },
  {
    "id": "cds-mat-03-t22",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 22"
  },
  {
    "id": "cds-mat-03-t23",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 23"
  },
  {
    "id": "cds-mat-03-t24",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 24"
  },
  {
    "id": "cds-mat-03-t25",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 25"
  },
  {
    "id": "cds-mat-03-t26",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 26"
  },
  {
    "id": "cds-mat-03-t27",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 27"
  },
  {
    "id": "cds-mat-03-t28",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 28"
  },
  {
    "id": "cds-mat-03-t29",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 29"
  },
  {
    "id": "cds-mat-03-t30",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 30"
  },
  {
    "id": "cds-mat-03-t31",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 31"
  },
  {
    "id": "cds-mat-03-t32",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 32"
  },
  {
    "id": "cds-mat-03-t33",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 33"
  },
  {
    "id": "cds-mat-03-t34",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 34"
  },
  {
    "id": "cds-mat-03-t35",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 35"
  },
  {
    "id": "cds-mat-03-t36",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 36"
  },
  {
    "id": "cds-mat-03-t37",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 37"
  },
  {
    "id": "cds-mat-03-t38",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 38"
  },
  {
    "id": "cds-mat-03-t39",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 39"
  },
  {
    "id": "cds-mat-03-t40",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-03",
    "title": "Advanced Algebra Practice Set 40"
  },
  {
    "id": "cds-mat-04-t01",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 1"
  },
  {
    "id": "cds-mat-04-t02",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 2"
  },
  {
    "id": "cds-mat-04-t03",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 3"
  },
  {
    "id": "cds-mat-04-t04",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 4"
  },
  {
    "id": "cds-mat-04-t05",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 5"
  },
  {
    "id": "cds-mat-04-t06",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 6"
  },
  {
    "id": "cds-mat-04-t07",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 7"
  },
  {
    "id": "cds-mat-04-t08",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 8"
  },
  {
    "id": "cds-mat-04-t09",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 9"
  },
  {
    "id": "cds-mat-04-t10",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 10"
  },
  {
    "id": "cds-mat-04-t11",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 11"
  },
  {
    "id": "cds-mat-04-t12",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 12"
  },
  {
    "id": "cds-mat-04-t13",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 13"
  },
  {
    "id": "cds-mat-04-t14",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 14"
  },
  {
    "id": "cds-mat-04-t15",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 15"
  },
  {
    "id": "cds-mat-04-t16",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 16"
  },
  {
    "id": "cds-mat-04-t17",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 17"
  },
  {
    "id": "cds-mat-04-t18",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 18"
  },
  {
    "id": "cds-mat-04-t19",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 19"
  },
  {
    "id": "cds-mat-04-t20",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 20"
  },
  {
    "id": "cds-mat-04-t21",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 21"
  },
  {
    "id": "cds-mat-04-t22",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 22"
  },
  {
    "id": "cds-mat-04-t23",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 23"
  },
  {
    "id": "cds-mat-04-t24",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 24"
  },
  {
    "id": "cds-mat-04-t25",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 25"
  },
  {
    "id": "cds-mat-04-t26",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 26"
  },
  {
    "id": "cds-mat-04-t27",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 27"
  },
  {
    "id": "cds-mat-04-t28",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 28"
  },
  {
    "id": "cds-mat-04-t29",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 29"
  },
  {
    "id": "cds-mat-04-t30",
    "exam": "cds",
    "subject": "Mathematics",
    "chapter": "cds-mat-04",
    "title": "Advanced Geometry & Mensuration part 30"
  }
];

module.exports = ALL_TOPICS;
