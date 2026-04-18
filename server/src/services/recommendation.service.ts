import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getRecommendations = async (userId: string, limit?: number) => {
const profile = await prisma.userHealthProfile.findUnique({
where: { userId },
});

if (!profile) {
throw new Error("User profile not found");
}

const products = await prisma.product.findMany({
include: {
tags: {
include: {
tag: true,
},
},
},
});

const scoredProducts = products.map((product) => {
let score = 0;


const tagNames = product.tags.map((t) => t.tag.name);

// 🎯 1. Goal Matching
if (profile.goal && tagNames.includes(profile.goal)) {
  score += 4;
}

// ❌ Penalty for opposite goal
if (profile.goal === "weight_loss" && tagNames.includes("muscle_gain")) {
  score -= 2;
}

if (profile.goal === "muscle_gain" && tagNames.includes("weight_loss")) {
  score -= 2;
}

// 🎯 2. BMI-based logic
if (profile.bmiCategory === "overweight" && tagNames.includes("weight_loss")) {
  score += 3;
}

if (profile.bmiCategory === "underweight" && tagNames.includes("muscle_gain")) {
  score += 3;
}

// 🎯 3. Diet Preference
if (profile.dietPreference && tagNames.includes(profile.dietPreference)) {
  score += 1.5;
}

// 🎯 4. Activity Level
if (profile.activityLevel === "high" && tagNames.includes("fitness")) {
  score += 1;
}

if (profile.activityLevel === "low" && tagNames.includes("cardio")) {
  score += 1;
}

// 🎯 5. Rating normalization
const normalizedRating = (product.rating / 5) * 2;
score += normalizedRating;

return {
  ...product,
  score: Number(score.toFixed(2)),
};


});

const sortedProducts = scoredProducts.sort((a, b) => b.score - a.score);

// 🔥 Dynamic limit handling
if (limit) {
return sortedProducts.slice(0, limit);
}

return sortedProducts;
};
