import React from "react";
import Shrimpsaumon from "./Product/Salmon.png";
import Dorade from "./Product/dorade.png";
import Thon from "./thon.png";
import Crevettes from "./crevettes.png";
import Moules from "./moules.png";
import Calamars from "./calamars.png";
const Products = [
  {
    id: 1,
    name: "Fresh Italian Salmon",
    image: Shrimpsaumon,
    weight: 150,
    price: 25,
    description: "Premium quality salmon from Italy, caught this morning.",
  },
  {
    id: 2,
    name: "Italian Royal Sea Bream",
    image: Dorade,
    weight: 150,
    price: 25,
    description:
      "Fresh sea bream from Italy, perfect for grilling in the oven.",
  },
  {
    id: 3,
    name: "Italian Red Tuna",
    image: Thon,
    weight: 150,
    price: 25,
    description:
      "Fresh red tuna from Italian waters, ideal for sashimi and tartare.",
  },
  {
    id: 4,
    name: "Italian Shrimps",
    image: Crevettes,
    weight: 150,
    price: 25,
    description: "Fresh shrimps from Italy, delicious sautéed with garlic.",
  },
  {
    id: 5,
    name: "Italian Mussels",
    image: Moules,
    weight: 150,
    price: 25,
    description: "Fresh mussels from the Mediterranean coast of Italy.",
  },
  {
    id: 6,
    name: "Italian Squid",
    image: Calamars,
    weight: 150,
    price: 25,
    description: "Tender squid from Italy, perfect for frying or grilling.",
  },
];

export default Products;
