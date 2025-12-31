'use server';

export async function analyzeLabel(imageBase64: string) {

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    name: "Château Margaux (Demo Scan)",
    vintage: "2015",
    region: "Bordeaux, France",
    grape: "Cabernet Sauvignon",
    estimated_price: "450.00€ - 550.00€",
    food_pairing: "Beef Wellington, Truffle Risotto",
  };
}