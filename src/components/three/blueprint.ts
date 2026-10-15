import * as THREE from "three";
import type { Lang, Project } from "@/lib/types";

const W = 1024;
const H = 1408;

const PAPER = "#0c2545";
const PAPER_DARK = "#091c36";
const INK = "#dcecff";
const INK_DIM = "rgba(220, 236, 255, 0.55)";
const GRID_MINOR = "rgba(148, 197, 255, 0.10)";
const GRID_MAJOR = "rgba(148, 197, 255, 0.22)";

function drawGrid(ctx: CanvasRenderingContext2D) {
  const step = 32;
  ctx.lineWidth = 1;
  ctx.strokeStyle = GRID_MINOR;
  for (let x = 0; x <= W; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }
  ctx.strokeStyle = GRID_MAJOR;
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= W; x += step * 4) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += step * 4) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
    ctx.stroke();
  }
}

function drawFrame(ctx: CanvasRenderingContext2D) {
  const m = 40;
  ctx.strokeStyle = INK_DIM;
  ctx.lineWidth = 3;
  ctx.strokeRect(m, m, W - m * 2, H - m * 2);
  ctx.lineWidth = 1;
  ctx.strokeRect(m + 10, m + 10, W - (m + 10) * 2, H - (m + 10) * 2);

  const c = 56;
  ctx.lineWidth = 3;
  const corners: [number, number, number, number][] = [
    [m, m, 1, 1],
    [W - m, m, -1, 1],
    [m, H - m, 1, -1],
    [W - m, H - m, -1, -1],
  ];
  for (const [x, y, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(x + sx * c, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * c);
    ctx.stroke();
  }
}

function drawCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, r = 18) {
  ctx.strokeStyle = INK_DIM;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r * 1.6, y);
  ctx.lineTo(x + r * 1.6, y);
  ctx.moveTo(x, y - r * 1.6);
  ctx.lineTo(x, y + r * 1.6);
  ctx.stroke();
}

function drawDimensionLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y: number,
  x2: number
) {
  ctx.strokeStyle = INK_DIM;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  for (const x of [x1, x2]) {
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 8);
    ctx.stroke();
  }
  const mx = (x1 + x2) / 2;
  ctx.fillStyle = INK_DIM;
  ctx.beginPath();
  ctx.moveTo(mx, y - 6);
  ctx.lineTo(mx - 6, y - 16);
  ctx.lineTo(mx + 6, y - 16);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(mx, y + 6);
  ctx.lineTo(mx - 6, y + 16);
  ctx.lineTo(mx + 6, y + 16);
  ctx.closePath();
  ctx.fill();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function createBlueprintTexture(
  project: Project,
  index: number,
  total: number,
  lang: Lang
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, PAPER);
  grad.addColorStop(1, PAPER_DARK);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  drawGrid(ctx);
  drawFrame(ctx);

  ctx.textBaseline = "top";

  ctx.fillStyle = INK_DIM;
  ctx.font = "600 30px monospace";
  ctx.fillText("PROJECT BLUEPRINT", 96, 96);

  ctx.font = "700 44px monospace";
  ctx.textAlign = "right";
  ctx.fillText(
    `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
    W - 96,
    92
  );
  ctx.textAlign = "left";

  drawDimensionLine(ctx, 96, 196, W - 96);

  ctx.fillStyle = INK;
  ctx.font = "700 84px sans-serif";
  const title = project.title[lang];
  const titleLines =
    title.length > 14 ? wrapText(ctx, title, W - 220).slice(0, 3) : [title];
  let y = 250;
  for (const line of titleLines) {
    ctx.fillText(line, 96, y);
    y += 100;
  }

  y += 24;
  ctx.font = "400 38px sans-serif";
  ctx.fillStyle = INK_DIM;
  for (const line of wrapText(ctx, project.description[lang], W - 220).slice(0, 5)) {
    ctx.fillText(line, 96, y);
    y += 54;
  }

  const tagY = Math.min(y + 40, H - 420);
  let tagX = 96;
  ctx.font = "600 28px monospace";
  for (const tag of project.tags) {
    const tw = ctx.measureText(tag).width + 40;
    if (tagX + tw > W - 96) break;
    ctx.strokeStyle = INK_DIM;
    ctx.lineWidth = 2;
    ctx.strokeRect(tagX, tagY, tw, 52);
    ctx.fillStyle = INK;
    ctx.fillText(tag, tagX + 20, tagY + 10);
    tagX += tw + 18;
  }

  drawCrosshair(ctx, 140, H - 260);
  drawCrosshair(ctx, W - 140, H - 260);
  ctx.strokeStyle = GRID_MAJOR;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(140, H - 260);
  ctx.lineTo(W - 140, H - 260);
  ctx.stroke();

  ctx.strokeStyle = INK_DIM;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(W - 150, H - 190);
  ctx.lineTo(W - 110, H - 190);
  ctx.lineTo(W - 110, H - 150);
  ctx.moveTo(W - 150, H - 150);
  ctx.lineTo(W - 110, H - 190);
  ctx.stroke();
  ctx.fillStyle = INK_DIM;
  ctx.font = "600 26px monospace";
  ctx.fillText(lang === "id" ? "KLIK UNTUK MEMBUKA →" : "CLICK TO OPEN →", 96, H - 178);

  const tbX = 96;
  const tbY = H - 130;
  const tbW = W - 192;
  const tbH = 72;
  ctx.strokeStyle = INK_DIM;
  ctx.lineWidth = 2;
  ctx.strokeRect(tbX, tbY, tbW, tbH);
  ctx.beginPath();
  ctx.moveTo(tbX + tbW * 0.62, tbY);
  ctx.lineTo(tbX + tbW * 0.62, tbY + tbH);
  ctx.stroke();
  ctx.fillStyle = INK_DIM;
  ctx.font = "500 22px monospace";
  ctx.fillText("DRAWN BY", tbX + 16, tbY + 10);
  ctx.fillText("SHEET", tbX + tbW * 0.62 + 16, tbY + 10);
  ctx.fillStyle = INK;
  ctx.font = "600 26px monospace";
  ctx.fillText("SAPIUWU", tbX + 16, tbY + 36);
  ctx.fillText("A4 · REV.01", tbX + tbW * 0.62 + 16, tbY + 36);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
