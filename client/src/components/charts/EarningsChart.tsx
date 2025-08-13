import { useEffect, useRef } from "react";

interface EarningsChartProps {
  data: Array<{ date: string; earnings: number }>;
  height?: number;
}

export default function EarningsChart({ data, height = 300 }: EarningsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const chartWidth = canvas.offsetWidth - 60;
    const chartHeight = height - 60;
    const chartX = 30;
    const chartY = 30;

    // Find max value for scaling
    const maxEarnings = Math.max(...data.map(d => d.earnings));
    const minEarnings = Math.min(...data.map(d => d.earnings));
    const range = maxEarnings - minEarnings || 1;

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = chartY + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= data.length - 1; i++) {
      const x = chartX + (chartWidth / (data.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, chartY);
      ctx.lineTo(x, chartY + chartHeight);
      ctx.stroke();
    }

    // Draw the line
    if (data.length > 1) {
      const gradient = ctx.createLinearGradient(0, 0, chartWidth, 0);
      gradient.addColorStop(0, "#6b46c1");
      gradient.addColorStop(0.5, "#8b5cf6");
      gradient.addColorStop(1, "#3b82f6");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();

      data.forEach((point, index) => {
        const x = chartX + (chartWidth / (data.length - 1)) * index;
        const y = chartY + chartHeight - ((point.earnings - minEarnings) / range) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw area under the curve
      ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
      ctx.lineTo(chartX, chartY + chartHeight);
      ctx.closePath();

      const areaGradient = ctx.createLinearGradient(0, chartY, 0, chartY + chartHeight);
      areaGradient.addColorStop(0, "rgba(107, 70, 193, 0.3)");
      areaGradient.addColorStop(1, "rgba(107, 70, 193, 0.05)");
      ctx.fillStyle = areaGradient;
      ctx.fill();

      // Draw data points
      ctx.fillStyle = "#fbbf24";
      data.forEach((point, index) => {
        const x = chartX + (chartWidth / (data.length - 1)) * index;
        const y = chartY + chartHeight - ((point.earnings - minEarnings) / range) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw labels
    ctx.fillStyle = "#9ca3af";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = minEarnings + (range / 5) * (5 - i);
      const y = chartY + (chartHeight / 5) * i;
      ctx.textAlign = "right";
      ctx.fillText(`$${value.toFixed(2)}`, chartX - 10, y + 4);
    }

    // X-axis labels
    ctx.textAlign = "center";
    data.forEach((point, index) => {
      if (index % Math.ceil(data.length / 6) === 0) {
        const x = chartX + (chartWidth / (data.length - 1)) * index;
        const date = new Date(point.date);
        ctx.fillText(
          date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          x,
          chartY + chartHeight + 20
        );
      }
    });

  }, [data, height]);

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: `${height}px` }}
      />
    </div>
  );
}
