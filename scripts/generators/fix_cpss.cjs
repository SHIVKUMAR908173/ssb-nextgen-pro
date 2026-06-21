const fs = require('fs');

// CPSS 60 sets x 10 scenarios = 600 scenarios
const categories = ["Psychomotor", "Cognitive", "Tactical"];

// Templates for each category
const psychomotorTemplates = [
  {s:"Your aircraft's attitude indicator shows a 15° bank to the left, but the turn coordinator indicates wings level. Determine which instrument has failed and take corrective action.",ctx:"Day VFR flight at FL150. Smooth air conditions. Last instrument check was 30 minutes ago.",obj:["Identify the failed instrument","Cross-check with backup instruments","Maintain safe flight attitude","Report the failure"],con:["No autopilot available","Approaching mountainous terrain","20 minutes to nearest airport"]},
  {s:"During a practice bombing run, your heads-up display freezes showing stale targeting data. You must switch to manual delivery while maintaining the attack profile.",ctx:"Clear weather, target visible. Formation of 4 aircraft, you are number 2. Altitude 500 feet AGL, speed 450 knots.",obj:["Switch to manual targeting mode","Maintain formation position","Complete the attack run safely","Report HUD malfunction"],con:["Time-critical target window","High-speed low-level flight","No second pass allowed"]},
  {s:"Your primary flight display goes blank during an instrument approach. Switch to standby instruments and continue the approach to landing.",ctx:"Night IMC approach to a military airfield. Ceiling 200 feet, visibility 800 meters. Fuel state is minimum for one approach.",obj:["Transition to standby instruments smoothly","Maintain approach path","Communicate with ATC","Execute landing or go-around decision"],con:["No fuel for diversion","Standby instruments are analog only","Co-pilot is a trainee"]},
  {s:"Track a target on radar that is maneuvering erratically at close range while maintaining your own aircraft in a defensive orbit pattern.",ctx:"Air combat training exercise. Target is a MiG-29 equivalent performing high-G maneuvers. You are in a Su-30MKI.",obj:["Maintain radar lock","Execute defensive orbit","Track target closure rate","Prepare for simulated missile launch"],con:["ECM interference present","Limited weapons simulation rounds","Fuel remaining for 15 min engagement"]},
  {s:"You notice a gradual drift in your magnetic compass reading that doesn't match the GPS heading. Diagnose the problem while maintaining your planned route.",ctx:"Overwater navigation flight. No visual references available. GPS is showing normal but compass is progressively drifting.",obj:["Identify compass malfunction type","Use alternative navigation methods","Maintain planned track","Document the deviation pattern"],con:["Electronic warfare exercise in area","Limited fuel reserves","150nm from nearest land"]},
  {s:"During formation flying, turbulence causes your aircraft to diverge from position. Rejoin formation using only visual references as your radar has malfunctioned.",ctx:"Day VMC conditions with moderate turbulence. Formation of 3 aircraft at FL250. You have drifted 500 meters from position.",obj:["Assess closure rate visually","Execute safe rejoin maneuver","Maintain altitude separation","Resume formation position"],con:["Radio communication intermittent","Lead aircraft is executing turns","Other aircraft in the area"]},
  {s:"Your altimeter setting is in hectopascals but the approach plate shows altitude in feet with QNH in inches of mercury. Convert and set the correct pressure.",ctx:"International flight arriving at a foreign military base. Night approach with published minima of 300 feet AGL.",obj:["Convert pressure setting accurately","Cross-check with radio altimeter","Brief the approach correctly","Execute stable approach"],con:["Unfamiliar airport","Language barrier with local ATC","Metric vs imperial chart differences"]},
  {s:"Perform an engine start sequence on a twin-engine fighter aircraft where the APU fails during the start sequence of the second engine.",ctx:"Hot start area, daytime operations. First engine running normally. Ground power unit is 10 minutes away.",obj:["Secure the failed APU safely","Attempt cross-bleed start","Manage electrical loads on one generator","Coordinate with ground crew"],con:["Scheduled takeoff in 15 minutes","Single engine taxi limitations","High ambient temperature affecting performance"]},
  {s:"Your navigation display shows conflicting data between INS and GPS positions. The difference is growing at 2nm per hour. Determine which system to trust.",ctx:"Long-range maritime patrol mission. Over open ocean with no radar references. Mission has 3 more hours remaining.",obj:["Compare drift patterns of both systems","Use celestial checks if possible","Determine which system is accurate","Update mission planning accordingly"],con:["No ground-based navaids in range","Cloud cover prevents celestial fix","Cannot deviate from patrol area"]},
  {s:"While flying a helicopter in a mountain valley, sudden wind shear forces a rapid attitude change. Recover the aircraft and navigate out of the valley safely.",ctx:"Casualty evacuation mission. Patient on board requires urgent care. Valley is 500m wide with 2000m peaks on either side.",obj:["Recover stable flight","Assess terrain clearance","Choose safest exit route","Monitor engine parameters"],con:["Patient condition is critical","Fuel is limited to 30 min","Cloud base is descending"]}
];

