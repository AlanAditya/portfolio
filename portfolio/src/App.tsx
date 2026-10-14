import { useEffect, useRef, useState } from "react";
import PointCloud from "./PointCloud";
import ThemeToggle from "./ThemeToggle";
import type { Shape } from "./PointCloud";
import { archive, experiments, moreProjects, projects } from "./data";
import type { Category, Project } from "./data";

const github = "https://github.com/AlanAditya";
const categories: Category[] = [
  "All work",
  "Machine learning",
  "Graphics & systems",
  "Robotics",
];
function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      a<span>·</span>
    </span>
  );
}
function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <Arrow diagonal />
    </a>
  );
}
function HandDrawing() {
  return (
    <svg
      className="hand-drawing"
      viewBox="0 0 500 310"
      role="img"
      aria-label="Illustration of 21 connected hand tracking landmarks"
    >
      <defs>
        <pattern
          id="hand-grid"
          width="25"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <path d="M25 0H0V25" fill="none" stroke="#cbd0c2" strokeWidth=".5" />
        </pattern>
      </defs>
      <rect width="500" height="310" fill="url(#hand-grid)" />
      <g stroke="#424f40" strokeWidth="1.4" fill="none">
        <path d="M259 264 198 210 158 185 131 155 115 127M259 264 204 178 192 125 182 87 177 52M259 264 248 167 245 108 242 67 240 32M259 264 288 177 294 122 298 87 299 57M259 264 321 194 340 153 353 124 362 101M204 178 248 167 288 177 321 194" />
      </g>
      <g fill="#ed542e">
        {[
          [259, 264],
          [198, 210],
          [158, 185],
          [131, 155],
          [115, 127],
          [204, 178],
          [192, 125],
          [182, 87],
          [177, 52],
          [248, 167],
          [245, 108],
          [242, 67],
          [240, 32],
          [288, 177],
          [294, 122],
          [298, 87],
          [299, 57],
          [321, 194],
          [340, 153],
          [353, 124],
          [362, 101],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" />
        ))}
      </g>
      <g fontFamily="monospace" fontSize="10" fill="#4e5a48">
        <text x="370" y="92">
          20
        </text>
        <text x="250" y="27">
          08
        </text>
        <text x="267" y="285">
          00 / WRIST
        </text>
        <text x="24" y="28">
          21 LANDMARKS
        </text>
        <text x="24" y="289">
          HAND / 01
        </text>
        <text x="384" y="289">
          MLX C++
        </text>
      </g>
    </svg>
  );
}
function MatrixDrawing() {
  return (
    <div
      className="matrix-art"
      aria-label="Illustration of a computational graph"
    >
      <span className="visual-note">LAZY EVALUATION / EAGER CURIOSITY</span>
      <svg viewBox="0 0 560 270" aria-hidden="true">
        <g fill="none" stroke="#777c70" strokeWidth="1">
          <path d="M60 92H150L225 135H290M60 192H150L225 135M290 135H360L405 80H480M360 135 405 200H480" />
        </g>
        <g fill="#1d231e" stroke="#899080">
          <rect x="40" y="67" width="70" height="50" rx="4" />
          <rect x="40" y="167" width="70" height="50" rx="4" />
          <rect x="235" y="110" width="70" height="50" rx="4" />
          <rect x="445" y="55" width="80" height="50" rx="4" />
          <rect x="445" y="175" width="80" height="50" rx="4" />
        </g>
        <g
          fontFamily="monospace"
          fontSize="18"
          textAnchor="middle"
          fill="#e4e6d9"
        >
          <text x="75" y="98">
            x
          </text>
          <text x="75" y="198">
            w
          </text>
          <text x="270" y="142">
            ×
          </text>
          <text x="485" y="86">
            f(x)
          </text>
          <text x="485" y="206">
            ∂f/∂x
          </text>
        </g>
        <circle
          className="graph-pulse"
          cx="339"
          cy="135"
          r="5"
          fill="#f36b42"
        />
      </svg>
      <div className="matrix-code">
        <span>matrix</span> y = (x * w).<span>sum</span>();
        <br />
        <span className="code-comment">// understand it. then build it.</span>
      </div>
    </div>
  );
}
function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <article className={`project project-${project.visual}`}>
      <button
        className="project-open"
        onClick={onOpen}
        aria-label={`Explore ${project.tagline}`}
      >
        <div className={`project-visual ${project.visual}`}>
          {project.visual === "matrix" ? (
            <MatrixDrawing />
          ) : project.visual === "hands" ? (
            <HandDrawing />
          ) : (
            <img
              src={project.image}
              alt={
                project.visual === "lidar"
                  ? "Segmented LiDAR scan of a road junction, with roads, buildings, and vegetation in different colours"
                  : "A street scene beside its predicted depth map"
              }
              width="800"
              height="480"
              loading="lazy"
              decoding="async"
            />
          )}
          <span className="project-image-label">
            {project.index} / {project.category.toUpperCase()}
          </span>
          <span className="project-open-arrow">
            <Arrow diagonal />
          </span>
          {project.visual === "lidar" && (
            <span className="image-metric">
              <b>
                26.4<span> ms</span>
              </b>
              <small>FROM SCAN TO SCENE</small>
            </span>
          )}
        </div>
        <div className="project-heading">
          <h3>{project.name}</h3>
          <Arrow diagonal />
        </div>
        <p className="project-subtitle">{project.tagline}</p>
      </button>
      <p className="project-description">{project.description}</p>
      <div className="tags">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}
