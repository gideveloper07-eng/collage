const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Keep per-session chat history in memory (keyed by sessionId)
const sessions = {};

exports.chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const sid = sessionId || "default";

    // Initialize history for new sessions
    if (!sessions[sid]) {
      sessions[sid] = [];
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are a helpful AI assistant for CollegeHub — a college and course discovery app.
You help students with:
- Finding colleges and courses
- Understanding admission processes
- Career guidance and course selection
- Application tips and deadlines
- General academic questions
Be friendly, concise, and helpful. If asked something unrelated to education or the app, politely redirect.`,
    });

    const chat = model.startChat({ history: sessions[sid] });

    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    // Save to history
    sessions[sid].push({ role: "user",  parts: [{ text: message.trim() }] });
    sessions[sid].push({ role: "model", parts: [{ text: reply }] });

    // Trim history to last 20 turns to avoid token overflow
    if (sessions[sid].length > 40) {
      sessions[sid] = sessions[sid].slice(-40);
    }

    res.json({ reply, sessionId: sid });
  } catch (err) {
    console.error("Agent error:", err.message);
    res.status(500).json({ error: "AI agent failed. Please try again." });
  }
};

exports.clearSession = (req, res) => {
  const { sessionId } = req.params;
  if (sessionId && sessions[sessionId]) {
    delete sessions[sessionId];
  }
  res.json({ cleared: true });
};
