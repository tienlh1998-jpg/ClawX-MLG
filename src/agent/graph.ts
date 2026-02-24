import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { tools } from "./tools.ts";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-pro-preview",
  apiKey: process.env.GEMINI_API_KEY,
  maxOutputTokens: 2048,
});

const modelWithTools = model.bindTools(tools);

const toolNode = new ToolNode(tools);

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];
  if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return "__end__";
}

async function callModel(state: typeof MessagesAnnotation.State) {
  const { messages } = state;
  const response = await modelWithTools.invoke(messages);
  return { messages: [response] };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

export const agent = workflow.compile();

export async function runAgent(input: string, threadId: string) {
  const config = { configurable: { thread_id: threadId } };
  const result = await agent.invoke(
    { messages: [{ role: "user", content: input }] },
    config
  );
  return result.messages[result.messages.length - 1].content;
}
