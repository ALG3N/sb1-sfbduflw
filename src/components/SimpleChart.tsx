import React from 'react';

interface SimpleChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  type: 'bar' | 'line' | 'area';
  title: string;
  height?: number;
}

export function SimpleChart({ data, type, title, height = 200 }: SimpleChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * (height - 40);
  };

  const getLinePoints = () => {
    const width = 100 / data.length;
    return data.map((item, index) => {
      const x = (index + 0.5) * width;
      const y = height - 20 - getBarHeight(item.value);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="relative">
        <svg width="100%" height={height} className="overflow-visible">
          {type === 'bar' && data.map((item, index) => {
            const barWidth = (100 / data.length) * 0.8;
            const x = (index * (100 / data.length)) + ((100 / data.length) * 0.1);
            const barHeight = getBarHeight(item.value);
            
            return (
              <g key={index}>
                <rect
                  x={`${x}%`}
                  y={height - 20 - barHeight}
                  width={`${barWidth}%`}
                  height={barHeight}
                  fill={item.color || '#3B82F6'}
                  className="hover:opacity-80 transition-opacity"
                  rx="2"
                />
                <text
                  x={`${x + barWidth/2}%`}
                  y={height - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
          
          {type === 'line' && (
            <>
              <polyline
                points={getLinePoints()}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              {data.map((item, index) => {
                const width = 100 / data.length;
                const x = (index + 0.5) * width;
                const y = height - 20 - getBarHeight(item.value);
                
                return (
                  <g key={index}>
                    <circle
                      cx={`${x}%`}
                      cy={y}
                      r="4"
                      fill="#3B82F6"
                      className="drop-shadow-sm"
                    />
                    <text
                      x={`${x}%`}
                      y={height - 5}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </>
          )}
          
          {type === 'area' && (
            <>
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
                </linearGradient>
              </defs>
              <polygon
                points={`0,${height-20} ${getLinePoints()} ${100},${height-20}`}
                fill="url(#areaGradient)"
              />
              <polyline
                points={getLinePoints()}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              {data.map((item, index) => {
                const width = 100 / data.length;
                const x = (index + 0.5) * width;
                
                return (
                  <text
                    key={index}
                    x={`${x}%`}
                    y={height - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {item.label}
                  </text>
                );
              })}
            </>
          )}
        </svg>
      </div>
    </div>
  );
}