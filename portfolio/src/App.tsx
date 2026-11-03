import { useEffect, useRef, useState } from "react";
import PointCloud from "./PointCloud";
import ThemeToggle from "./ThemeToggle";
import MatrixGraphs from "./MatrixGraphs";
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
const matchesCategory = (project: Project, category: Category) =>
  category === "All work" || project.category === category ||
  (project.additionalCategories?.includes(category) ?? false);
// Each project has a shareable URL, /work/<id>, that opens its dialog.
const projectPath = (p: Project) => `/work/${p.id}`;
function projectFromLocation() {
  const id = window.location.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];
  return projects.find((p) => p.id === id) ?? null;
}
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
const videoPosters: Record<string, string> = {
  "/media/segmentation-clip.mp4": "/media/posters/segmentation-clip.webp",
  "/media/gravity-simulation.mp4": "/media/posters/gravity-simulation.webp",
  "/media/depth-webcam.mp4": "/media/posters/depth-webcam.webp",
  "/media/handtrack-clip.mp4": "/media/posters/handtrack-clip.webp",
  "/media/hallway-real.mp4": "/media/posters/hallway-real.webp",
  "/media/hallway-depth.mp4": "/media/posters/hallway-depth.webp",
  "/media/hallway-cloud.mp4": "/media/posters/hallway-cloud.webp",
  "/media/particles-orbit.mp4": "/media/posters/particles-orbit.webp",
  "/media/particles-inside.mp4": "/media/posters/particles-inside.webp",
};
function AutoVideo({
  src,
  poster,
  label,
  className,
  controls = false,
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
  controls?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      className={className}
      controls={controls}
      muted
      loop
      playsInline
      preload="metadata"
      poster={videoPosters[src] ?? poster}
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
function ProjectIllustration({ visual }: { visual: string }) {
  if (visual === "neptune") return (
    <div className="custom-art neptune-art" aria-hidden="true">
      <svg className="neptune-scene" viewBox="0 0 600 405" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="neptune-space"><stop stopColor="#183456"/><stop offset="1" stopColor="#080f1d"/></radialGradient>
          <radialGradient id="neptune-planet" cx="30%" cy="25%"><stop stopColor="#a5e1dd"/><stop offset=".42" stopColor="#518ba8"/><stop offset="1" stopColor="#182d54"/></radialGradient>
          <linearGradient id="neptune-panel" x2="1" y2="1"><stop stopColor="#162a41" stopOpacity=".95"/><stop offset="1" stopColor="#0b1728" stopOpacity=".94"/></linearGradient>
          <clipPath id="neptune-disc"><circle cx="402" cy="176" r="98"/></clipPath>
        </defs>
        <rect width="600" height="405" fill="url(#neptune-space)"/>
        <g fill="#b5d9e7" opacity=".7"><circle cx="63" cy="70" r="1"/><circle cx="156" cy="50" r="1.3"/><circle cx="254" cy="89" r="1"/><circle cx="538" cy="64" r="1.2"/><circle cx="507" cy="290" r="1"/><circle cx="88" cy="320" r="1"/><circle cx="350" cy="345" r="1.2"/><circle cx="560" cy="190" r=".8"/></g>
        <ellipse cx="402" cy="176" rx="167" ry="42" transform="rotate(-20 402 176)" fill="none" stroke="#80c8df" strokeOpacity=".24" strokeWidth="13"/>
        <circle cx="402" cy="176" r="98" fill="url(#neptune-planet)"/>
        <g clipPath="url(#neptune-disc)" fill="none" stroke="#b0e4e7" strokeOpacity=".2" strokeWidth="2"><path d="M285 130c63 15 131-23 234-15M280 159c83 19 137-20 247-15M285 191c70 12 138-15 232-7M291 219c70 13 127-5 222 1"/><path d="M374 78c-40 58-41 137 8 196M417 78c-21 69-12 141 22 193" strokeOpacity=".12"/></g>
        <ellipse cx="402" cy="176" rx="167" ry="42" transform="rotate(-20 402 176)" fill="none" stroke="#9fd9e8" strokeOpacity=".55" strokeWidth="1"/>
        <circle cx="551" cy="113" r="3" fill="#f3a78b"/><circle cx="551" cy="113" r="7" fill="none" stroke="#f3a78b" strokeOpacity=".5"/>
        <g transform="translate(49 158)">
          <rect width="288" height="174" rx="3" fill="url(#neptune-panel)" stroke="#83b6c5" strokeOpacity=".45"/>
          <path d="M0 29h288" stroke="#83b6c5" strokeOpacity=".3"/>
          <circle cx="15" cy="15" r="2" fill="#f3a78b"/><circle cx="24" cy="15" r="2" fill="#83b6c5"/><circle cx="33" cy="15" r="2" fill="#83b6c5"/>
          <text x="49" y="18" className="neptune-ui-label">NEPTUNE / KERNEL SESSION</text>
          <text x="17" y="60" className="neptune-ui-code"><tspan fill="#eab299">01</tspan><tspan fill="#8bc7df">  auto</tspan><tspan fill="#dbe9e7"> scene = create();</tspan></text>
          <path d="M16 76h256" stroke="#83b6c5" strokeOpacity=".16"/>
          <text x="17" y="103" className="neptune-ui-code"><tspan fill="#eab299">02</tspan><tspan fill="#dbe9e7">  scene.</tspan><tspan fill="#8bc7df">run</tspan><tspan fill="#dbe9e7">();</tspan></text>
          <path d="M16 120h256" stroke="#83b6c5" strokeOpacity=".16"/>
          <circle cx="20" cy="145" r="3" fill="#9de0c2"/><text x="30" y="149" className="neptune-ui-label">KERNEL ONLINE / STATE PERSISTENT</text>
        </g>
        <text x="51" y="369" className="neptune-ui-label">C++ / OBJECTIVE-C++</text>
        <text x="548" y="369" textAnchor="end" className="neptune-ui-label">01 — LIVE PROCESS</text>
      </svg>
    </div>
  );
  if (visual === "quantum") return (
    <div className="custom-art quantum-art" aria-hidden="true">
      <svg viewBox="0 0 560 300" fill="none">
        <rect x="48" y="74" width="82" height="152" rx="16" stroke="currentColor" strokeWidth="2" />
        <rect x="57" y="86" width="64" height="128" rx="7" stroke="currentColor" opacity=".35" />
        <rect x="423" y="84" width="100" height="112" rx="5" stroke="currentColor" strokeWidth="2" />
        <path d="M408 212h130M473 196v16" stroke="currentColor" strokeWidth="2" />
        <path d="M140 110h55l25 22h125l25-22h44M140 150h274M140 190h55l25-22h125l25 22h44" stroke="currentColor" opacity=".4" />
        <circle cx="227" cy="132" r="4" fill="#eb8661"/><circle cx="289" cy="150" r="4" fill="#eb8661"/><circle cx="351" cy="168" r="4" fill="#eb8661"/>
        <text x="280" y="116" textAnchor="middle">DEPTH</text><text x="280" y="145" textAnchor="middle">COLOR</text><text x="280" y="185" textAnchor="middle">CAMERA</text>
      </svg>
      <span className="art-caption">IPHONE → MAC / SYNCHRONIZED FRAMES</span>
    </div>
  );
  return (
    <div className="custom-art sherlock-art" aria-hidden="true">
      <svg viewBox="0 0 560 300" fill="none">
        <path d="M280 40c-58 0-92 46-92 103 0 70 40 119 92 119s92-49 92-119c0-57-34-103-92-103Z" stroke="currentColor" opacity=".45" strokeWidth="2" />
        <path d="M219 132c14-8 29-8 43 0m36 0c14-8 29-8 43 0M280 140v38m-24 31c16 8 32 8 48 0" stroke="currentColor" opacity=".35" strokeWidth="2" strokeLinecap="round" />
        <path d="M45 166h114l18-9 15 16 15-25 18 18h30l13-9 12 9 12-27 13 47 14-29 11 9h185" stroke="#ee9879" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="280" cy="166" r="45" stroke="#ee9879" opacity=".3" strokeDasharray="3 7" />
      </svg>
      <span className="art-caption">VIDEO → COLOR → PULSE</span>
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
    <article
      className={`project project-${project.visual}${project.wide ? " project-wide" : ""}`}
    >
      <button
        className="project-open"
        onClick={onOpen}
        aria-label={`Explore ${project.tagline}`}
      >
        <div className={`project-visual ${project.visual}`}>
          {project.cardImage ? (
            <img src={project.cardImage} alt="" loading="lazy" />
          ) : project.visual === "matrix" ? (
            <MatrixDrawing />
          ) : ["neptune", "quantum", "sherlock"].includes(project.visual) ? (
            <ProjectIllustration visual={project.visual} />
          ) : project.visual === "hallway" ? (
            <>
              {/* The card reads left to right: camera, depth, point cloud. */}
              {[
                ...(project.moreVideos ?? []).map((v) => v.src),
                project.video!,
              ].map((src, i) => (
                <AutoVideo
                  key={src}
                  src={src}
                  className={`hallway-view hallway-view-${i}`}
                  label={
                    [
                      "The real hallway",
                      "The same hallway as a depth map",
                      "The hallway as a point cloud with the floor plane in green",
                    ][i] ?? "Hallway view"
                  }
                />
              ))}
            </>
          ) : (
            <AutoVideo
              src={project.video!}
              poster={project.image}
              label={`${project.tagline}, project recording`}
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
function ShareButton({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  async function share() {
    const url = window.location.origin + projectPath(project);
    // Phones get the native share sheet; desktops copy the link.
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: project.tagline, url });
      } catch {
        /* Share sheet dismissed. */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link", url);
    }
  }
  return (
    <button className="share-button" onClick={share}>
      {copied ? "Link copied" : "Share"}
      <span aria-hidden="true">{copied ? "✓" : "↗"}</span>
    </button>
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
        <div className="dialog-actions">
          <ShareButton project={project} />
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close project"
          >
            ×
          </button>
        </div>
      </div>
      {/* Wide screens put the media beside the text, so the text is never
          pushed below the fold; narrow screens and very wide media stack head,
          media, then text. */}
      <div
        className={`dialog-body${(project.video || project.imageAlt) && !project.wideMedia ? " has-media" : ""}`}
      >
        <div className="dialog-head">
          <h2 id="dialog-title">{project.tagline}</h2>
          <p className="dialog-intro">{project.description}</p>
        </div>
        {project.video && (
          <div
            className={`dialog-media${project.moreVideos ? "" : " dialog-media-single"}`}
          >
            <AutoVideo
              key={project.video}
              controls
              src={project.video}
              poster={project.image}
              label={`${project.tagline} project recording`}
            />
            {project.moreVideos && (
              <div className="dialog-more">
                {project.moreVideos.map((v) => (
                  <figure
                    className="dialog-figure"
                    key={v.src}
                    style={{ flexGrow: v.aspect ?? 1 }}
                  >
                    <AutoVideo controls src={v.src} label={v.caption} />
                    <figcaption>{v.caption}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        )}
        {!project.video && project.image && project.imageAlt && (
          <figure className="dialog-media dialog-media-single dialog-still">
            <img src={project.image} alt={project.imageAlt} />
            {project.imageCaption && (
              <figcaption>{project.imageCaption}</figcaption>
            )}
          </figure>
        )}
        <div className="dialog-text">
          <div className="project-facts">
            {project.facts.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          {project.id === "matrix" && <MatrixGraphs />}
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
  useEffect(() => {
    // Open the project named in the URL, and follow back/forward navigation.
    const sync = () => setProject(projectFromLocation());
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  useEffect(() => {
    if (!project) return;
    const oldTitle = document.title;
    document.title = `${project.tagline} — Aditya Dudeja`;
    return () => {
      document.title = oldTitle;
    };
  }, [project]);
  function openProject(p: Project) {
    window.history.pushState({ openedProject: true }, "", projectPath(p));
    setProject(p);
  }
  function closeProject() {
    // Undo our own history entry; a visitor who arrived on the link goes home.
    if (window.history.state?.openedProject) window.history.back();
    else {
      window.history.replaceState(null, "", "/");
      setProject(null);
    }
  }
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
                  {cat === "All work" && (
                    <span>{String(projects.length).padStart(2, "0")}</span>
                  )}
                </button>
              ))}
            </div>
            <span className="eyebrow project-count" aria-live="polite">
              {String(
                projects.filter(
                  (p) => matchesCategory(p, category),
                ).length,
              ).padStart(2, "0")}{" "}
              PROJECTS
            </span>
          </div>
          <div className="projects-grid">
            {projects
              .filter((p) => matchesCategory(p, category))
              .map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={() => openProject(p)}
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
        <span>
          Made with intent. Built with curiosity.{" "}
          <a href="/legacy_index.html" className="legacy-link">
            Legacy site ↗
          </a>
        </span>
        <a href="#" className="text-button">
          Back to top ↑
        </a>
      </footer>
      <ProjectDialog project={project} onClose={closeProject} />
    </>
  );
}
