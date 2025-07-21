function generateSlug(text: string) {
  return text.toLowerCase().replace(/ /g, "-");
}

export type GenerateSlug = typeof generateSlug;

export default generateSlug;
