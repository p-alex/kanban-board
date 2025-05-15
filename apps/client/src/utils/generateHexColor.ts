function generateHexColor() {
  const chars = "0123456789abcdef";

  let result = "#";

  for (let i = 0; i < 6; i++) {
    const rng = Math.floor(Math.random() * chars.length);

    result += chars[rng];
  }

  return result;
}

export type GenerateHexColor = typeof generateHexColor;

export default generateHexColor;
