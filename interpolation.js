// https://apoorvaj.io/cubic-bezier-through-four-points/

// SVG generation

export function getSVGPath(points, alpha) {
  if (!points.length) return "";

  const pathStart = `M ${points[0].x},${points[0].y}`;

  if (points.length < 2) return pathStart;
  if (points.length < 3) return `${pathStart} L ${points[1].x}, ${points[1].y}`;

  const bezierCommands = [
    makeBezierCommand(
      points[0],
      getControllPoint(points[0], points[1], points[2], alpha, true),
      points[1]
    ),
  ];

  for (let i = 2; i < points.length - 1; i++) {
    let controllPoints = [
      getControllPoint(points[i - 2], points[i - 1], points[i], alpha, false),
      getControllPoint(points[i - 1], points[i], points[i + 1], alpha, true),
    ];

    bezierCommands.push(
      makeBezierCommand(controllPoints[0], controllPoints[1], points[i])
    );
  }

  bezierCommands.push(
    makeBezierCommand(
      getControllPoint(
        points[points.length - 3],
        points[points.length - 2],
        points[points.length - 1],
        alpha,
        false
      ),
      points[points.length - 1],
      points[points.length - 1]
    )
  );

  return `${pathStart} ${bezierCommands.join(" ")}`;
}

function makeBezierCommand(controllPoint1, controllPoint2, point) {
  controllPoint1 = `${controllPoint1.x},${controllPoint1.y}`;
  controllPoint2 = `${controllPoint2.x},${controllPoint2.y}`;
  point = `${point.x},${point.y}`;
  return `C ${controllPoint1} ${controllPoint2} ${point}`;
}

// Calculation

function getDistanceFromVector(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function getAdjustedDistance(distance, alpha) {
  return Math.pow(distance, alpha);
}

function getControllPoint(p0, p1, p2, alpha, isEndControllPoint) {
  if (isEndControllPoint) {
    const swapped = { p0: p2, p2: p0 };
    p0 = swapped.p0;
    p2 = swapped.p2;
  }

  const dist = [
    getAdjustedDistance(getDistanceFromVector(p1, p0), alpha),
    getAdjustedDistance(getDistanceFromVector(p2, p1), alpha),
  ];

  const a = dist[0] * dist[0];
  const b = dist[1] * dist[1];
  const c = 2 * dist[0] * dist[0] + 3 * dist[0] * dist[1] + dist[1] * dist[1];
  const d = 3 * dist[0] * (dist[0] + dist[1]);

  return {
    x: (a * p2.x - b * p0.x + c * p1.x) / d,
    y: (a * p2.y - b * p0.y + c * p1.y) / d,
  };
}