const cognitiveTemplates = [
  {s:"Your wingman reports a bird strike that has cracked his canopy at FL350. He can maintain pressurization but visibility is severely reduced. Guide him to the nearest suitable airfield.",ctx:"Flying over central India. Nearest IAF base is 80nm south. Nearest civilian airport is 40nm east with shorter runway. Weather is clear.",obj:["Assess wingman's aircraft condition","Choose most suitable divert airfield","Coordinate with ATC for priority handling","Escort wingman safely down"],con:["Wingman's visibility is 30% through damaged canopy","Military base has full facilities but is further","Civilian airport runway may be marginal for fighter"]},
  {s:"During a night reconnaissance mission, you discover an unidentified vessel in restricted waters. It is not responding to radio calls and appears to be heading towards a strategic naval installation.",ctx:"Maritime patrol aircraft at 1000 feet. Naval HQ is 200nm away. No naval vessels in immediate vicinity. Moon illumination is 40%.",obj:["Classify the vessel type","Report to naval headquarters","Maintain surveillance","Coordinate response assets"],con:["Cannot descend below 500 feet due to mast height uncertainty","Radio relay is required for HQ contact","Fuel remaining for 2 hours on station"]},
  {s:"You are leading a flight of 4 aircraft when ATC reports a TCAS resolution advisory conflict with a civilian aircraft at your 12 o'clock, 5nm, same altitude.",ctx:"Day VMC but in a high-traffic corridor. Your formation is at FL290. Civilian aircraft is an A320 on an airway.",obj:["Execute TCAS avoidance maneuver","Maintain formation integrity","Clear of conflict and resume route","Report the incident"],con:["Formation aircraft must maneuver as unit","Cannot descend due to terrain","Limited lateral space due to airway structure"]},
  {s:"Your co-pilot becomes incapacitated due to a sudden medical emergency at FL400. You must handle the aircraft alone while arranging medical assistance on the ground.",ctx:"Long-range ferry flight in a twin-seat aircraft. You are 400nm from the nearest suitable airfield. Clear weather.",obj:["Stabilize the co-pilot if possible","Declare medical emergency","Plan diversion to nearest airport","Fly and navigate single-handedly"],con:["No cabin crew on fighter/trainer aircraft","Medical kit is limited","Co-pilot's condition is deteriorating"]},
  {s:"During a combat air patrol, your radar detects an unknown aircraft approaching the air defense identification zone at high speed. You have 4 minutes to intercept and identify before it enters national airspace.",ctx:"Alert scramble during peacetime. ROE requires visual identification before any engagement. The bogey is at FL400, Mach 1.2.",obj:["Calculate optimal intercept geometry","Climb to identification altitude","Execute visual identification pass","Report aircraft type and markings"],con:["Fuel state allows one intercept attempt","Bogey is not responding to IFF","Night conditions with no moon"]},
  {s:"An engine fire warning light illuminates during takeoff at V1+5 knots. The tower reports seeing smoke from your right engine. Execute the appropriate emergency procedure.",ctx:"Fully loaded transport aircraft. Runway remaining is 1200m. Obstacles at 2nm on departure path. All engines were normal during run-up.",obj:["Continue takeoff and climb","Execute engine fire checklist","Secure the affected engine","Return for emergency landing"],con:["Maximum takeoff weight","Hot day reducing performance","Passenger aircraft with 200 people","Alternate airport is 90nm away"]},
  {s:"Your mission planning data shows a discrepancy between the intelligence briefing and actual terrain features observed during low-level flight. The target location may be wrong.",ctx:"Strike mission in unfamiliar territory. 50nm from target. Two aircraft in the strike package. Time on target is in 8 minutes.",obj:["Verify target coordinates","Cross-reference with backup imagery","Make go/no-go decision","Communicate with strike lead"],con:["Comm silence required","Cannot gain altitude for better view","Civilian structures nearby","Weapons already armed"]},
  {s:"While landing in a crosswind of 25 knots gusting to 35, your aircraft touches down off-center on the runway. The aircraft begins to drift towards the runway edge.",ctx:"Wet runway surface. Fighter aircraft with narrow track landing gear. No arresting barrier available. Wind from the left.",obj:["Apply crosswind correction techniques","Maintain directional control","Decide to continue or go-around","Use braking effectively without hydroplaning"],con:["Fuel is insufficient for diversion","Rain is intensifying","Following aircraft is on short final"]},
  {s:"You receive conflicting orders from two different command authorities regarding your mission. One orders you to continue the patrol; the other recalls you to base immediately.",ctx:"Joint exercise with another service. Communication breakdown between commands is apparent. You are 200nm from base with 3 hours fuel.",obj:["Clarify chain of command","Attempt to resolve conflicting orders","Make a safe decision independently","Document the situation for debrief"],con:["Radio traffic is heavy","Exercise scenario is complex","Weather at base is deteriorating"]},
  {s:"During aerial refueling at night, the tanker experiences an electrical failure and its refueling lights go out. You are 50 feet behind the boom with critical fuel state.",ctx:"Night overwater mission. Next tanker is 200nm away. Your fuel state gives you 30 minutes to find fuel or divert. Nearest divert is 300nm.",obj:["Safely disconnect from tanker","Coordinate with tanker crew","Calculate fuel options","Make diversion decision"],con:["Night over ocean - no visual references","Tanker may also need to divert","No other receivers to swap with"]}
];

