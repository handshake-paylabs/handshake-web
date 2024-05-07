import { generateSVG } from "@/app/utils/gradients";

export default async function handler(req, res) {
  const { value } = req.query;

  if (!value || typeof value !== "string") {
    return res.status(400).json({ error: "Invalid request" });
  }

  let svg = "";
  try {
    svg = generateSVG(value);
  } catch (e) {
    svg = generateSVG("asdf");
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
