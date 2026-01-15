'use client';

import { useState } from 'react';

interface GrammarError {
  start: number;
  end: number;
  incorrect: string;
  correction: string;
  explanation: string;
}

interface GrammarResult {
  original_text: string;
  grammar_score: number;
  summary_explanation: string;
  corrected_text: string;
  errors: GrammarError[];
}

export default function GrammarChecker() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setError(data.error || 'Failed to check grammar');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // green
    if (score >= 70) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const highlightText = (text: string, errors: GrammarError[]) => {
    if (!errors || errors.length === 0) return text;

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    const sortedErrors = [...errors].sort((a, b) => a.start - b.start);

    sortedErrors.forEach((error, idx) => {
      if (error.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>{text.substring(lastIndex, error.start)}</span>
        );
      }
      parts.push(
        <span
          key={`error-${idx}`}
          className="error-highlight"
          title={error.explanation}
        >
          {text.substring(error.start, error.end)}
        </span>
      );
      lastIndex = error.end;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  return (
    <div className="grammar-checker">
      <div className="header">
        <h1>Grammar Checker</h1>
        <p>Enter text below to check for grammar errors in any language</p>
      </div>

      <div className="input-section">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here..."
          disabled={loading}
          className="text-input"
        />
        <button
          onClick={handleCheck}
          disabled={loading || !input.trim()}
          className="check-button"
        >
          {loading ? 'Checking...' : 'Check Grammar'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="results">
          <div className="score-section">
            <div className="score-circle" style={{ borderColor: getScoreColor(result.grammar_score) }}>
              <div className="score-value" style={{ color: getScoreColor(result.grammar_score) }}>
                {result.grammar_score}
              </div>
              <div className="score-label">Score</div>
            </div>
            <div className="summary">
              <h3>Summary</h3>
              <p>{result.summary_explanation}</p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <>
              <div className="text-comparison">
                <div className="text-block">
                  <h3>Original Text</h3>
                  <div className="text-content highlighted">
                    {highlightText(result.original_text, result.errors)}
                  </div>
                </div>
                <div className="text-block">
                  <h3>Corrected Text</h3>
                  <div className="text-content">{result.corrected_text}</div>
                </div>
              </div>

              <div className="errors-section">
                <h3>Errors Found ({result.errors.length})</h3>
                <div className="errors-list">
                  {result.errors.map((error, index) => (
                    <div key={index} className="error-item">
                      <div className="error-header">
                        <span className="error-number">Error {index + 1}</span>
                        <span className="error-position">Position: {error.start}-{error.end}</span>
                      </div>
                      <div className="error-correction">
                        <span className="incorrect">"{error.incorrect}"</span>
                        <span className="arrow">→</span>
                        <span className="correct">"{error.correction}"</span>
                      </div>
                      <div className="error-explanation">{error.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {(!result.errors || result.errors.length === 0) && (
            <div className="no-errors">
              <div className="success-icon">✓</div>
              <h3>Perfect Grammar!</h3>
              <p>No errors were found in your text.</p>
              <div className="text-block">
                <div className="text-content">{result.corrected_text}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
