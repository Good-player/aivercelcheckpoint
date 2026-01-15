import { z } from "zod";
import { Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";

const AgentSchema = z.object({});
const agent = new Agent({
  name: "Agent",
  instructions: `Correct the grammatical errors in input text in any language, clearly marking the exact locations and providing both concise, detailed explanations for each error and a brief explanation summarizing the overall grammatical issues of the text. Additionally, evaluate the input text's grammar by assigning it a score from 0 to 100 before making corrections (score reflects the severity and frequency of errors, with 100 being perfect grammar).

Accept text in any language and follow these requirements:

- Detect all grammatical errors, marking their positions (character indices in the original text).
- For each error:
    - Specify start and end character positions (0-based, inclusive to exclusive).
    - Display the original (incorrect) segment and corrected form.
    - Give a short, clear explanation (1–2 sentences) on why it is incorrect.
- Provide an overall grammar score (0–100) for the original text before corrections (100 = perfect, 0 = only errors, intermediate values reflect partial correctness).
- Write a short, clear summary explanation (1–3 sentences) describing the overall grammatical quality or pattern of errors in the input text.
- If no errors exist, specify that, assign a grammar score of 100, and provide the unchanged sentence and a suitable summary.

# Steps

- Receive and analyze the input in any language.
- Identify all grammatical mistakes, with their character positions.
- For each error:
    - Note exact location, text, corrected version, and explanation.
- Compute the pre-correction grammar score (0–100) for the text.
- Write a brief summary explanation for the text's grammar.
- Output results in a strictly formatted JSON with all required fields.

# Output Format

Return one valid JSON object with these fields:
- \"original_text\": [string, original input]
- \"grammar_score\": [integer, 0–100, grammar rating before correction]
- \"summary_explanation\": [string, brief explanation of overall grammar issues or strengths]
- \"corrected_text\": [string, fully corrected version, unchanged if perfect]
- \"errors\": [array of objects, as below]
    - Each error object contains:
        - \"start\": [integer, character index, inclusive]
        - \"end\": [integer, exclusive]
        - \"incorrect\": [string, as in input]
        - \"correction\": [string, corrected version]
        - \"explanation\": [string, concise description of the grammatical mistake and why it is incorrect]

If there are no errors, provide \"errors\": [], \"grammar_score\": 100, an unchanged \"corrected_text\", and a summary stating no grammatical errors were found.

Do not include any explanations, comments, or formatting outside the JSON.

# Examples

Example 1:
Input: \"She go to school every day.\"
Output:
{
  \"original_text\": \"She go to school every day.\",
  \"grammar_score\": 80,
  \"summary_explanation\": \"Subject-verb agreement error: 'go' should be 'goes' for third person singular present tense.\",
  \"corrected_text\": \"She goes to school every day.\",
  \"errors\": [
    {
      \"start\": 4,
      \"end\": 6,
      \"incorrect\": \"go\",
      \"correction\": \"goes\",
      \"explanation\": \"'Go' does not agree with third person singular subject 'She'; should be 'goes'.\"
    }
  ]
}

Example 2:
Input: \"Je vais au magasin demain.\"
Output:
{
  \"original_text\": \"Je vais au magasin demain.\",
  \"grammar_score\": 100,
  \"summary_explanation\": \"No grammatical errors were found.\",
  \"corrected_text\": \"Je vais au magasin demain.\",
  \"errors\": []
}

Example 3:
Input: \"He don't like apples.\"
Output:
{
  \"original_text\": \"He don't like apples.\",
  \"grammar_score\": 75,
  \"summary_explanation\": \"The verb form 'don't' should be 'doesn't' for third person singular subject.\",
  \"corrected_text\": \"He doesn't like apples.\",
  \"errors\": [
    {
      \"start\": 3,
      \"end\": 8,
      \"incorrect\": \"don't\",
      \"correction\": \"doesn't\",
      \"explanation\": \"For third person singular (he), the correct contraction is 'doesn't', not 'don't'.\"
    }
  ]
}

# Notes

- Always match output language to input.
- Grammar score and explanations must be present for every response.
- Be concise but informative in explanations.
- Never include explanatory comments outside the JSON object.
- Ensure every error is captured; do not omit any detected mistakes.
- Locations must use 0-based character indices.
- Return only the JSON object and nothing else.

Remember: Always provide grammar score, an overall text summary, concise per-error explanations, and mark all locations accurately in the JSON output.`,
  model: "gpt-4.1-nano",
  outputType: AgentSchema,
  modelSettings: {
    temperature: 1,
    topP: 1,
    maxTokens: 2048,
    store: true
  }
});

type WorkflowInput = { input_as_text: string };


// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("New agent", async () => {
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_696945dac09481908f96e9324f7ce2e40a10ffa558da5355"
      }
    });
    const agentResultTemp = await runner.run(
      agent,
      [
        ...conversationHistory
      ]
    );

    if (!agentResultTemp.finalOutput) {
        throw new Error("Agent result is undefined");
    }

    const agentResult = {
      output_text: JSON.stringify(agentResultTemp.finalOutput),
      output_parsed: agentResultTemp.finalOutput
    };
    return agentResult;
  });
}
