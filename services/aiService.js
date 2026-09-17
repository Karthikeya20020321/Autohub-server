const getFallbackRecommendations = ({ budget = 2500, preferredBrand = "", usage = "daily commuting", location = "" }) => {
  const baseCars = [
    {
      title: "Toyota Corolla",
      brand: "Toyota",
      model: "Corolla",
      pricePerDay: 1200,
      reason: "Reliable, fuel-efficient, and ideal for daily city use.",
    },
    {
      title: "Honda Civic",
      brand: "Honda",
      model: "Civic",
      pricePerDay: 1400,
      reason: "Comfortable ride with strong value for longer trips.",
    },
    {
      title: "Hyundai Creta",
      brand: "Hyundai",
      model: "Creta",
      pricePerDay: 1800,
      reason: "Great for family travel and extra comfort.",
    },
    {
      title: "Mahindra Thar",
      brand: "Mahindra",
      model: "Thar",
      pricePerDay: 2200,
      reason: "Strong option for adventure trips and rough roads.",
    },
  ];

  let filtered = baseCars.filter((car) => {
    if (budget && car.pricePerDay > Number(budget)) return false;
    if (preferredBrand && !car.brand.toLowerCase().includes(preferredBrand.toLowerCase())) return false;
    return true;
  });

  if (!filtered.length) {
    filtered = baseCars;
  }

  return filtered.slice(0, 3).map((car) => ({
    ...car,
    location: location || "City pickup available",
    usageMatch: usage,
  }));
};

const buildPrompt = ({ budget, preferredBrand, usage, location, season }) => {
  const budgetText = budget ? `Budget per day: ${budget}` : "No strict budget";
  const brandText = preferredBrand ? `Preferred brand: ${preferredBrand}` : "No preferred brand";
  const usageText = usage ? `Primary use: ${usage}` : "General use";
  const locationText = location ? `Location: ${location}` : "Any city";
  const seasonText = season ? `Season: ${season}` : "Regular season";

  return `
    Recommend 3 cars for a rental app.
    Return valid JSON only with this structure:
    [
      {
        "title": "Car Name",
        "brand": "Brand",
        "model": "Model",
        "pricePerDay": 0,
        "reason": "Why this matches the user"
      }
    ]

    Constraints:
    - Use realistic car names.
    - Keep prices in INR/day numbers.
    - Match user needs.

    User details:
    - ${budgetText}
    - ${brandText}
    - ${usageText}
    - ${locationText}
    - ${seasonText}
  `;
};

const parseAiResponse = (rawText) => {
  const cleaned = rawText
    .replace(/```json/gim, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");

    if (firstBracket !== -1 && lastBracket !== -1) {
      const jsonSlice = cleaned.slice(firstBracket, lastBracket + 1);
      return JSON.parse(jsonSlice);
    }

    return null;
  }
};

const generateCarRecommendations = async (options = {}) => {
  const {
    budget,
    preferredBrand,
    usage,
    location,
    season,
  } = options;

  const provider = process.env.AI_PROVIDER || "gemini";
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return getFallbackRecommendations({
      budget,
      preferredBrand,
      usage,
      location,
    });
  }

  try {
    const prompt = buildPrompt({
      budget,
      preferredBrand,
      usage,
      location,
      season,
    });

    let response;

    if (provider === "gemini") {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI provider error: ${response.status}`);
      }

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const parsed = parseAiResponse(text);

      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    }

    if (provider === "openai") {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a car rental recommendation expert." },
            { role: "user", content: prompt },
          ],
          temperature: 0.4,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI provider error: ${response.status}`);
      }

      const result = await response.json();
      const text = result?.choices?.[0]?.message?.content || "";
      const parsed = parseAiResponse(text);

      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    }

    return getFallbackRecommendations({
      budget,
      preferredBrand,
      usage,
      location,
    });
  } catch (error) {
    console.error("AI recommendation error:", error);

    return getFallbackRecommendations({
      budget,
      preferredBrand,
      usage,
      location,
    });
  }
};

module.exports = {
  generateCarRecommendations,
  getFallbackRecommendations,
};
