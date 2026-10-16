export function generarCodigoCanje(): string {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const partes: string[] = [];
  for (let i = 0; i < 2; i++) {
    let parte = "";
    for (let j = 0; j < 3; j++) {
      parte += alfabeto[Math.floor(Math.random() * alfabeto.length)];
    }
    partes.push(parte);
  }
  return `GB-${partes.join("-")}`;
}