export type Category =
  "All work" | "Machine learning" | "Graphics & systems" | "Robotics";
export type Project = {
  id: string;
  index: string;
  name: string;
  category: Exclude<Category, "All work">;
  additionalCategories?: Exclude<Category, "All work">[];
  tagline: string;
  description: string;
  tags: string[];
  image?: string;
  // A still for the card when `image` is too tall to crop well there.
  cardImage?: string;
  // Alt text and caption for an `image` shown on its own (no video).
  imageAlt?: string;
  imageCaption?: string;
  video?: string;
  // `aspect` (width / height) sizes side-by-side clips to a shared height.
  moreVideos?: { src: string; caption: string; aspect?: number }[];
  wide?: boolean;
  // Media too wide to sit beside the text; the dialog stacks it full width.
  wideMedia?: boolean;
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
    repo: "drishti-lidar",
    wide: true,
    image: "/media/segmentation-still.webp",
    video: "/media/segmentation-clip.mp4",
    description:
      "From a cloud of points to an understanding of the world. Raw scans from a spinning LiDAR become labelled points, a 2.5D map and tracked 3D boxes around cars and people.",
    tags: ["MLX C++", "Metal", "LiDAR"],
    facts: [
      ["26.4 ms", "end-to-end / scan"],
      ["26× less", "grid memory: 7.3 MB, foveated"],
      ["500", "validation scans"],
    ],
    paragraphs: [
      "For our Smart India Hackathon 2026 entry, I ported SalsaNext to MLX C++, then connected the segmentation output to an adaptive-resolution 2.5D grid and my Metal renderer.",
      "Each scan goes through five steps, from an unordered cloud of points to something a car can plan with.",
      "1 · Projection. A spinning LiDAR returns an unordered cloud of about 118,000 points per scan. Each point’s yaw picks a column and its pitch picks a row, so the cloud becomes a 64 × 2048 range image, one row per laser of the Velodyne HDL-64. When several points land on the same pixel, the closest one wins. Each pixel stores range, x, y, z and remission. A neural network can process a 2D image like this far faster than a raw point cloud.",
      "2 · Segmentation. The range image goes into SalsaNext, a segmentation network I ported from PyTorch to MLX in C++. It runs natively on the Apple silicon GPU for high throughput, with no Python in the loop. It labels every pixel with one of 20 SemanticKITTI classes, such as road, car, person, building and vegetation. The converted weights are checked against PyTorch’s output before they are used.",
      "3 · Back to 3D. The labels are copied from the pixels back onto the points. Only the point a pixel actually showed counts toward objects. Otherwise the points hidden behind it would inherit its class, and the wall behind a car would become “car”.",
      "4 · Clustering. Car and person points are grouped into objects in bird’s-eye view. They are binned into small squares, 30 cm for cars and 20 cm for people, and touching squares are flood-filled into one object. Each object gets an oriented 3D box from an L-shape fit, and a tracker follows the boxes from scan to scan to give every car and person an ID and a speed.",
      "5 · The 2.5D grid. Finally, the labelled points fill a bird’s-eye map. Each cell stores its lowest and highest point, a point count and its most important class: terrain, static or dynamic. That is what a planner needs to know where the car can drive. A uniform 5 cm grid over 200 m × 200 m would need 16 million cells, but fine detail only matters near the car. So the grid is foveated, like an eye: 5 cm cells out to 10 m, then 10 cm to 20 m, 20 cm to 40 m and 40 cm to 100 m. That is 610,000 cells in 7.3 MB, about 26× less memory, with full detail kept close to the car.",
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
    additionalCategories: ["Machine learning"],
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
      "Every operation in that graph has two implementations: on the GPU it runs as a Metal compute kernel, and on the CPU as C++ using ARM NEON instructions. Writing maths computes nothing; eval() walks the graph and runs it on whichever device you choose.",
      "Like MLX and JAX, which inspired it, matrix is lazily evaluated and functional. You describe a computation as a function of matrices, and the library hands back new functions: a compiled version of it, or its gradient.",
      "The idea behind it is about cost. Running an operation on the GPU is mostly paid for in encoding the work and decoding the results, not in the maths itself. So matrix builds the graph once, allocates its memory once, and then runs it any number of times, paying only for the work. Every node becomes a stage in a pipeline that is always ready to run again. Inputs are leaves written in place: mark one as changed and only the parts that depend on it run again. That is how my LiDAR plane segmentation responds to a slider without recomputing every surface normal.",
      "Forward-mode (JVP) and reverse-mode (VJP) rules live on every operation, so the gradient of a function is just more nodes in the same graph, compiled and run on the GPU like anything else. The API follows MLX: grad, value_and_grad, and laplacian, which sums second derivatives for physics-style problems.",
      "45 Metal kernel files cover elementwise maths and broadcasting, reductions including argmax and argmin, matrix multiplication, N-dimensional convolution, scatter and gather, resampling, random numbers and a discrete Fourier transform. Twelve data types run from Bool and Int8 through Float16 and BFloat16 to Complex64. When no built-in operation fits, gpu_func drops a hand-written Metal kernel into the graph as a node of its own.",
      "Operations and their gradients are tested on both the CPU and Metal paths, with results checked against MLX.",
      "matrix sits underneath several other projects here: the drishti LiDAR pipeline, the gravity simulation, the iPhone depth and RANSAC demos, and the eight-million-point particle renderer.",
    ],
  },
  {
    id: "gravity",
    index: "03",
    name: "Gravity, in motion.",
    category: "Graphics & systems",
    tagline: "A real-time gravity simulation",
    visual: "gravity",
    video: "/media/gravity-simulation.mp4",
    repo: "WorldOf3D",
    description:
      "Eight thousand particles falling around a small planet, written entirely as tensor maths and drawn live in my Metal renderer.",
    tags: ["Particle simulation", "matrix", "Metal"],
    facts: [
      ["8,000", "particles on a 20³ grid"],
      ["1 / r²", "pull toward a central body"],
      ["30 / s", "physics steps, whole cloud at once"],
    ],
    paragraphs: [
      "The scene starts as a 20 × 20 × 20 lattice spanning −10 to 10 on each axis, built with meshgrid and flattened into one 8,000 × 3 tensor of positions. Every particle gets a random colour and a random starting velocity between −1 and 1 on each axis, so the cloud begins as a lattice that immediately starts to scatter.",
      "At the centre sits a small sphere, the “Earth”. Its texture is generated rather than loaded: a Perlin noise field blends blue oceans with green land, then gets uploaded straight to the GPU as a Metal texture.",
      "Each frame applies Newton’s inverse-square law to every particle at once. The acceleration toward the centre is −r / |r|³: square the positions, sum across x, y and z, take r² · √r², and divide. Velocity is updated first and position second, using the new velocity, a semi-implicit Euler step that keeps orbits stable for longer than a naive update.",
      "There is no per-particle loop anywhere. The whole step is four lines of matrix expressions, so the physics is just another computation graph, re-evaluated 30 times a second on a background queue and handed to the point-cloud renderer.",
      "Because the initial velocities are random, some particles fall in close and slingshot back out, some settle into looping orbits, and others escape entirely. Every run is a little different.",
    ],
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
    wideMedia: true,
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
    tagline: "mlxpipe · MediaPipe, rebuilt on MLX",
    visual: "hands",
    video: "/media/handtrack-clip.mp4",
    repo: "mlxpipe",
    description:
      "Google’s MediaPipe hand and face pipelines, rebuilt for Apple Silicon on MLX. The same models and the same landmarks, in one GPU round trip per frame.",
    tags: ["MLX C++", "MediaPipe", "Real-time vision"],
    facts: [
      ["4.7 ms", "two hands + a face, one graph"],
      ["450 / 450", "frames agreeing with MediaPipe"],
      ["0.12 px", "face-mesh gap to MediaPipe"],
    ],
    paragraphs: [
      "mlxpipe runs MediaPipe’s hand tracking (21 landmarks per hand), face mesh (478 landmarks, plus 52 blendshapes) and face detection on the GPU through MLX. It loads Google’s own .task bundles and .tflite files directly. There is no TensorFlow underneath: the runtime parses the TFLite FlatBuffer and its metadata itself and maps 27 operators onto MLX.",
      "Every MediaPipe calculator is ported one-to-one as a node, keeping MediaPipe’s option names so each stage can be checked against the original. That covers rotated crops, SSD anchors, detection decoding, non-max suppression, rect transforms, landmark projection and One Euro smoothing. Pipelines are typed graphs built in plain C++, with no .pbtxt files and no protobuf. Wiring an image stream into a tensor input is a compile error.",
      "The speed comes from three things. MLX is lazy, so the graph builds every node’s tensor work first and evaluates it all in a single GPU submission per frame: palm detection, tracked-hand landmarks and the face mesh share one round trip. Where MediaPipe loops over hands and faces one at a time, mlxpipe crops them into one batch and runs each model once. And every model’s forward pass is wrapped in mx::compile, which fuses the elementwise ops between convolutions.",
      "On 450 consecutive 1080p webcam frames, mlxpipe found the same number of hands and faces as MediaPipe’s CPU path in every frame. Its face landmarks sit 0.12 px from MediaPipe’s on average, and its hand landmarks 0.83 px. MediaPipe’s own GPU delegate strays much further from its CPU path, and drops the second hand in most two-hand frames.",
      "Run back to back, mlxpipe takes 3.3 ms for two hands, 1.8 ms for a face and 4.7 ms for both in one graph. That is 1.7–1.9× faster than MediaPipe on the CPU and over 3× faster than its GPU delegate. Paced at 30 fps the picture flips: the GPU clocks down between frames, MediaPipe’s CPU path pulls ahead, and the combined graph roughly ties (11.5 ms against 11.0 ms).",
      "Some differences are deliberate. MediaPipe’s task graph hands all 21 landmarks to a calculator that expects a 12-point knuckle subset; on recorded footage that lost the second hand in 34 of 123 two-hand frames, so mlxpipe uses the subset. Each tracked face gets its own One Euro filter, so smoothing still works with several faces.",
      "Face detection and landmarks also ship as a dylib behind a plain C header, usable from C, Objective-C, Swift or Python without MLX or OpenCV headers. Sherlock’s face mesh comes from mlxpipe. Every model is tested against golden outputs, compiled against eager and batched against single, and a replay tool checks new builds against recorded footage.",
    ],
    note: "Figures from the mlxpipe README: Apple M4 Max, 1920 × 1080 webcam frames, median time per frame, compared with Google’s MediaPipe 1.1.1 (Python Tasks API, VIDEO mode, same model bundles) on the same frames. The inference time in the recording’s overlay is model time only, not camera-to-display latency.",
  },
  {
    id: "hallway",
    index: "06",
    name: "One hallway, three views.",
    category: "Robotics",
    tagline: "RANSAC floor-plane detection",
    visual: "hallway",
    wide: true,
    // The result leads; the camera feed and depth map it came from follow.
    video: "/media/hallway-cloud.mp4",
    moreVideos: [
      {
        src: "/media/hallway-real.mp4",
        caption: "The hallway as the camera sees it.",
        aspect: 450 / 800,
      },
      {
        src: "/media/hallway-depth.mp4",
        caption: "Colour-mapped depth, with people appearing as near shapes.",
        aspect: 1200 / 800,
      },
    ],
    description:
      "The same walk down a hallway as the camera sees it, as depth, and as a point cloud with the floor found by RANSAC on the GPU, live on an iPhone.",
    tags: ["RANSAC", "Metal compute", "iPhone depth"],
    facts: [
      ["300", "candidate planes per frame"],
      ["1 thread", "per point–plane pair"],
      ["2 passes", "score every plane, then mask the winner"],
    ],
    paragraphs: [
      "Three views of one walk: the real hallway from the iPhone camera, its depth map, and the same depth pushed out into a 3D point cloud. The whole pipeline runs on the phone, aiming for 30 frames a second.",
      "Every depth pixel becomes a point: its column and row are spread across a fixed grid, and its depth becomes the third axis. The colour camera and the depth sensor share a field of view but not a resolution, so each point finds its colour by scaling its pixel coordinates into the camera image and gathering the nearest pixel. That is one tensor gather instead of a reprojection.",
      "RANSAC finds the floor by guessing and checking. It picks three random points, takes the cross product of two edges to get a normal, and that normal plus a point defines a candidate plane. Repeated or nearly collinear triples are thrown away. This repeats 300 times per frame. Sampling stays on the CPU, because it is cheap and full of branches.",
      "Scoring is where the time goes: every point has to be tested against every candidate. A Metal kernel dispatches a 2D grid with one thread per point–plane pair. Each thread checks |n · p + d| < 0.06 and, if the point is close enough, atomically increments that candidate’s counter. The CPU then takes the argmax over just 300 numbers, and a second kernel writes the final inlier mask for the winning plane only.",
      "That mask becomes a per-point weight: 0.9 on the floor and 0 everywhere else, broadcast against the photo colours. Floor points are pulled strongly toward green, while walls and people keep their real colour, so anything standing on the ground stands out.",
      "The same function can also take the phone’s gravity vector and reject candidates tilted more than 20° from level, counting up and down alike because the sign of a cross product is arbitrary. This recording ran without that constraint. In a hallway, the floor is the largest flat surface in view, so it wins anyway.",
    ],
  },
  {
    id: "neptune",
    index: "07",
    name: "Code that stays alive.",
    category: "Graphics & systems",
    tagline: "Neptune · an interactive C++ notebook",
    visual: "neptune",
    repo: "Neptune",
    description: "An interactive notebook for C++ and Objective-C++, powered by a native kernel that remembers what came before.",
    tags: ["C++", "Objective-C++", "LLVM / Clang"],
    facts: [["C++", "and Objective-C++"], ["Native", "persistent kernel"], ["Metal", "direct GPU access"]],
    paragraphs: ["Neptune brings an interactive notebook workflow to C++ and Objective-C++, with a separate kernel that keeps variables and functions alive across cells.", "Each cell is compiled into a dynamic library and loaded into the running process. That makes it possible to experiment incrementally while working with native code and Metal."],
  },
  {
    id: "quantum-stream",
    index: "08",
    name: "A world in every frame.",
    category: "Graphics & systems",
    tagline: "QuantumStream · live sensor streaming",
    visual: "quantum",
    description: "Depth, color, and camera calibration travel together from iPhone to Mac as one synchronized frame.",
    tags: ["C++", "Networking", "iPhone → Mac"],
    facts: [["3", "data types in one frame"], ["TCP / UDP", "transport"], ["Live", "sensor data"]],
    paragraphs: ["QuantumStream sends live sensor data from an iPhone to a Mac, joining depth, color video, and camera calibration into a synchronized frame.", "The streaming module supports TCP and chunked UDP, making camera data available to native applications for real-time experiments."],
  },
  {
    id: "sherlock",
    index: "09",
    name: "A pulse in the pixels.",
    category: "Machine learning",
    tagline: "Sherlock · detecting a heartbeat from video",
    visual: "sherlock",
    image: "/media/sherlock-poster.webp",
    cardImage: "/media/sherlock-card.webp",
    imageAlt:
      "Project Sherlock poster: a point-cloud figure with a magnifying glass over the cheek showing skin flushed red, amplified 40 times, above a heartbeat trace and the four steps capture, map, split and amplify.",
    imageCaption:
      "The project poster. The figure is an illustration, with the red shown amplified.",
    description:
      "A webcam, a face mesh and a band-pass filter: amplifying the invisible flush of a heartbeat, live and on-device, to help tell real faces from deepfakes.",
    tags: ["Computer vision", "MLX", "Signal processing", "Deepfake detection"],
    facts: [
      ["478", "face-mesh landmarks, via mlxpipe"],
      ["0.7–2.5 Hz", "heartbeat band, 42–150 bpm"],
      ["×40", "colour amplification"],
    ],
    paragraphs: [
      "Every heartbeat pushes a little more blood into the face, and the skin turns very slightly redder. The change is far too small to see. Sherlock uses Eulerian video magnification to amplify it and recover a pulse from an ordinary webcam, live and on-device.",
      "Capture and map: a webcam films the face at 30 frames a second, and each frame goes through mlxpipe, my rebuild of MediaPipe’s vision pipelines on MLX. It places a 478-point face mesh, so the pipeline knows which pixels are skin and can follow them as the head moves.",
      "Split: each frame is reduced to an 80 × 45 grid, 3,600 colour cells. Averaging pixels into cells smooths away camera noise and leaves one slow colour signal per cell over time.",
      "Amplify: each cell’s signal is band-pass filtered to 0.7–2.5 Hz, roughly 42 to 150 beats per minute, the range a human heart beats in. Breathing, lighting drift and fast flicker fall outside the band and are discarded. What remains is multiplied by 40 and capped at ±24, so the face visibly flushes with each beat without being washed out.",
      "A real face carries that rhythm across its skin; a generated one may not, or may carry it inconsistently. The presence and consistency of the recovered signal can provide a clue when distinguishing real footage from deepfakes.",
    ],
  },
  {
    id: "throughput",
    index: "10",
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
    repo: "WorldOf3D",
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
];
export const moreProjects = [
  {
    name: "WorldOf3D",
    type: "Graphics engine",
    text: "Scene graphs, ray picking, BVH, gizmos, and particles. Graphics and compute share one tensor graph.",
    repo: "WorldOf3D",
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
