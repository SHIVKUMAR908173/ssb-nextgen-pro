export type GPEMapScale = {
  // Example: 1 grid cell == 1000 meters (or similar).
  metersPerUnit: number;
};

export type GPEPoint = {
  x: number;
  y: number;
};

export type GPEIncidentPriority = 1 | 2 | 3 | 4;

export type GPEIncident = {
  priority: GPEIncidentPriority;
  // Short label used by rubric text extraction.
  label: string;

  // Natural language description for the candidate.
  description: string;
};

export type GPEResourceKind =
  | "jeep"
  | "boat"
  | "group_member"
  | "hospital"
  | "police_station"
  | "telephone_booth"
  | "tractor"
  | "passing_village";

export type GPEResource = {
  kind: GPEResourceKind;

  // Coordinates in map space (only for spatial resources/locations).
  location?: GPEPoint;

  // How many units/capacity for team assignment resources.
  quantity?: number;

  // Whether it is available at start for the candidate.
  // Hidden resources still exist in the environment; given resources are accessible immediately.
  availability: "given" | "hidden";
};

export type GPETransportMode = "walk" | "jeep_road" | "boat_river";

export type GPESpeedConstants = {
  // km/h
  walkKmH: number;
  jeepRoadKmH: number;
  boatFastKmH: number;
};

export type GPEMapModel = {
  mapScale: GPEMapScale;

  // MVP: use simple points and a few "routes".
  // A real implementation would use a graph of nodes + edges with terrain types.
  // For now, we use straight-line distance between points and let transport mode choose speed.
  locations: Array<{
    id: string;
    point: GPEPoint;
    kind:
      | "metalled_road"
      | "unmetalled_track"
      | "river"
      | "bridge"
      | "hospital"
      | "police_station"
      | "telephone_booth"
      | "tractor_spawn"
      | "village";
  }>;

  // For MVP feasibility: define which kinds allow which transport modes.
  transportAccess: {
    // Which location ids represent road segments usable by jeep travel.
    jeepRoadLocationIds: string[];
    // Which location ids represent river segments/bridges usable by boat travel.
    boatRiverLocationIds: string[];
  };
};

export type GPEScenario = {
  scenarioId: "indoor_map_v1" | "indoor_map_v2";

  // Hard-coded statement presented to the candidate.
  promptText: string;

  // Spatial + incident model used for scoring.
  map: GPEMapModel;

  // Exactly 4 incident problems (Priority 1..4).
  incidents: GPEIncident[];

  // Candidate given / hidden environment resources.
  resources: GPEResource[];

  // Ground-truth travel speeds.
  speedConstants: GPESpeedConstants;

  // Ideal routing/targets for feasibility (MVP: just labels).
  // Example: "Priority 1 incident must be moved to hospital".
  idealActions: Array<{
    incidentPriority: GPEIncidentPriority;
    // label of destination resource kind or location.
    destinationKind: "hospital" | "police_station" | "telephone_booth" | "passing_village";
  }>;
};
