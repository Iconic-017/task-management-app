import { useState } from "react";
import { aiService } from "../services/aiService";

const AISuggestionPanel = ({ onTitleSelected }) => {
  const [description, setDescription] = useState("");
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDescriptionValid = description.trim().length >= 10;

  const handleSuggest = async () => {
    if (!isDescriptionValid) {
      setError("Description must be at least 10 characters");
      return;
    }

    setLoading(true);
    setError("");
    setSuggestedTitle("");

    try {
      const title = await aiService.suggestTaskTitle(description);
      setSuggestedTitle(title);
    } catch (err) {
      setError(err.message || "Failed to generate suggestion");
    } finally {
      setLoading(false);
    }
  };

  const handleUseTitle = () => {
    if (suggestedTitle && onTitleSelected) {
      onTitleSelected(suggestedTitle, description);
      setDescription("");
      setSuggestedTitle("");
    }
  };

  return (
    <div className="ai-panel">
      <h2>Suggest Task Title</h2>
      <div className="ai-panel-content">
        <div className="form-group">
          <label htmlFor="ai-description">Task Description</label>
          <textarea
            id="ai-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a detailed task description (min 10 characters)..."
            rows="4"
          />
        </div>

        <button
          className={`btn ${isDescriptionValid && !loading ? "btn-primary" : "btn-secondary"}`}
          onClick={handleSuggest}
          disabled={loading || !isDescriptionValid}
          style={{
            opacity: isDescriptionValid && !loading ? 1 : 0.6,
            cursor: isDescriptionValid && !loading ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Generating..." : "Generate Title"}
        </button>

        {error && <div className="error-message">{error}</div>}

        {suggestedTitle && (
          <div className="suggestion-result">
            <div className="suggested-title">
              <strong>Suggested Title:</strong>
              <p>{suggestedTitle}</p>
            </div>
            <button className="btn btn-success" onClick={handleUseTitle}>
              Use This Title
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestionPanel;
