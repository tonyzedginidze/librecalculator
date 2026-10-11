import type { ReactNode } from "react";

/** 24x24 stroke icons for cooking operations; one distinct drawing per operation. */
export const cookingOperationPaths: Record<string, ReactNode> = {
  // Recipe scaling: a bowl, modified by what the question does to it.
  "recipe-scale": (
    <>
      <path d="M3 15h6a3 3 0 0 1-6 0z" />
      <path d="M11 12h10a5 5 0 0 1-10 0z" />
      <path d="M5 11c0-3.5 3-5.5 7.5-5.5M10.5 3.5l2 2-2 2" />
    </>
  ),
  "recipe-factor": (
    <>
      <path d="M4 13h16a8 6.5 0 0 1-16 0z" />
      <path d="M9.5 4.5l5 5M14.5 4.5l-5 5" />
    </>
  ),
  "recipe-reverse": (
    <>
      <path d="M4 13h16a8 6.5 0 0 1-16 0z" />
      <path d="M17 8H8M10.5 5.5L8 8l2.5 2.5" />
    </>
  ),
  // Cups and grams: the measuring cup, the kitchen scale, and a half-filled cup.
  "cups-to-grams": (
    <>
      <path d="M4.5 13h15l1 7.5h-17z" />
      <circle cx="12" cy="17" r="1.5" />
      <path d="M7 10h10M12 10v3" />
      <path d="M8.5 4h7l-1 6h-5z" />
    </>
  ),
  "grams-to-cups": (
    <>
      <path d="M4.5 5h11l-1.5 15h-8z" />
      <path d="M15.5 8.5h2a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-2.5" />
      <path d="M7 9h3M7 12.5h3M7 16h3" />
    </>
  ),
  "half-cup-grams": (
    <>
      <path d="M4.5 5h11l-1.5 15h-8z" />
      <path d="M15.5 8.5h2a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-2.5" />
      <path d="M5.4 12.5h9.2M7.5 16h5M8.5 19h3" />
    </>
  ),
  // Oven: a thermometer with the conversion direction, and a fan.
  "celsius-to-fahrenheit": (
    <>
      <path d="M6 14.5V5a2 2 0 0 1 4 0v9.5a3.5 3.5 0 1 1-4 0z" />
      <path d="M8 11v5" />
      <path d="M13 7h8M18.5 4.5L21 7l-2.5 2.5" />
    </>
  ),
  "fahrenheit-to-celsius": (
    <>
      <path d="M14 14.5V5a2 2 0 0 1 4 0v9.5a3.5 3.5 0 1 1-4 0z" />
      <path d="M16 11v5" />
      <path d="M11 7H3M5.5 4.5L3 7l2.5 2.5" />
    </>
  ),
  "fan-adjustment": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="1.25" />
      <path d="M12 10.5c-1.5-2-1-4.5 1.5-5 1.5 1.5.5 3.5-1.5 5z" />
      <path d="M13.3 12.75c2.5.3 4 2.4 2.7 4.5-2 .5-3.2-1.4-2.7-4.5z" />
      <path d="M10.7 12.75c-1 2.3-3.5 3.2-5 1.4.6-2 2.9-2.1 5-1.4z" />
    </>
  ),
  // Baker's percentage: ratio bars, a water drop, and a flour sack.
  "baker-percent": (
    <>
      <path d="M3 20.5h18" />
      <rect x="5" y="4" width="5" height="16.5" rx="1" />
      <rect x="14" y="10" width="5" height="10.5" rx="1" />
    </>
  ),
  "ingredient-mass": (
    <path d="M12 3.5c3 4 5.5 7 5.5 10.5a5.5 5.5 0 0 1-11 0C6.5 10.5 9 7.5 12 3.5zM9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  ),
  "flour-mass": (
    <>
      <path d="M7 7.5h10l2 12.5H5z" />
      <path d="M8.5 7.5L8 4h8l-.5 3.5" />
      <path d="M12 11v6.5M12 13.5l-2-1.5M12 13.5l2-1.5M12 16.5l-2-1.5M12 16.5l2-1.5" />
    </>
  ),
  // Calories: a plate with one slice, a flame for the total, and a weight.
  "portion-calories": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 12V6a6 6 0 0 1 6 6z" />
    </>
  ),
  "recipe-calories": (
    <path d="M12 3c.5 3 5 5 5 10.5a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 2 1.2 3 2.5 3.2C12 9 11 6 12 3z" />
  ),
  "portion-weight": (
    <>
      <path d="M6.5 9h11l2.5 11H4z" />
      <path d="M9.5 9a2.5 2.5 0 1 1 5 0" />
      <path d="M10 14.5h4" />
    </>
  ),
};
