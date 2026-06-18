import type { GPEScenario } from "./types.js";

const DEFAULT_SPEEDS = {
  // walking/running ~6 km/h
  walkKmH: 6,
  // jeep on road ~40 km/h
  jeepRoadKmH: 40,
  // fast boat ~25 km/h
  boatFastKmH: 25
} as const;

const metersPerUnit = 1000;

const makePoint = (x: number, y: number) => ({ x, y });

export const GPE_SCENARIOS: Record<GPEScenario["scenarioId"], GPEScenario> = {
  indoor_map_v1: {
    scenarioId: "indoor_map_v1",
    promptText: `Indoor Group Planning (Scenario v1)
You are leading a team during a visitor-traffic incident.
Key points:
- Maintain safety and prioritize evacuation for the most at-risk group.
- Coordinate communication under noise/visibility constraints.
- Allocate team roles for search, triage, and routing.

Seed: MVP-stub`,
    map: {
      mapScale: { metersPerUnit },
      // MVP: a sparse point map.
      locations: [
        // Routes/terrain
        { id: "road_main", point: makePoint(1, 2), kind: "metalled_road" },
        { id: "track_back", point: makePoint(6, 1), kind: "unmetalled_track" },

        // Water + bridge
        { id: "river_1", point: makePoint(4, 2), kind: "river" },
        { id: "bridge_1", point: makePoint(4, 3), kind: "bridge" },

        // Medical / comms
        { id: "hospital_1", point: makePoint(8, 4), kind: "hospital" },
        { id: "police_1", point: makePoint(2, 8), kind: "police_station" },
        { id: "telbooth_1", point: makePoint(5, 7), kind: "telephone_booth" },

        // Hidden environment
        { id: "tractor_spawn_1", point: makePoint(3, 6), kind: "tractor_spawn" },
        { id: "village_1", point: makePoint(7, 7), kind: "village" }
      ],
      transportAccess: {
        jeepRoadLocationIds: ["road_main"],
        boatRiverLocationIds: ["bridge_1", "river_1"]
      }
    },
    incidents: [
      {
        priority: 1,
        label: "critically_injured",
        description: "A critically injured accident victim is bleeding profusely and cannot be moved immediately without triage."
      },
      {
        priority: 2,
        label: "major_catastrophe",
        description: "A train-track hazard has created risk of a mass casualty event; a missing fishplate has led to instability."
      },
      {
        priority: 3,
        label: "robbery_kidnapping",
        description: "A visitor reported a robbery/kidnapping incident; suspects may be using service corridors."
      },
      {
        priority: 4,
        label: "minor_task",
        description: "Your original task: reach the college fest gate on time and coordinate onward comms if it is delayed."
      }
    ],
    resources: [
      // Candidate given resources
      { kind: "jeep", location: makePoint(1, 2), availability: "given", quantity: 1 },
      { kind: "group_member", availability: "given", quantity: 8 },
      { kind: "telephone_booth", location: makePoint(5, 7), availability: "given" },
      { kind: "hospital", location: makePoint(8, 4), availability: "given" },
      { kind: "police_station", location: makePoint(2, 8), availability: "given" },

      // Hidden resources in environment
      { kind: "tractor", location: makePoint(3, 6), availability: "hidden", quantity: 1 },
      { kind: "passing_village", location: makePoint(7, 7), availability: "hidden" },
      { kind: "boat", location: makePoint(4, 2), availability: "hidden", quantity: 1 }
    ],
    speedConstants: DEFAULT_SPEEDS,
    idealActions: [
      { incidentPriority: 1, destinationKind: "hospital" },
      { incidentPriority: 2, destinationKind: "telephone_booth" },
      { incidentPriority: 3, destinationKind: "police_station" },
      { incidentPriority: 4, destinationKind: "passing_village" }
    ]
  },

  indoor_map_v2: {
    scenarioId: "indoor_map_v2",
    promptText: `Indoor Group Planning (Scenario v2)
You are leading a team during an equipment failure + emergency response.
Key points:
- Establish command-and-control quickly.
- Re-route movement to prevent congestion/secondary harm.
- Keep morale stable with concise updates.

Seed: MVP-stub`,
    map: {
      mapScale: { metersPerUnit },
      locations: [
        // Transport corridors
        { id: "road_main_2", point: makePoint(2, 2), kind: "metalled_road" },
        { id: "track_service_2", point: makePoint(7, 2), kind: "unmetalled_track" },

        // Water for alternative routing
        { id: "river_2", point: makePoint(4, 4), kind: "river" },
        { id: "bridge_2", point: makePoint(5, 5), kind: "bridge" },

        // Service points
        { id: "hospital_2", point: makePoint(9, 1), kind: "hospital" },
        { id: "police_2", point: makePoint(1, 9), kind: "police_station" },
        { id: "telbooth_2", point: makePoint(8, 8), kind: "telephone_booth" },

        // Hidden spawn / village
        { id: "tractor_spawn_2", point: makePoint(6, 6), kind: "tractor_spawn" },
        { id: "village_2", point: makePoint(3, 7), kind: "village" }
      ],
      transportAccess: {
        jeepRoadLocationIds: ["road_main_2"],
        boatRiverLocationIds: ["bridge_2", "river_2"]
      }
    },
    incidents: [
      {
        priority: 1,
        label: "electrocution_injury",
        description:
          "A staff member has an electrical shock injury and needs immediate stabilization and rapid transport to medical care."
      },
      {
        priority: 2,
        label: "mass_congestion_risk",
        description:
          "Equipment failure is causing crowd congestion and may lead to a mass-disaster (stampede risk). Re-routing and control are urgent."
      },
      {
        priority: 3,
        label: "criminal_disturbance",
        description:
          "There are reports of theft and coordinated agitation in a restricted corridor; suspects may exploit the confusion."
      },
      {
        priority: 4,
        label: "minor_service_task",
        description:
          "Your secondary task: keep the command log updated and ensure key communication messages are delivered to the fest organizers."
      }
    ],
    resources: [
      { kind: "jeep", location: makePoint(2, 2), availability: "given", quantity: 1 },
      { kind: "group_member", availability: "given", quantity: 8 },
      { kind: "telephone_booth", location: makePoint(8, 8), availability: "given" },
      { kind: "hospital", location: makePoint(9, 1), availability: "given" },
      { kind: "police_station", location: makePoint(1, 9), availability: "given" },

      { kind: "tractor", location: makePoint(6, 6), availability: "hidden", quantity: 1 },
      { kind: "passing_village", location: makePoint(3, 7), availability: "hidden" },
      { kind: "boat", location: makePoint(4, 4), availability: "hidden", quantity: 1 }
    ],
    speedConstants: DEFAULT_SPEEDS,
    idealActions: [
      { incidentPriority: 1, destinationKind: "hospital" },
      { incidentPriority: 2, destinationKind: "telephone_booth" },
      { incidentPriority: 3, destinationKind: "police_station" },
      { incidentPriority: 4, destinationKind: "passing_village" }
    ]
  }
};
