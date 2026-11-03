type Node = { id: string; x: number; y: number; label: string; detail?: string; leaf?: boolean };
type Edge = [string, string];

const forward: Node[] = [
  { id: "x", x: 50, y: 120, label: "x", leaf: true },
  { id: "square", x: 170, y: 50, label: "x²" },
  { id: "sin", x: 290, y: 50, label: "sin" },
  { id: "exp", x: 290, y: 190, label: "exp" },
  { id: "out", x: 440, y: 120, label: "f" },
];
const reverse: Node[] = [
  { id: "seed", x: 50, y: 120, label: "1", detail: "seed" },
  { id: "sin", x: 160, y: 50, label: "× eˣ", detail: "at sin" },
  { id: "square", x: 275, y: 50, label: "× cos x²", detail: "at x²" },
  { id: "x1", x: 390, y: 50, label: "× 2x", detail: "via x²" },
  { id: "exp", x: 160, y: 190, label: "× sin x²", detail: "at exp" },
  { id: "x2", x: 275, y: 190, label: "× eˣ", detail: "via exp" },
  { id: "sum", x: 500, y: 120, label: "+", detail: "df/dx" },
];
const forwardEdges: Edge[] = [["x", "square"], ["square", "sin"], ["sin", "out"], ["x", "exp"], ["exp", "out"]];
const reverseEdges: Edge[] = [["seed", "sin"], ["sin", "square"], ["square", "x1"], ["x1", "sum"], ["seed", "exp"], ["exp", "x2"], ["x2", "sum"]];

function Graph({ nodes, edges, gradient = false }: { nodes: Node[]; edges: Edge[]; gradient?: boolean }) {
  const marker = gradient ? "matrix-gradient-arrow" : "matrix-forward-arrow";
  return (
    <div className="matrix-graph-scroll">
      <svg className={`matrix-graph${gradient ? " is-gradient" : ""}`} viewBox={gradient ? "0 0 560 240" : "0 0 520 240"} role="img" aria-label={gradient ? "Gradient graph: a seed flows through the sine and exponential branches, then their contributions are added." : "Computation graph: x feeds a square and sine branch and an exponential branch, which multiply to produce f."}>
        <defs><marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 Z" /></marker></defs>
        {edges.map(([from, to]) => {
          const a = nodes.find((node) => node.id === from)!;
          const b = nodes.find((node) => node.id === to)!;
          const dx = b.x - a.x, dy = b.y - a.y, length = Math.hypot(dx, dy);
          const ux = dx / length, uy = dy / length;
          const clip = Math.min(Math.abs(ux) > 1e-6 ? 37 / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-6 ? 19 / Math.abs(uy) : Infinity) + 3;
          const line = { x1: a.x + ux * clip, y1: a.y + uy * clip, x2: b.x - ux * (clip + 4), y2: b.y - uy * (clip + 4) };
          return <g key={`${from}-${to}`}><line className="graph-flow" {...line} /><line className="graph-arrow" {...line} markerEnd={`url(#${marker})`} /></g>;
        })}
        {nodes.map((node) => (
          <g key={node.id} className={node.leaf ? "is-leaf" : undefined}>
            <rect x={node.x - 37} y={node.y - 19} width="74" height="38" rx="7" />
            <text x={node.x} y={node.y + (node.detail ? 0 : 5)}>{node.label}</text>
            {node.detail && <text className="graph-detail" x={node.x} y={node.y + 13}>{node.detail}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function MatrixGraphs() {
  return (
    <section className="matrix-lab" aria-labelledby="matrix-lab-title">
      <div className="matrix-lab-heading">
        <span className="eyebrow">A CLOSER LOOK / THE GRAPH</span>
        <h3 id="matrix-lab-title">From expression to gradient.</h3>
        <p>Writing an expression builds a graph. Differentiating it builds another one.</p>
      </div>
      <div className="matrix-lab-row">
        <div className="matrix-lab-code"><span>01 / THE FUNCTION · USAGE SKETCH</span><pre><code><span className="syntax-type">matrix</span>{" x = "}<span className="syntax-type">matrix</span>{"::"}<span className="syntax-function">rand</span>{"({"}<span className="syntax-number">4</span>{"});\n"}<span className="syntax-type">matrix</span>{" a = x * x;\n"}<span className="syntax-type">matrix</span>{" s = "}<span className="syntax-type">matrix</span>{"::"}<span className="syntax-function">sin</span>{"(a);\n"}<span className="syntax-type">matrix</span>{" f = s * "}<span className="syntax-type">matrix</span>{"::"}<span className="syntax-function">exp</span>{"(x);\n\nf."}<span className="syntax-function">eval</span>{"();  "}<span className="syntax-comment">// run on CPU or Metal</span></code></pre></div>
        <div className="matrix-graph-box"><span>THE GRAPH IT BUILDS</span><Graph nodes={forward} edges={forwardEdges} /><small>Each operation has a CPU and a Metal GPU path.</small></div>
      </div>
      <div className="matrix-lab-row">
        <div className="matrix-lab-code"><span>02 / ITS GRADIENT · USAGE SKETCH</span><pre><code><span className="syntax-keyword">auto</span>{" f = []("}<span className="syntax-type">matrix</span>{" x) {\n  "}<span className="syntax-keyword">return</span>{" "}<span className="syntax-type">matrix</span>{"::"}<span className="syntax-function">sin</span>{"(x * x)\n       * "}<span className="syntax-type">matrix</span>{"::"}<span className="syntax-function">exp</span>{"(x);\n};\n\n"}<span className="syntax-keyword">auto</span>{" df = "}<span className="syntax-type">matrix</span>{"::"}<span className="syntax-function">grad_gpu</span>{"(f, x);\n"}<span className="syntax-type">matrix</span>{" g = "}<span className="syntax-function">df</span>{"(x);"}</code></pre></div>
        <div className="matrix-graph-box"><span>THE GRADIENT GRAPH</span><Graph nodes={reverse} edges={reverseEdges} gradient /><small>df/dx = eˣ · (2x · cos x² + sin x²)</small></div>
      </div>
      <p className="matrix-lab-note">Reverse-mode VJP rules build the gradient graph one operation at a time. Forward-mode JVPs use the same graph machinery.</p>
    </section>
  );
}
