import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatarData(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${d.getDate()} de ${meses[d.getMonth()]}, ${d.getFullYear()}`;
}

export function formatarTempo(minutos?: number): string {
  if (!minutos) return "-";
  if (minutos < 60) return `${minutos}min`;
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins === 0 ? `${horas}h` : `${horas}h ${mins}min`;
}

export function formatarPorcoes(porcoes?: number): string {
  if (!porcoes) return "-";
  return porcoes === 1 ? "1 porção" : `${porcoes} porções`;
}

export function capitalize(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function ingredientesParaTexto(ingredientes: string[]): string {
  return ingredientes.join(", ");
}

export function textoParaIngredientes(texto: string): string[] {
  return texto
    .split("\n")
    .map((linha) => linha.trim())
    .filter((linha) => linha.length > 0);
}

export function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function obterEmojiCategoria(categoria?: string): string {
  const emojis: Record<string, string> = {
    doce: "🍰",
    salgado: "🍕",
    bebida: "🥤",
    sobremesa: "🍮",
    entrada: "🥗",
    prato_principal: "🍛",
    lanche: "🥪",
  };
  return emojis[categoria?.toLowerCase() || ""] || "🍽️";
}

export function obterCorDificuldade(dificuldade?: string): string {
  const cores: Record<string, string> = {
    facil: "badge-facil",
    medio: "badge-medio",
    dificil: "badge-dificil",
  };
  return cores[dificuldade?.toLowerCase() || ""] || "badge-medio";
}
