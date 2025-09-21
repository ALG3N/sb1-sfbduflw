import { useState, useRef } from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: {
    change?: number;
    percentage?: number;
    details?: string;
    subMetrics?: { [key: string]: number };
  };
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'area' | 'pie';
  title: string;
  height?: number;
  showGrid?: boolean;
  animated?: boolean;
  currency?: boolean;
}

export function InteractiveChart({ 
  data, 
  type, 
  title, 
  height = 300, 
  showGrid = true, 
  animated = true,
  currency = false 
}: InteractiveChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<SVGSVGElement>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  const padding = 50;
  const chartWidth = 400;
  const chartHeight = height - padding * 2;

  const formatValue = (value: number) => {
    if (currency) {
      return new Intl.NumberFormat('sv-SE', { 
        style: 'currency', 
        currency: 'SEK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toLocaleString('sv-SE');
  };

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * chartHeight;
  };

  const getLinePoints = () => {
    const stepX = chartWidth / (data.length - 1);
    return data.map((item, index) => {
      const x = padding + (index * stepX);
      const y = padding + chartHeight - getBarHeight(item.value);
      return `${x},${y}`;
    }).join(' ');
  };

  const getPieSlices = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const centerX = chartWidth / 2 + padding;
    const centerY = height / 2;
    const radius = Math.min(chartWidth, chartHeight) / 3;

    return data.map((item, index) => {
      const sliceAngle = (item.value / total) * 360;
      const startAngle = currentAngle - 90; // Start from top
      const endAngle = startAngle + sliceAngle;
      
      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      currentAngle += sliceAngle;
      
      return {
        path: pathData,
        color: item.color || `hsl(${(index * 360) / data.length}, 65%, 55%)`,
        percentage: (item.value / total) * 100,
        centerX: centerX + (radius * 0.7) * Math.cos(((startAngle + endAngle) / 2 * Math.PI) / 180),
        centerY: centerY + (radius * 0.7) * Math.sin(((startAngle + endAngle) / 2 * Math.PI) / 180)
      };
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    
    const rect = chartRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const renderGridLines = () => {
    if (!showGrid || type === 'pie') return null;
    
    const gridLines = [];
    const steps = 5;
    
    for (let i = 0; i <= steps; i++) {
      const y = padding + (chartHeight / steps) * i;
      const value = maxValue - (range / steps) * i;
      
      gridLines.push(
        <g key={i}>
          <line
            x1={padding}
            y1={y}
            x2={padding + chartWidth}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <text
            x={padding - 10}
            y={y + 4}
            fontSize="10"
            fill="#6b7280"
            textAnchor="end"
          >
            {formatValue(value)}
          </text>
        </g>
      );
    }
    
    return gridLines;
  };

  const renderTooltip = () => {
    if (!hoveredPoint) return null;

    return (
      <div
        className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 pointer-events-none max-w-xs"
        style={{
          left: mousePosition.x + 10,
          top: mousePosition.y - 10,
          transform: mousePosition.x > 300 ? 'translateX(-100%)' : 'none'
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: hoveredPoint.color || '#3B82F6' }}
            />
            <span className="font-semibold text-gray-900">{hoveredPoint.label}</span>
          </div>
          
          <div className="text-lg font-bold text-gray-900">
            {formatValue(hoveredPoint.value)}
          </div>
          
          {hoveredPoint.metadata?.change !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${
              hoveredPoint.metadata.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {hoveredPoint.metadata.change > 0 ? 
                <TrendingUp className="h-3 w-3" /> : 
                <TrendingDown className="h-3 w-3" />
              }
              <span>
                {hoveredPoint.metadata.change > 0 ? '+' : ''}
                {hoveredPoint.metadata.change}%
              </span>
            </div>
          )}
          
          {hoveredPoint.metadata?.percentage !== undefined && (
            <div className="text-sm text-gray-600">
              {hoveredPoint.metadata.percentage.toFixed(1)}% av totalen
            </div>
          )}
          
          {hoveredPoint.metadata?.details && (
            <p className="text-xs text-gray-600">
              {hoveredPoint.metadata.details}
            </p>
          )}
          
          {hoveredPoint.metadata?.subMetrics && (
            <div className="border-t border-gray-100 pt-2 space-y-1">
              {Object.entries(hoveredPoint.metadata.subMetrics).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-gray-600">{key}:</span>
                  <span className="font-medium">{formatValue(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Info className="h-4 w-4 text-gray-400" />
      </div>
      
      <div className="relative">
        <svg
          ref={chartRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth + padding * 2} ${height}`}
          className="overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {renderGridLines()}
          
          {type === 'bar' && data.map((item, index) => {
            const barWidth = (chartWidth / data.length) * 0.6;
            const x = padding + (index * (chartWidth / data.length)) + ((chartWidth / data.length) * 0.2);
            const barHeight = getBarHeight(item.value);
            const y = padding + chartHeight - barHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.color || '#3B82F6'}
                  className="hover:opacity-80 transition-all duration-200 cursor-pointer"
                  rx="4"
                  onMouseEnter={() => setHoveredPoint(item)}
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="10"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
          
          {(type === 'line' || type === 'area') && (
            <>
              {type === 'area' && (
              <defs>  
                <linearGradient id={`areaGradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                </linearGradient>
              </defs> 
              )}
              
              {type === 'area' && (
                <polygon
                  points={`${padding},${padding + chartHeight} ${getLinePoints()} ${padding + chartWidth},${padding + chartHeight}`}
                  fill={`url(#areaGradient-${title})`}
                />
              )}
              
              <polyline
                points={getLinePoints()}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
              
              {data.map((item, index) => {
                const stepX = chartWidth / (data.length - 1);
                const x = padding + (index * stepX);
                const y = padding + chartHeight - getBarHeight(item.value);
                
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill={item.color || '#3B82F6'}
                      className="drop-shadow-sm cursor-pointer hover:r-8 transition-all"
                      onMouseEnter={() => setHoveredPoint(item)}
                    />
                    <text
                      x={x}
                      y={height - 10}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                      fontSize="10"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </>
          )}
          
          {type === 'pie' && (
            <g>
              {getPieSlices().map((slice, index) => (
                <g key={index}>
                  <path
                    d={slice.path}
                    fill={slice.color}
                    className="cursor-pointer hover:opacity-80 transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint({
                      ...data[index],
                      metadata: {
                        ...data[index].metadata,
                        percentage: slice.percentage
                      }
                    })}
                  />
                  <text
                    x={slice.centerX}
                    y={slice.centerY}
                    textAnchor="middle"
                    className="text-xs fill-white font-medium"
                    fontSize="10"
                  >
                    {slice.percentage > 5 ? `${slice.percentage.toFixed(0)}%` : ''}
                  </text>
                </g>
              ))}
            </g>
          )}
        </svg>
        
        {renderTooltip()}
      </div>
    </div>
  );
}