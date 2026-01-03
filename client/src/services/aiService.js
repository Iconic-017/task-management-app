const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

const getMockTitle = (description) => {
  const text = description.toLowerCase();

  if (text.includes("fix") || text.includes("bug") || text.includes("error")) {
    return "Fix authentication issue";
  }

  if (
    text.includes("role") ||
    text.includes("permission") ||
    text.includes("access")
  ) {
    return "Implement role-based access control";
  }

  if (
    text.includes("ui") ||
    text.includes("interface") ||
    text.includes("design")
  ) {
    return "Improve task list UI";
  }

  if (text.includes("optimize") || text.includes("performance")) {
    return "Optimize task performance";
  }

  if (text.includes("log") || text.includes("activity")) {
    return "Add task activity logging";
  }

  return "Update task functionality";
};

export const aiService = {
  async suggestTaskTitle(description) {
    if (!description || description.trim().length < 10) {
      throw new Error("Description must be at least 10 characters");
    }

    if (!OPENAI_API_KEY) {
      return getMockTitle(description);
    }

    try {
      const response = await fetch(OPENAI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
              You are a task management assistant.

              Rules:
              - Generate a short, clear, action-oriented task title
              - Preserve the main intent of the description
              - Do NOT invent unrelated actions
              - Start with verbs like Fix, Add, Implement, Improve, Optimize
              - Max 60 characters
              - Output ONLY the title
              `.trim(),
            },
            {
              role: "user",
              content: description,
            },
          ],
          max_tokens: 20,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error("AI service unavailable");
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.warn("AI service error, using mock:", error.message);
      return getMockTitle(description);
    }
  },
};
