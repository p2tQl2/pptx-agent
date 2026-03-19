# pptx-agent

A minimal implementation of the recommended roadmap:

**LLM + Structured Outputs + Semantic Template Library + Constraint Layout + PptxGenJS export**

## Supported workflow

The repository now covers the four core steps of the PPT workflow:

1. **Configure and connect an LLM** via environment variables.
2. **Accept user input and analyze a PPT outline**.
3. **Generate PPT content and PPT pages from the outline**.
4. **Edit slide content and export the PPT**.

## LLM API / KEY configuration

The LLM provider is configured entirely through environment variables.

### Default local mode

If you do nothing, the CLI uses the built-in heuristic generator:

```bash
node src/cli.js "最推荐技术路线" "先做会写内容的 PPT 工具，再做会设计的 PPT 工具，最后再做懂企业知识和品牌规范的平台。"
```

### OpenAI mode

```bash
cp .env.example .env
export PPTX_AGENT_LLM_PROVIDER=openai
export OPENAI_API_KEY="your_api_key_here"
export OPENAI_BASE_URL="https://api.openai.com/v1"
export OPENAI_MODEL="gpt-4.1-mini"
node src/cli.js "最推荐技术路线" "先做会写内容的 PPT 工具，再做会设计的 PPT 工具，最后再做懂企业知识和品牌规范的平台。"
```

### Environment variables

- `PPTX_AGENT_LLM_PROVIDER`: `heuristic` or `openai`
- `OPENAI_API_KEY`: your OpenAI API key
- `OPENAI_BASE_URL`: optional custom base URL for proxy / gateway deployments
- `OPENAI_MODEL`: optional model name override

## Workflow APIs

- `PresentationPipeline.analyzeOutline(input)` analyzes user input into a PPT outline.
- `PresentationPipeline.generateStructuredDeckFromOutline(outline)` generates PPT content/pages from the outline.
- `PresentationPipeline.editStructuredDeck(deck, edits)` edits generated slide content.
- `PresentationPipeline.exportDeck(resolvedDeck, outputPath)` exports the PPT.
- `DeckEditor` supports `update-slide`, `replace-bullets`, `insert-slide`, and `remove-slide` operations.

## Architecture

```text
user input
  -> outline analysis
  -> structured deck generation
  -> semantic template selection
  -> constraint-based fitting
  -> optional editing
  -> pptx export
```

## Notes

- This repository includes a tiny local `pptxgenjs` compatibility shim so the export pipeline works in restricted environments where the public npm registry is unavailable.