const tacticalTemplates = [
  {s:"You are flying top cover for a ground convoy when you spot an ambush being set up 2km ahead of the convoy. You have limited ordnance remaining from an earlier engagement.",ctx:"Counter-insurgency operation in forested terrain. Convoy has 50 soldiers and 10 vehicles. Your wingman has expended all weapons.",obj:["Warn the convoy commander","Assess the threat strength","Determine best use of remaining ordnance","Plan a show of force if weapons are insufficient"],con:["Remaining ordnance: 2 rockets and gun","Civilian village 1km from ambush site","Cloud base is dropping","Fuel for 20 more minutes on station"]},
  {s:"During a maritime strike exercise, your target ship has activated ECM jamming your radar-guided missiles. You must switch to an alternative attack profile using infrared weapons.",ctx:"Overwater strike at sea level. Target is a destroyer-class ship. Range 30nm and closing. Your wingman has radar-guided missiles only.",obj:["Select IR weapon mode","Plan approach to minimize ECM exposure","Coordinate with wingman for suppression","Execute the attack run"],con:["IR missiles have shorter range","Ship has CIWS defense","Weather is partially obscuring the ship","Fuel only permits one attack run"]},
  {s:"You detect a hostile surface-to-air missile launch against your formation. Execute defensive maneuvers while coordinating your flight to suppress the missile site.",ctx:"Hostile territory penetration mission. SAM site was not in the intelligence briefing. Your formation is a 4-ship at low level.",obj:["Execute SAM break maneuver","Deploy countermeasures","Identify the SAM site location","Coordinate SEAD response"],con:["Terrain limits maneuver options","Element of surprise is lost","Limited SEAD weapons carried","Must still complete primary mission"]},
  {s:"You are the mission commander for a search and rescue operation to recover a downed pilot behind enemy lines. Plan the extraction using available assets.",ctx:"Pilot ejected 30nm inside hostile territory. He has activated his SARBE beacon. Last known position is near a river clearing. Hostile forces are searching for him.",obj:["Plan the ingress route","Coordinate helicopter escort","Establish communication with downed pilot","Execute time-sensitive extraction"],con:["Limited night-vision capability","Enemy air defense in the area","Helicopter range is marginal","Window of opportunity is 2 hours"]},
  {s:"Your radar warning receiver indicates you are being tracked by an enemy fighter at your 6 o'clock, 15nm. You are carrying a full air-to-air weapons load.",ctx:"Air superiority mission over disputed territory. Your wingman is 5nm to your north. The enemy fighter type is unknown but capabilities are estimated to be Gen-4.",obj:["Execute defensive turn to neutralize the threat","Achieve weapons parameters","Coordinate with wingman for tactical advantage","Identify the bogey before weapons release"],con:["ROE requires positive ID before engagement","Sunward position disadvantages you","Fuel state limits sustained maneuvering"]},
  {s:"Brief a 4-aircraft formation for a dawn raid on an enemy airfield that has both fixed-wing and helicopter assets. Intelligence shows 2 SAM sites defending the base.",ctx:"Pre-planned strike mission. Airfield has hardened shelters and dispersed parking. Time on target is 0530 hours. Weather forecast is clear.",obj:["Plan ingress and egress routes","Assign targets to each aircraft","Plan SAM suppression","Establish emergency procedures"],con:["Surprise is essential","Limited fuel for complex routing","One aircraft has reduced weapons load","Recovery base is 250nm away"]},
  {s:"During a border patrol, you visually identify a low-flying helicopter violating national airspace. It is not responding to radio calls and has no markings.",ctx:"Peacetime border patrol. No alert state has been declared. The helicopter is flying at 200 feet AGL, 5km inside national territory, heading deeper into the country.",obj:["Shadow the intruder safely","Report to air defense command","Attempt visual signals for communication","Prepare for all contingencies"],con:["Cannot use weapons in peacetime without authorization","Helicopter is in terrain-following flight","Your fuel is limited","No other interceptors nearby"]},
  {s:"You are providing close air support and the forward air controller reports friendly forces are dangerously close to the target. Minimum safe distance is 300m but troops are at 150m.",ctx:"Troops in contact situation. Enemy mortar position is causing casualties. Ground commander is requesting immediate air support despite the danger close situation.",obj:["Assess the risk to friendly forces","Coordinate exact positions with FAC","Select appropriate weapon and delivery profile","Make go/no-go decision on the strike"],con:["Enemy fire is intensifying","Smoke obscures visual reference","Communication with FAC is breaking up","Alternative weapon types may be less effective"]},
  {s:"Plan a night helicopter insertion of special forces into a target compound located in an urban area with significant civilian population.",ctx:"Counter-terrorism operation. Intelligence confirms 5 hostiles in a 3-story building. 12 special forces operators to be inserted. Two helicopter available.",obj:["Select landing zones close to target","Plan approach to avoid detection","Coordinate with ground forces","Establish extraction plan"],con:["Civilian buildings within 50m","Street lights may illuminate approach","Dogs in the area will alert","Limited time before sunrise"]},
  {s:"Your flight is tasked with escorting a VIP aircraft through a region where hostile fighters may attempt interception. Plan the escort formation and response procedures.",ctx:"Diplomatic flight through contested airspace. VIP aircraft is a civilian Gulfstream with limited maneuverability. You have 4 fighters for escort.",obj:["Position fighters for maximum coverage","Plan response to hostile approach","Coordinate with AWACS for early warning","Establish escape routes for VIP aircraft"],con:["VIP aircraft cannot exceed FL400","Engagement ROE is restrictive","Hostile air base is 100nm from route","AWACS coverage has gaps in mountainous terrain"]}
];

