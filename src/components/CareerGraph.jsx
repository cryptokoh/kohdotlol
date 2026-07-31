import './CareerGraph.css'

const milestones = [
  { year: '2002', label: 'Support', x: 10, y: 78 },
  { year: '2009', label: 'Repair', x: 31, y: 58 },
  { year: '2019', label: 'KohX', x: 60, y: 34 },
  { year: '2024', label: 'Independent', x: 79, y: 19 },
  { year: 'Now', label: 'Building', x: 92, y: 12 },
]

export default function CareerGraph({ compact = false }) {
  return (
    <figure className={`career-graph ${compact ? 'career-graph--compact' : ''}`}>
      <div className="career-graph__heading">
        <span>Practice over time</span>
        <span>2002 — now</span>
      </div>
      <svg viewBox="0 0 100 100" role="img" aria-labelledby="career-graph-title career-graph-desc" preserveAspectRatio="none">
        <title id="career-graph-title">A career trajectory from support to independent building</title>
        <desc id="career-graph-desc">A steadily rising line connects support, repair, KohX, independent work, and current building.</desc>
        <g className="career-graph__grid" aria-hidden="true">
          <line x1="0" y1="80" x2="100" y2="80" />
          <line x1="0" y1="55" x2="100" y2="55" />
          <line x1="0" y1="30" x2="100" y2="30" />
        </g>
        <path className="career-graph__area" d="M 10 78 C 19 75, 24 66, 31 58 S 50 41, 60 34 S 70 24, 79 19 S 87 13, 92 12 L 92 100 L 10 100 Z" />
        <path className="career-graph__line" d="M 10 78 C 19 75, 24 66, 31 58 S 50 41, 60 34 S 70 24, 79 19 S 87 13, 92 12" />
        {milestones.map((point) => <circle key={point.label} className="career-graph__point" cx={point.x} cy={point.y} r="1.7" />)}
      </svg>
      <div className="career-graph__labels" aria-hidden="true">
        {milestones.map((point) => <div key={point.label} style={{ left: `${point.x}%`, top: `${point.y}%` }}><b>{point.year}</b><span>{point.label}</span></div>)}
      </div>
    </figure>
  )
}
