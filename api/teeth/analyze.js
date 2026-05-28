import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const config = {
  api: { bodyParser: { sizeLimit: "50mb" } },
};

const DENTAL_PROMPT = `You are an expert dental AI assistant with analytical capabilities equivalent to a professional dentist performing an initial visual examination. Analyze this photograph of teeth thoroughly and produce a comprehensive professional dental report.

Important: If the image does not clearly show teeth, set confidence to "low" and use neutral default values.

Respond ONLY with a valid JSON object â€” no markdown, no explanation, just JSON:

{
  "whitenessScore": <integer 1-10 where: 10=brilliant white (bleached), 8-9=bright white (A1-B1), 6-7=natural white (A2-B2), 4-5=slightly yellow (A3-A3.5), 2-3=noticeably yellow/stained (A4-C3), 1=severely discolored/brown>,
  "shadeGuide": "<VITA Classical shade: A1, A2, A3, A3.5, A4, B1, B2, B3, B4, C1, C2, C3, C4, D2, D3, or D4>",
  "colorDescription": "<one of: Brilliant White | Bright White | Natural White | Slightly Yellow | Moderately Yellow | Heavily Yellowed | Yellow-Brown Staining | Brown/Dark Staining>",
  "colorHex": "<6-digit hex code best matching the dominant visible tooth color>",
  "conditions": [
    {
      "name": "<condition name>",
      "severity": "<none|mild|moderate|severe>",
      "location": "<specific location, e.g. Upper front teeth, Between molars, Gum line, All surfaces>",
      "advice": "<specific professional action the patient should take for this condition>"
    }
  ],
  "alignment": "<straight|mild_crowding|moderate_crowding|severe_crowding|spacing_issues|bite_issues|other>",
  "alignmentDetails": "<2-3 sentence professional description of alignment, noting specific teeth if visible>",
  "alignmentAdvice": "<specific recommendation>",
  "gumHealth": "<healthy|mild_concern|moderate_concern|severe_concern>",
  "gumDetails": "<description of visible gum color, recession, inflammation, or bleeding indicators>",
  "recommendations": [
    "<specific actionable recommendation 1>",
    "<recommendation 2>",
    "<recommendation 3>",
    "<recommendation 4>",
    "<recommendation 5 if warranted>"
  ],
  "urgency": "<routine|attention_needed|see_dentist_soon|see_dentist_immediately>",
  "urgencyReason": "<one sentence explaining why this urgency level was assigned>",
  "overallScore": <integer 1-10 overall dental health>,
  "professionalNote": "<A short professional note written as a dentist would write to a patient>",
  "confidence": "<low|medium|high>"
}

Conditions to look for: surface staining, interproximal staining, tartar/calculus buildup, visible plaque, enamel erosion, visible cavities or decay, gum recession, gum inflammation/gingivitis, chipping or cracking, overcrowding or misalignment.

Urgency guidelines:
- routine: Healthy or minor cosmetic concerns only
- attention_needed: Notable staining, early plaque, mild alignment â€” book within 3 months
- see_dentist_soon: Significant tartar, gum inflammation, visible decay â€” within 4-6 weeks
- see_dentist_immediately: Severe decay, abscess indicators, severe gum disease â€” within days`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image, mimeType } = req.body;

  if (!image || !mimeType) {
    return res.status(400).json({ error: "image and mimeType are required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { inlineData: { mimeType, data: image } },
      DENTAL_PROMPT,
    ]);

    const content = result.response.text();
    const cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    return res.json(parsed);
  } catch (err) {
    console.error("Teeth analysis failed:", err);
    return res.status(500).json({ error: "Analysis failed. Please try again." });
  }
}
