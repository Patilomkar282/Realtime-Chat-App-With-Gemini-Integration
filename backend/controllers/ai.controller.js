import { generateResult } from "../services/ai.service.js";

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.query; // ✅ corrected spelling


    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const result = await generateResult(prompt);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
