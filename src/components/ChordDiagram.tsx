interface ChordDiagramProps {
  name: string;
  frets: number[]; // Ex: [-1, 3, 2, 0, 1, 0]
  barres?: number[]; // Lista de casas onde tem pestana. Ex: [1]
}

export function ChordDiagram({ name, frets, barres = [] }: ChordDiagramProps) {
  const width = 80;
  const height = 100;
  const numFrets = 5;
  const stringSpacing = 12;
  const fretSpacing = 16;
  const xStart = 10;
  const yStart = 20;

  return (
    <div className="flex flex-col items-center bg-white p-2 rounded shadow-sm border border-zinc-200">
      <span className="font-bold text-lg text-zinc-900 mb-1">{name}</span>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        
        {/* 1. Cordas */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line 
            key={`str-${i}`}
            x1={xStart + i * stringSpacing} y1={yStart}
            x2={xStart + i * stringSpacing} y2={yStart + (numFrets * fretSpacing)}
            stroke="#999" strokeWidth="1"
          />
        ))}

        {/* 2. Trastes */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <line 
            key={`fret-${i}`}
            x1={xStart} y1={yStart + i * fretSpacing}
            x2={xStart + 5 * stringSpacing} y2={yStart + i * fretSpacing}
            stroke="#333" strokeWidth={i === 0 ? "2" : "1"}
          />
        ))}

        {/* 3. Pestana (Barres) - NOVO */}
        {barres && barres.map(barreFret => (
           <rect
             key={`barre-${barreFret}`}
             x={xStart}
             y={yStart + (barreFret * fretSpacing) - (fretSpacing / 1.5)}
             width={5 * stringSpacing}
             height={8}
             rx={4}
             fill="#2563eb"
             opacity={0.8}
           />
        ))}

        {/* 4. Dedos */}
        {frets.map((fret, stringIndex) => {
          if (fret <= 0) return null;
          return (
            <circle
              key={`dot-${stringIndex}`}
              cx={xStart + stringIndex * stringSpacing}
              cy={yStart + (fret * fretSpacing) - (fretSpacing / 2)}
              r="3.5"
              fill="#2563eb"
            />
          )
        })}

        {/* 5. X ou O no topo */}
        {frets.map((fret, stringIndex) => {
          if (fret > 0) return null;
          return (
            <text
              key={`indicator-${stringIndex}`}
              x={xStart + stringIndex * stringSpacing}
              y={yStart - 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={fret === -1 ? "#ef4444" : "#666"}
            >
              {fret === -1 ? "×" : "○"}
            </text>
          )
        })}
      </svg>
    </div>
  )
}