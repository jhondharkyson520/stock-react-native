export function formatToCurrencyInput(value: string): {display: string; raw: string;} {
  const numeric = value.replace(/\D/g, "");

  if (numeric.length === 0) return { display: "", raw: "0" };
  const float = parseFloat(numeric) / 100;
  const display = float.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const raw = float.toFixed(2);

  return { display, raw };
}
