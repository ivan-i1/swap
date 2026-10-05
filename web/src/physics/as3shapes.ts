// Box2D AS3 2.1a shape maths that planck.js does not have or computes differently.
import { Transform, Vec2, type CircleShape, type PolygonShape, type Shape } from 'planck';

const MIN_VALUE = Number.MIN_VALUE;

// b2PolygonShape / b2CircleShape .ComputeSubmergedArea: area of the shape on the far side of the plane
// dot(normal, p) = offset, writing the submerged centroid (world space) into `c`.
export function computeSubmergedArea(shape: Shape, normal: Vec2, offset: number, xf: Transform, c: Vec2): number {
  if (shape.getType() === 'circle') return circleSubmergedArea(shape as CircleShape, normal, offset, xf, c);
  if (shape.getType() === 'polygon') return polygonSubmergedArea((shape as PolygonShape).m_vertices, normal, offset, xf, c);
  return 0;
}

function circleSubmergedArea(shape: CircleShape, normal: Vec2, offset: number, xf: Transform, c: Vec2): number {
  const p = Transform.mulVec2(xf, shape.m_p);
  const r = shape.m_radius;
  const l = -(Vec2.dot(normal, p) - offset);
  if (l < -r + MIN_VALUE) return 0;
  if (l > r) {
    c.set(p);
    return Math.PI * r * r;
  }
  const r2 = r * r;
  const l2 = l * l;
  const area = r2 * (Math.asin(l / r) + Math.PI / 2) + l * Math.sqrt(r2 - l2);
  const com = ((-2 / 3) * Math.pow(r2 - l2, 1.5)) / area;
  c.x = p.x + normal.x * com;
  c.y = p.y + normal.y * com;
  return area;
}

function polygonSubmergedArea(vertices: Vec2[], normal: Vec2, offset: number, xf: Transform, c: Vec2): number {
  const n = vertices.length;
  const normalL = Rot.mulT(xf.q, normal);
  const offsetL = offset - Vec2.dot(normal, xf.p);

  const depths: number[] = [];
  let diveCount = 0;
  let intoIndex = -1;
  let outoIndex = -1;
  let lastSubmerged = false;
  for (let i = 0; i < n; i++) {
    depths[i] = Vec2.dot(normalL, vertices[i]) - offsetL;
    const isSubmerged = depths[i] < -MIN_VALUE;
    if (i > 0) {
      if (isSubmerged) {
        if (!lastSubmerged) {
          intoIndex = i - 1;
          diveCount++;
        }
      } else if (lastSubmerged) {
        outoIndex = i - 1;
        diveCount++;
      }
    }
    lastSubmerged = isSubmerged;
  }

  switch (diveCount) {
    case 0:
      if (lastSubmerged) {
        const md = polygonMass(vertices, 1);
        c.set(Transform.mulVec2(xf, md.center));
        return md.mass;
      }
      return 0;
    case 1:
      if (intoIndex === -1) intoIndex = n - 1;
      else outoIndex = n - 1;
      break;
  }

  const intoIndex2 = (intoIndex + 1) % n;
  const outoIndex2 = (outoIndex + 1) % n;
  const intoLambda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
  const outoLambda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
  const intoVec = Vec2(
    vertices[intoIndex].x * (1 - intoLambda) + vertices[intoIndex2].x * intoLambda,
    vertices[intoIndex].y * (1 - intoLambda) + vertices[intoIndex2].y * intoLambda,
  );
  const outoVec = Vec2(
    vertices[outoIndex].x * (1 - outoLambda) + vertices[outoIndex2].x * outoLambda,
    vertices[outoIndex].y * (1 - outoLambda) + vertices[outoIndex2].y * outoLambda,
  );

  let area = 0;
  const center = Vec2();
  let p2 = vertices[intoIndex2];
  let i = intoIndex2;
  while (i !== outoIndex2) {
    i = (i + 1) % n;
    const p3 = i === outoIndex2 ? outoVec : vertices[i];
    const triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
    area += triangleArea;
    center.x += (triangleArea * (intoVec.x + p2.x + p3.x)) / 3;
    center.y += (triangleArea * (intoVec.y + p2.y + p3.y)) / 3;
    p2 = p3;
  }
  center.mul(1 / area);
  c.set(Transform.mulVec2(xf, center));
  return area;
}

// Minimal Rot.mulT without importing planck's Rot class shape.
const Rot = {
  mulT(q: { c: number; s: number }, v: Vec2): Vec2 {
    return Vec2(q.c * v.x + q.s * v.y, -q.s * v.x + q.c * v.y);
  },
};

// b2PolygonShape.ComputeMass for the vertices in the order given: area is signed, so clockwise
// polygons (which AS3's SetAsArray accepts without reordering) contribute negative mass.
function polygonMass(vertices: Vec2[], density: number): { mass: number; center: Vec2 } {
  let area = 0;
  const center = Vec2();
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const p2 = vertices[i];
    const p3 = vertices[(i + 1) % n];
    const D = p2.x * p3.y - p2.y * p3.x;
    const triangleArea = 0.5 * D;
    area += triangleArea;
    center.x += (triangleArea * (p2.x + p3.x)) / 3;
    center.y += (triangleArea * (p2.y + p3.y)) / 3;
  }
  center.mul(1 / area);
  return { mass: density * area, center };
}

export type As3FixtureMass =
  | { vertices: Vec2[]; density: number }
  | { radius: number; center: Vec2; density: number };

// b2Body.ResetMassData over fixtures as AS3 Box2D 2.1a would compute them (rotation is fixed, so I = 0).
export function as3MassData(fixtures: As3FixtureMass[]): { mass: number; center: Vec2; I: number } {
  let mass = 0;
  const center = Vec2();
  for (const f of fixtures) {
    if (f.density === 0) continue;
    const md = 'vertices' in f
      ? polygonMass(f.vertices, f.density)
      : { mass: f.density * Math.PI * f.radius * f.radius, center: f.center };
    mass += md.mass;
    center.x += md.mass * md.center.x;
    center.y += md.mass * md.center.y;
  }
  if (mass > 0) center.mul(1 / mass);
  else mass = 1;
  return { mass, center, I: 0 };
}
