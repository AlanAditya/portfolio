export type Category =
  "All work" | "Machine learning" | "Graphics & systems" | "Robotics";
export type Project = {
  id: string;
  index: string;
  name: string;
  category: Exclude<Category, "All work">;
  tagline: string;
  description: string;
  tags: string[];
  image?: string;
  video?: string;
  moreVideos?: { src: string; caption: string }[];
  wide?: boolean;
  repo?: string;
  visual: string;
  facts: [string, string][];
  paragraphs: string[];
  note?: string;
};
export const projects: Project[] = [
  {
    id: "perception",
    index: "01",
    name: "Teaching machines to see.",
    category: "Robotics",
    tagline: "Real-time LiDAR perception",
    visual: "lidar",
    wide: true,
    image: "/media/segmentation-still.webp",
    video: "/media/segmentation-clip.mp4",
    description:
      "From a cloud of points to an understanding of the world. A perception pipeline built for autonomous driving.",
    tags: ["MLX C++", "Metal", "LiDAR"],
    facts: [
      ["26.4 ms", "end-to-end / scan"],
      ["7.3 MB", "foveated grid memory"],
      ["500", "validation scans"],
    ],
    paragraphs: [
      "For our Smart India Hackathon 2026 entry, I ported SalsaNext to MLX C++, then connected the segmentation output to an adaptive-resolution 2.5D grid and my Metal renderer.",
      "Four nested rings grow from 5 cm cells near the sensor to 40 cm cells at a distance. That keeps detail where it matters, using 610,000 cells instead of 16 million.",
      "The same grid also accepts iPhone depth. On that data, GPU RANSAC finds the floor using the phone’s gravity vector; plane clustering separates obstacles.",
    ],
    note: "Measured on 500 scans of SemanticKITTI validation sequence 08 (58.9 million labelled points). Mean IoU: 46.3%. This subset skipped SalsaNext’s optional KNN post-processing; these figures are not a full-dataset benchmark.",
  },
  {
    id: "matrix",
    index: "02",
    name: "Start with the maths.",
    category: "Graphics & systems",
    tagline: "matrix · a lazily evaluated tensor library",
    visual: "matrix",
    repo: "matrix",
    description:
      "A lazy tensor library with automatic differentiation. One computation graph, from the CPU to the GPU.",
    tags: ["C++", "Metal compute", "Autodiff"],
    facts: [
      ["CPU + GPU", "execution paths"],
      ["JVP / VJP", "automatic differentiation"],
      ["Lazy", "nothing runs until you ask"],
    ],
    paragraphs: [
      "I wanted to understand the machinery underneath machine learning. So I built the machinery: a linear algebra library where writing an expression constructs a graph, and asking for a result executes it.",
      "Every operation has a CPU path and a Metal GPU path. The same graph can be compiled once, then run on either device.",
      "Forward- and reverse-mode differentiation are part of that graph, so the gradient of a function is just more nodes in the same graph.",
    ],
  },
  {
    id: "throughput",
    index: "03",
    name: "Eight million points.",
    category: "Graphics & systems",
    tagline: "Throughput: eight million points from one graph",
    visual: "throughput",
    video: "/media/particles-orbit.mp4",
    moreVideos: [
      {
        src: "/media/particles-inside.mp4",
        caption:
          "The camera inside the cloud, where the point grid lines up into kaleidoscopic starbursts.",
      },
    ],
    repo: "matrix",
    description:
      "A 200 × 200 × 200 grid of coloured points, built as tensors in the matrix graph and drawn straight from GPU buffers.",
    tags: ["Metal", "GPU buffers", "Real-time rendering"],
    facts: [
      ["8 million", "points drawn live"],
      ["120+ FPS", "on an M4 Max"],
      ["GPU buffers", "drawn without a copy"],
    ],
    paragraphs: [
      "The particle demo builds a 200 × 200 × 200 grid of randomly coloured points as tensors, so the positions and colours are just nodes in the same matrix graph.",
      "The renderer draws them straight from the GPU buffers, joining computation and graphics without an extra copy. It is a test of how much throughput the library can sustain.",
    ],
    note: "The native particle demo was recorded on an M4 Max. The interactive sculpture on this website is a separate browser visualization, not a benchmark of matrix.",
  },
  {
    id: "depth",
    index: "04",
    name: "Another dimension.",
    category: "Machine learning",
    tagline: "Depth Anything V2, native on MLX",
    visual: "depth",
    image: "/media/depth-demo.webp",
    video: "/media/depth-webcam.mp4",
    repo: "Depth-Anything-MLX",
    description:
      "Turning a single image into depth, and depth into a world you can move through. Native on Apple Silicon.",
    tags: ["Computer vision", "MLX", "3D reconstruction"],
    facts: [
      ["DINOv2", "vision encoder"],
      ["DPT", "depth prediction head"],
      ["Image → 3D", "point-cloud reconstruction"],
    ],
    paragraphs: [
      "I ported Depth Anything V2 layer by layer from PyTorch to Apple’s MLX framework, including the DINOv2 encoder and DPT depth head.",
      "A weight converter transforms the official checkpoint into MLX arrays. A verification script compares outputs against the original PyTorch model, so the port is checked instead of simply assumed correct.",
      "The result works with images, video, and a webcam. Each pixel’s estimated depth becomes a position in space, coloured by the original image, creating a point cloud you can orbit.",
    ],
  },
  {
    id: "hands",
    index: "05",
    name: "A more human interface.",
    category: "Machine learning",
    tagline: "Hand tracking, rebuilt in C++",
    visual: "hands",
    video: "/media/handtrack-clip.mp4",
    repo: "MEDIAPIPE_MLX_PORT",
    description:
      "From a TensorFlow Lite model to a native MLX pipeline. Twenty-one landmarks, one hand at a time.",
    tags: ["MLX C++", "Model transpiler", "Real-time vision"],
    facts: [
      ["21", "landmarks per hand"],
      ["MLX C++", "native forward pass"],
      ["One Euro", "temporal smoothing"],
    ],
    paragraphs: [
      "Google’s hand pipeline normally runs on TensorFlow Lite. I wrote a transpiler that reads those model files and generates an equivalent MLX C++ forward pass.",
      "Around the networks, I rebuilt rotated crops, anchor decoding, non-max suppression, and tracking logic. IoU checks prevent duplicate trackers, while One Euro filtering stabilizes the landmarks.",
      "The webcam pipeline runs without TensorFlow Lite at inference time. The supplied recording shows 13.7 ms of inference per frame; that is the model inference time, not the full camera-to-display latency.",
    ],
  },
  {
    id: "hallway",
    index: "06",
    name: "One hallway, three views.",
    category: "Robotics",
    tagline: "RANSAC floor-plane detection",
    visual: "hallway",
    wide: true,
    video: "/media/hallway-real.mp4",
    moreVideos: [
      {
        src: "/media/hallway-depth.mp4",
        caption: "Colour-mapped depth, with people appearing as near shapes.",
      },
      {
        src: "/media/hallway-cloud.mp4",
        caption: "The point cloud, with the floor plane found by RANSAC in green.",
      },
    ],
    description:
      "The same walk down a hallway as the camera sees it, as depth, and as a point cloud with the floor plane picked out.",
    tags: ["RANSAC", "Depth", "Point clouds"],
    facts: [
      ["3", "views of one walk"],
      ["RANSAC", "floor plane fit"],
      ["Depth", "distance for every pixel"],
    ],
    paragraphs: [
      "The left clip is the real hallway. The middle is its depth map, and the right is the same depth pushed out into a 3D point cloud.",
      "RANSAC fits a plane to the floor, and the points that belong to it are coloured green so the obstacles stand out from the ground.",
    ],
  },
];
export const moreProjects = [
  {
    name: "WorldOf3D",
    type: "Graphics engine",
    text: "Scene graphs, ray picking, BVH, gizmos, and particles. Graphics and compute share one tensor graph.",
    repo: "WorldOf3D",
  },
  {
    name: "Neptune",
    type: "Developer tools",
    text: "A notebook for C++ and Objective-C++, with persistent variables, a separate kernel, and direct Metal access.",
    repo: "Neptune",
  },
  {
    name: "ColabFoldMLX",
    type: "Scientific computing",
    text: "Protein structure prediction on MLX, with 3D visualization and folding animations.",
    repo: "ColabFoldMLX",
  },
];
export const experiments = [
  {
    name: "Project Sunflower",
    type: "Sensors + servos",
    text: "A solar panel that follows the light. Four light sensors estimate direction, and servos keep the panel facing it.",
  },
  {
    name: "Path-planning sandbox",
    type: "Python + pygame",
    text: "Draw barriers and watch an A* search explore the route. An early step toward the driving stack.",
  },
  {
    name: "QuantumStream",
    type: "iPhone ↔ Mac",
    text: "Live tensors over TCP or chunked UDP. Depth, RGB, and camera intrinsics travel together in one frame.",
  },
];