function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!project) return;
    const dialog = ref.current;
    const returnFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = oldOverflow;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [project]);
  if (!project) return null;
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const r = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-top">
        <span className="eyebrow">
          PROJECT {project.index} / {project.category}
        </span>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close project"
        >
          ×
        </button>
      </div>
      <div className="dialog-body">
        <h2 id="dialog-title">{project.tagline}</h2>
        <p className="dialog-intro">{project.description}</p>
        {project.video && (
          <video
            key={project.video}
            controls
            playsInline
            preload="metadata"
            poster={project.image}
            aria-label={`${project.tagline} project recording`}
          >
            <source src={project.video} type="video/mp4" />
            Your browser does not support this video.
          </video>
        )}
        <div className="project-facts">
          {project.facts.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <h3>Under the surface</h3>
        {project.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {project.note && <p className="technical-note">{project.note}</p>}
        {project.repo ? (
          <ExternalLink
            href={`${github}/${project.repo}`}
            className="button dark-button"
          >
            Explore the source
          </ExternalLink>
        ) : (
          <ExternalLink href={github} className="button dark-button">
            More on GitHub
          </ExternalLink>
        )}
      </div>
    </dialog>
  );
}
function Playground() {
  const [shape, setShape] = useState<Shape>("torus");
  const [paused, setPaused] = useState(false);
  const [density, setDensity] = useState(1);
  return (
    <section id="playground" className="playground section-shell">
      <div className="section-kicker">
        <span className="eyebrow">03 / PLAYGROUND</span>
        <span className="eyebrow muted">A LITTLE ROOM FOR CURIOSITY</span>
      </div>
      <div className="playground-layout">
        <div className="playground-copy">
          <h2>
            Some things are
            <br />
            better <em>played with.</em>
          </h2>
          <p>
            Change the shape. Follow the points.
            <br />A small experiment in seeing maths differently.
          </p>
          <fieldset className="shape-control">
            <legend className="eyebrow">01 — GEOMETRY</legend>
            <div>
              {(["torus", "sphere", "wave"] as Shape[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setShape(item)}
                  aria-pressed={shape === item}
                  className={shape === item ? "selected" : ""}
                >
                  {item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="density-control">
            <span className="eyebrow">
              02 — POINT DENSITY{" "}
              <output>
                {Math.round(density * 3800).toLocaleString("en-US")}
              </output>
            </span>
            <input
              aria-label="Point density"
              type="range"
              min="0.4"
              max="1.4"
              step="0.2"
              value={density}
              onChange={(event) => setDensity(Number(event.target.value))}
            />
          </label>
          <button
            className="text-button motion-button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
          >
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
            {paused ? "Resume rotation" : "Pause rotation"}
          </button>
        </div>
        <div className="playground-stage">
          <div className="stage-corner top-left" />
          <div className="stage-corner top-right" />
          <div className="stage-corner bottom-left" />
          <div className="stage-corner bottom-right" />
          <PointCloud shape={shape} paused={paused} density={density} />
          <span className="stage-label eyebrow">
            FIG. 02 / {shape.toUpperCase()} STUDY
          </span>
          <span className="stage-engine eyebrow">BROWSER EXPERIMENT</span>
        </div>
      </div>
    </section>
  );
}
export default function App() {
  const [category, setCategory] = useState<Category>("All work");
  const [project, setProject] = useState<Project | null>(null);
  const [heroPaused, setHeroPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <a href="#" className="brand" aria-label="Aditya Dudeja, home">
          <Mark />
          <span>
            aditya dudeja<span className="brand-dot">.</span>
          </span>
        </a>
        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}{" "}
          <span aria-hidden="true">{menuOpen ? "−" : "+"}</span>
        </button>
        <nav
          id="navigation"
          className={menuOpen ? "nav open" : "nav"}
          aria-label="Main navigation"
        >
          <a href="#work" onClick={() => setMenuOpen(false)}>
            Work<span>01</span>
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About<span>02</span>
          </a>
          <a href="#playground" onClick={() => setMenuOpen(false)}>
            Playground<span>03</span>
          </a>
          <a
            className="nav-contact"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Let’s connect <Arrow diagonal />
          </a>
        </nav>
        <ThemeToggle />
      </header>
      <main id="main">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span className="eyebrow">
              <span className="status-dot" /> ENGINEER. BUILDER. ENDLESSLY
              CURIOUS.
            </span>
            <span className="eyebrow hero-location">BITS PILANI, GOA ↗</span>
          </div>
          <div className="hero-layout">
            <div className="hero-copy">
              <h1 id="hero-title">
                Curiosity.
                <br />
                Built from
                <br />
                <span className="scratch">
                  scratch
                  <svg
                    viewBox="0 0 420 22"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M3 15Q165 0 410 10M82 19Q240 7 418 16" />
                  </svg>
                </span>
                <span className="orange">.</span>
              </h1>
              <p>
                I’m Aditya. I build the maths underneath,
                <br className="desktop-break" /> the systems around it, and the
                worlds it makes possible.
              </p>
              <div className="hero-actions">
                <a className="button dark-button" href="#work">
                  Explore my work <Arrow />
                </a>
                <a className="text-button" href="#about">
                  A little about me <span aria-hidden="true">↘</span>
                </a>
              </div>
            </div>
            <div className="hero-art">
              <div className="orbit-label eyebrow">
                <span className="crosshair">+</span> IDEAS → SYSTEMS → SOMETHING
                REAL
              </div>
              <PointCloud paused={heroPaused} />
              <div className="art-annotation">
                <span className="annotation-line" />
                <span className="eyebrow">
                  A FEW THOUSAND POINTS.
                  <br />
                  ONE ENDLESS POSSIBILITY.
                </span>
              </div>
              <div className="hero-art-footer">
                <span className="eyebrow">FIG. 01 — CURIOSITY, IN MOTION</span>
                <button
                  onClick={() => setHeroPaused((value) => !value)}
                  aria-label={
                    heroPaused
                      ? "Resume hero animation"
                      : "Pause hero animation"
                  }
                  aria-pressed={heroPaused}
                >
                  {heroPaused ? "▷" : "Ⅱ"}
                </button>
              </div>
            </div>
          </div>
          <div className="hero-bottom">
            <span className="eyebrow">
              FROM FIRST PRINCIPLES TO REAL-TIME SYSTEMS
            </span>
            <div className="hero-disciplines">
              <span>Graphics</span>
              <i /> <span>Machine learning</span>
              <i /> <span>Robotics</span>
            </div>
            <a
              className="scroll-link"
              href="#work"
              aria-label="Scroll to selected work"
            >
              ↓
            </a>
          </div>
        </section>
        <section id="work" className="work section-shell">
          <div className="section-kicker">
            <span className="eyebrow">01 / SELECTED WORK</span>
            <span className="eyebrow muted">
              BUILT TO UNDERSTAND. MADE TO WORK.
            </span>
          </div>
          <div className="section-title-row">
            <h2>
              Ideas, made <em>real.</em>
            </h2>
            <p>
              A few things I’ve taken apart,
              <br />
              figured out, and built back up.
            </p>
          </div>
          <div className="work-toolbar">
            <div className="filters" role="group" aria-label="Filter projects">
              {categories.map((cat) => (
                <button
                  key={cat}
                  aria-pressed={category === cat}
                  onClick={() => setCategory(cat)}
                  className={category === cat ? "active" : ""}
                >
                  {cat}
                  {cat === "All work" && <span>04</span>}
                </button>
              ))}
            </div>
            <span className="eyebrow project-count" aria-live="polite">
              {String(
                projects.filter(
                  (p) => category === "All work" || p.category === category,
                ).length,
              ).padStart(2, "0")}{" "}
              PROJECTS
            </span>
          </div>
          <div className="projects-grid">
            {projects
              .filter((p) => category === "All work" || p.category === category)
              .map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={() => setProject(p)}
                />
              ))}
          </div>
          <div className="work-footnote">
            <span>
              Every project starts with a question. The source tells the rest.
            </span>
            <ExternalLink href={github} className="text-button">
              All repositories
            </ExternalLink>
          </div>
        </section>
        <section id="about" className="about section-shell">
          <div className="section-kicker">
            <span className="eyebrow">02 / THE PERSON BEHIND THE PROJECTS</span>
            <span className="eyebrow muted">
              HELLO, I’M ADITYA. AADI WORKS TOO.
            </span>
          </div>
          <div className="about-layout">
            <div className="about-heading">
              <h2>
                I like knowing
                <br />
                what’s{" "}
                <em>
                  under
                  <br />
                  the hood.
                </em>
              </h2>
              <div className="about-stamp">
                <span className="asterisk" aria-hidden="true">
                  ✳
                </span>
                <span className="eyebrow">
                  A LITTLE MATHS.
                  <br />A LOT OF MAKING.
                </span>
              </div>
            </div>
            <div className="about-copy">
              <p className="large-copy">
                For me, building something is the best way to understand it.
              </p>
              <p>
                I’m at BITS Pilani, Goa, working across graphics, machine
                learning, and robotics. My projects tend to start one layer
                below the obvious: the tensor library before the model, the
                renderer before the scene, the perception system before the
                robot.
              </p>
              <p>
                Before GPUs, it was sensors and servos. Line-following robots, a
                solar panel that chased the light, Arduino experiments, and a
                drone. The tools have changed. The curiosity hasn’t.
              </p>
              <div className="about-details">
                <div>
                  <span className="eyebrow">WHERE I’M LEARNING</span>
                  <strong>BITS Pilani, Goa</strong>
                </div>
                <div>
                  <span className="eyebrow">HOW I LIKE TO BUILD</span>
                  <strong>From first principles</strong>
                </div>
              </div>
              <div className="toolbox">
                <span className="eyebrow">TOOLS I REACH FOR</span>
                <div>
                  {[
                    "C++",
                    "Objective-C++",
                    "Metal",
                    "MLX",
                    "Python",
                    "Swift",
                    "ARKit",
                    "CMake",
                  ].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="journey">
            <div>
              <span className="journey-number">01</span>
              <span className="eyebrow">SENSORS & SERVOS</span>
              <h3>The physical world.</h3>
              <p>
                Robots, circuits, and learning what happens when a build leaves
                the workbench.
              </p>
            </div>
            <div>
              <span className="journey-number">02</span>
              <span className="eyebrow">PIXELS & PARALLELISM</span>
              <h3>Under the surface.</h3>
              <p>
                Metal, native apps, and a graphics engine with a tensor library
                at its heart.
              </p>
            </div>
            <div>
              <span className="journey-number">03</span>
              <span className="eyebrow">MODELS & MACHINES</span>
              <h3>Connecting the dots.</h3>
              <p>
                Computer vision, depth, and perception systems that make sense
                of the world.
              </p>
            </div>
          </div>
        </section>
        <Playground />
        <section
          className="workshop section-shell"
          aria-labelledby="workshop-title"
        >
          <div className="section-kicker">
            <span className="eyebrow">04 / STILL EXPLORING</span>
            <span className="eyebrow muted">THERE’S ALWAYS ANOTHER IDEA.</span>
          </div>
          <div className="section-title-row">
            <h2 id="workshop-title">
              Elsewhere in
              <br />
              the <em>workshop.</em>
            </h2>
            <p>
              Tools, side quests, and the ideas
              <br />
              that don’t stay in a notebook.
            </p>
          </div>
          <div className="repository-list">
            {moreProjects.map((p, i) => (
              <a
                key={p.name}
                href={`${github}/${p.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="repository-row"
              >
                <span className="eyebrow repo-index">0{i + 1}</span>
                <div>
                  <h3>{p.name}</h3>
                  <span className="eyebrow muted">{p.type}</span>
                </div>
                <p>{p.text}</p>
                <Arrow diagonal />
              </a>
            ))}
          </div>
          <div className="experiment-list">
            {experiments.map((p) => (
              <article key={p.name}>
                <span className="eyebrow muted">{p.type}</span>
                <h3>{p.name}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          className="archive section-shell"
          aria-labelledby="archive-title"
        >
          <div className="archive-heading">
            <span className="eyebrow">THE LONGER STORY</span>
            <h2 id="archive-title">More from the workbench.</h2>
          </div>
          <div>
            {archive.map((item) => (
              <details key={item.name}>
                <summary>
                  <span>{item.name}</span>
                  <span className="eyebrow muted">{item.category}</span>
                  <span className="archive-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{item.description}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="contact" className="contact section-shell">
          <div className="section-kicker">
            <span className="eyebrow">
              <span className="status-dot" /> GOOD THINGS START WITH A
              CONVERSATION.
            </span>
            <span className="eyebrow">05 / SAY HELLO</span>
          </div>
          <div className="contact-main">
            <h2>
              Have something
              <br />
              in <em>mind?</em>
              <span className="orange">↗</span>
            </h2>
            <div>
              <p>
                A curious problem. An interesting project.
                <br />
                Or just a shared love of building things.
              </p>
              <ExternalLink href={github} className="button dark-button">
                Find me on GitHub
              </ExternalLink>
            </div>
          </div>
          <div className="contact-signature">
            <Mark />
            <span>Let’s make something worth understanding.</span>
          </div>
        </section>
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} Aditya Dudeja</span>
        <span>Made with intent. Built with curiosity. <a href="/legacy_index.html" className="legacy-link">Legacy site ↗</a></span>
        <a href="#" className="text-button">
          Back to top ↑
        </a>
      </footer>
      <ProjectDialog project={project} onClose={() => setProject(null)} />
    </>
  );
}
