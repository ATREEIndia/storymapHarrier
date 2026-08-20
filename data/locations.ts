export interface NeighborPoint {
  lat:            number;
  lng:            number;
  label:          string;
  neighbor_label: boolean; // true = show label on hover, false = dot only
}

export interface Waypoint {
  lat: number;
  lng: number;
}

export interface StoryLocation {
  id:          number;
  title:       string;
  subtitle:    string;
  description: string;
  img:string;
  lat:         number;
  lng:         number;
  zoom:        number;    // SceneView zoom level
  tilt:        number;    // camera tilt 0=top-down 90=horizon. Use 35-60
  heading:     number;    // compass direction 0=north. Vary per location
  duration:    number;    // pan animation ms
  angle:       number;    // bird image rotation offset for this segment
                          // 0=beak up. Adjust so bird faces direction of travel
  neighbors:   NeighborPoint[];
  waypoints:   Waypoint[]; // intermediate Catmull-Rom points FROM prev TO this
                           // first location has empty array []
}

export const locations: StoryLocation[] = [
  {
    id:          1,
    title:       "Lake Balkash, Kazakhstan ",
    subtitle:    "June–July 2016",
    description: "Gangai was born in the open meadows north-east of Lake Balkash, where his parents hunted voles and passed prey to one another in mid-air. As summer ended, his instinct to migrate emerged, and at only five months old he began his first journey south.",
    img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         44.97761,
    lng:         75.4493,
    zoom:        10,
    tilt:        55,
    heading:     0,
    duration:    2200,
    angle:       0,
    waypoints:   [],
    neighbors: [
      { lat: 45.22, lng: 75.85, label: "Natal grassland patch",    neighbor_label: true  },
      { lat: 44.65, lng: 75.05, label: "Lake Balkash shore",       neighbor_label: true  },
      { lat: 45.15, lng: 74.80, label: "Vole hunting ground",      neighbor_label: false },
      { lat: 44.55, lng: 75.65, label: "First prey transfer site", neighbor_label: false },
    ],
  },
  {
    id:          2,
    title:       "Crossing the Kazakh Steppe, Kazakhstan",
    subtitle:    "August 2016",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    description: "Leaving his natal grounds, Gangai crossed the vast Kazakh steppe, soaring on thermals above open grasslands that provided ideal hunting before the long journey across Central Asia.",
    lat:         42.96098,
    lng:         70.41898,
    zoom:        7,
    tilt:        45,
    heading:     0,
    duration:    2000,
    angle:       0,
    waypoints: [
      { lat: 44.40, lng: 74.20 },
      { lat: 43.90, lng: 72.80 },
      { lat: 43.40, lng: 71.60 },
      { lat: 43.10, lng: 70.90 },
    ],
    neighbors: [
      { lat: 43.25, lng: 70.75, label: "Steppe thermal column",  neighbor_label: true  },
      { lat: 42.65, lng: 70.05, label: "Grassland hunting site", neighbor_label: true  },
      { lat: 43.15, lng: 69.85, label: "Overnight roost",        neighbor_label: false },
      { lat: 42.55, lng: 70.65, label: "Water source stop",      neighbor_label: false },
    ],
  },
  {
    id:          3,
    title:       "Central Asian Flyway, Tajikistan",
    subtitle:    "September 2016",
    description: "Gangai entered the Central Asian Flyway, an ancient migration corridor followed by generations of harriers. GPS studies suggest these routes remain remarkably consistent from year to year.",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         39.89652,
    lng:         69.21604,
    zoom:        10,
    tilt:        48,
    heading:     0,
    duration:    2000,
    angle:       0,
    waypoints: [
     
    ],
    neighbors: [
      { lat: 40.15, lng: 69.55, label: "Flyway ridge crossing",    neighbor_label: true  },
      { lat: 39.55, lng: 68.85, label: "River valley corridor",    neighbor_label: true  },
      { lat: 40.05, lng: 68.75, label: "Raptor congregation site", neighbor_label: false },
      { lat: 39.65, lng: 69.55, label: "Ancient stopover point",   neighbor_label: false },
    ],
  },
  {
    id:          4,
    title:       "Amu Darya River Banks, Uzbekistan",
    subtitle:    "Uzbekistan–Afghanistan Border",
    description: "Gangai paused near the Amu Darya River, an important stopover where migrating harriers rest, hunt and replenish fat reserves before continuing their southward journey.",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         37.98254,
    lng:         68.76837,
    zoom:        11,
    tilt:        65,
    heading:     15,
    duration:    2000,
    angle:       0,
    waypoints: [
      
    ],
    neighbors: [
      { lat: 38.25, lng: 69.05, label: "River bank roost",         neighbor_label: true  },
      { lat: 37.65, lng: 68.45, label: "Reed bed hunting area",    neighbor_label: true  },
      { lat: 38.15, lng: 68.45, label: "Fat reserve feeding site", neighbor_label: false },
      { lat: 37.75, lng: 69.05, label: "Migratory rest stop",      neighbor_label: false },
    ],
  },
  
  {
    id:          6,
    title:       "Indus River Basin Corridor, Pakistan",
    subtitle:    "October 2016",
    description: "Gangai descended into the Indus River Basin, a natural migration corridor that funnels thousands of raptors from Central Asia into the Indian subcontinent every autumn.",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         31.81119,
    lng:         68.63659,
    zoom:        7,
    tilt:        30,
    heading:     0,
    duration:    2000,
    angle:       0,
    waypoints: [
      { lat: 37.20, lng: 68.72 },
      { lat: 35.50, lng: 68.85 },
      { lat: 33.80, lng: 68.72 },
      { lat: 32.55, lng: 68.65 },
    ],
    neighbors: [
      { lat: 32.15, lng: 68.95, label: "Indus river crossing",      neighbor_label: true  },
      { lat: 31.45, lng: 68.25, label: "Raptor funnel point",       neighbor_label: true  },
      { lat: 32.05, lng: 68.25, label: "Agricultural hunting land", neighbor_label: false },
      { lat: 31.55, lng: 68.95, label: "Basin floor roost",         neighbor_label: false },
    ],
  },
  {
    id:          7,
    title:       "Thar Desert Stopover, Rajasthan",
    subtitle:    "October–November 2016",
    description: "Before heading further south, Gangai paused in the grasslands bordering the Thar Desert, where abundant grasshoppers and other insects allowed him to rebuild his energy reserves.",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         30.07858,
    lng:         69.48732,
    zoom:        8,
    tilt:        35,
    heading:     0,
    duration:    2000,
    angle:       0,
    waypoints: [
      { lat: 31.50, lng: 68.78 },
      { lat: 31.00, lng: 68.88 },
      { lat: 30.55, lng: 69.10 },
      { lat: 30.22, lng: 69.32 },
    ],
    neighbors: [
      { lat: 30.35, lng: 69.75, label: "Grasshopper hunting field", neighbor_label: true  },
      { lat: 29.75, lng: 69.15, label: "Desert edge roost",         neighbor_label: true  },
      { lat: 30.25, lng: 69.15, label: "Energy reserve feeding",    neighbor_label: false },
      { lat: 29.85, lng: 69.75, label: "Thar grassland patch",      neighbor_label: false },
    ],
  },
  {
    id:          8,
    title:       "Tal Chhapar Grassland, Rajasthan",
    subtitle:    "En Route",
    description: "Tal Chhapar is one of India's most significant grassland habitats for migrating harriers. Hundreds of Montagu's and Pallid Harriers gather here during migration before dispersing across the country.",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         28.00252,
    lng:         71.73281,
    zoom:        9,
    tilt:        35,
    heading:     0,
    duration:    2000,
    angle:       0,
    waypoints: [
      { lat: 29.75, lng: 69.62 },
      { lat: 29.30, lng: 70.15 },
      { lat: 28.85, lng: 70.85 },
      { lat: 28.28, lng: 71.32 },
    ],
    neighbors: [
      { lat: 28.25, lng: 72.05, label: "Harrier congregation area",  neighbor_label: true  },
      { lat: 27.75, lng: 71.45, label: "Grassland roost",            neighbor_label: true  },
      { lat: 28.15, lng: 71.45, label: "Communal hunting ground",    neighbor_label: false },
      { lat: 27.85, lng: 72.05, label: "Pre-dispersal staging site", neighbor_label: false },
    ],
  },
  {
    id:          9,
    title:       "Western India Transit, Gujarat",
    subtitle:    "November 2016",
    description: "Continuing south-east, Gangai crossed the dry grasslands and agricultural landscapes of western India, stopping to hunt before reaching his winter destination.",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         23.74894,
    lng:         71.49458,
    zoom:        8,
    tilt:        30,
    heading:     0,
    duration:    2000,
    angle:       0,
    waypoints: [
      { lat: 27.55, lng: 71.75 },
      { lat: 26.55, lng: 71.82 },
      { lat: 25.45, lng: 71.72 },
      { lat: 24.45, lng: 71.60 },
    ],
    neighbors: [
      { lat: 23.95, lng: 71.75, label: "Agricultural hunting land", neighbor_label: true  },
      { lat: 23.45, lng: 71.15, label: "Dry grassland patch",       neighbor_label: true  },
      { lat: 23.85, lng: 71.15, label: "Gujarat transit roost",     neighbor_label: false },
      { lat: 23.55, lng: 71.75, label: "Pre-wintering stopover",    neighbor_label: false },
    ],
  },
  {
    id:          10,
    title:       "Gangewadi, Solapur, Maharashtra",
    subtitle:    "November 2016 · Wintering Ground",
    description: "Gangai was captured here and fitted with a GPS transmitter. He returned to the same wintering site with remarkable precision year after year, demonstrating extraordinary site fidelity.",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         19.10308,
    lng:         74.8038,
    zoom:        10,
    tilt:        42,
    heading:     0,
    duration:    2000,
    angle:       0,
    waypoints: [
      { lat: 23.05, lng: 71.82 },
      { lat: 21.55, lng: 72.55 },
      { lat: 20.45, lng: 73.55 },
      { lat: 19.65, lng: 74.25 },
    ],
    neighbors: [
      { lat: 19.35, lng: 75.05, label: "GPS capture site",        neighbor_label: true  },
      { lat: 18.85, lng: 74.55, label: "Primary winter territory", neighbor_label: true  },
      { lat: 19.25, lng: 74.55, label: "Wintering roost",         neighbor_label: false },
      { lat: 18.85, lng: 75.05, label: "Fidelity study area",     neighbor_label: false },
    ],
  },
  {
    id:          11,
    title:       "Roost at Solapur Grasslands, Maharashtra",
    subtitle:    "December–March Each Year",
    description: "Each evening Gangai joined dozens of harriers at communal roosts hidden in tall grass. Researchers studied regurgitated pellets to understand their diet and monitor the health of the surrounding grassland ecosystem.",
     img:"https://atree-communication.s3.ap-south-1.amazonaws.com/storymap-harrier/photo/forest_fire_bird_flying.jpg",
    lat:         17.81148,
    lng:         76.04278,
    zoom:        11,
    tilt:        45,
    heading:     0,
    duration:    2000,
    angle:       0,
    waypoints: [
      { lat: 19.05, lng: 74.92 },
      { lat: 18.65, lng: 75.22 },
      { lat: 18.22, lng: 75.62 },
      { lat: 17.92, lng: 75.88 },
    ],
    neighbors: [
      { lat: 18.05, lng: 76.25, label: "Communal roost site",   neighbor_label: true  },
      { lat: 17.55, lng: 75.75, label: "Pellet study transect", neighbor_label: true  },
      { lat: 17.95, lng: 75.75, label: "Tall grass roost area", neighbor_label: false },
      { lat: 17.65, lng: 76.25, label: "Ecosystem study zone",  neighbor_label: false },
    ],
  },
];