export const archive = [
  {
    name: "Applets & control panel",
    category: "Native tools",
    description:
      "A shared macOS and iOS control panel for small experiments: a per-pixel differential equation solver, a gravity simulation, and an eight-million-point renderer. Each prototype is a function inside the engine, instead of another Xcode project.",
  },
  {
    name: "Edge-cloud scheduler",
    category: "C++17",
    description:
      "A scheduler for an interactive-judge contest problem, with a mock judge that simulates random multi-request scenarios, checks assignment legality, and runs exact-match regression tests.",
  },
  {
    name: "Smart-home experiments",
    category: "Connected devices",
    description:
      "A virtual HomeKit lightbulb with HAP-python, and a Philips Hue Entertainment setup that calls mbedTLS directly from Python through ctypes.",
  },
  {
    name: "Early Metal apps",
    category: "SwiftUI + Metal",
    description:
      "A 3D scene editor with an OBJ loader, a video editor, and an image-effects app. These experiments eventually led to the shared graphics engine.",
  },
  {
    name: "Robots, circuits & a drone",
    category: "Where it started",
    description:
      "A line follower that qualified for a world robotics championship, inter-school competitions, ESP32 and Arduino audio projects, and a drone build. The line follower met its hardest test under stage lights that overwhelmed its sensors — a lesson in testing outside the workshop.",
  },
];