const allTemplates = [psychomotorTemplates, cognitiveTemplates, tacticalTemplates];

const result = {
  metadata: {
    total_scenarios: 600,
    total_sets: 60,
    time_per_scenario_minutes: 15,
    version: "2.0",
    description: "CPSS practice scenarios for pilot aptitude assessment"
  },
  sets: []
};

for (let i = 0; i < 60; i++) {
  const difficulty = i < 20 ? "Basic" : i < 40 ? "Intermediate" : "Advanced";
  const scenarios = [];

  for (let j = 0; j < 10; j++) {
    const catIndex = j % 3;
    const cat = categories[catIndex];
    const templates = allTemplates[catIndex];
    const templateIdx = (i * 10 + j) % templates.length;
    const t = templates[templateIdx];

    // Add difficulty variation
    let scenario = t.s;
    let context = t.ctx;
    let objectives = [...t.obj];
    let constraints = [...t.con];

    if (difficulty === "Intermediate") {
      constraints.push("Communication is degraded");
    } else if (difficulty === "Advanced") {
      constraints.push("Communication is degraded");
      constraints.push("Multiple simultaneous emergencies reported");
    }

    scenarios.push({
      scenario: scenario,
      context: context,
      objectives: objectives,
      constraints: constraints,
      category: cat
    });
  }

  result.sets.push({
    set_id: i + 1,
    name: `Set ${String(i + 1).padStart(2, '0')}`,
    scenarios: scenarios
  });
}

fs.writeFileSync('src/data/cpss_60_sets.json', JSON.stringify(result, null, 2));
console.log('CPSS: Generated ' + result.sets.length + ' sets with ' + (result.sets.length * 10) + ' scenarios');
console.log('Categories: Psychomotor=' + result.sets.reduce((a,s) => a + s.scenarios.filter(sc=>sc.category==='Psychomotor').length, 0) +
  ', Cognitive=' + result.sets.reduce((a,s) => a + s.scenarios.filter(sc=>sc.category==='Cognitive').length, 0) +
  ', Tactical=' + result.sets.reduce((a,s) => a + s.scenarios.filter(sc=>sc.category==='Tactical').length, 0));
