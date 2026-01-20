from transformers import pipeline
from typing import Dict, Any

class HuggingFaceEngine:
    """
    Unified HuggingFace NLP Engine
    - Multilingual
    - Stable
    - One model, one brain
    """

    def __init__(self):
        self.model = pipeline(
            task="text2text-generation",
            model="google/mt5-small"
        )

    def run(self, task: str, text: str, options: Dict[str, Any] | None = None) -> Dict[str, Any]:
        options = options or {}

        if not text or len(text.strip()) < 30:
            return {"output": text}

        if task == "summarize":
            return {"output": self._summarize(text)}

        if task == "rewrite":
            # rewrite = summarize بأسلوب مختلف (مقبول كبداية)
            return {"output": self._rewrite(text)}

        return {"output": "Task not supported yet"}

    def _summarize(self, text: str) -> str:
        prompt = f"summarize: {text}"

        result = self.model(
        prompt,
        max_length=120,
        min_length=40,
        do_sample=False
        )

        return result[0]["generated_text"].strip()


    def _rewrite(self, text: str) -> str:
        prompt = f"paraphrase: {text}"

        result = self.model(
            prompt,
            max_length=150,
            min_length=40,
            do_sample=False
        )

        return result[0]["summary_text"].strip()
