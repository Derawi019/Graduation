from dataclasses import dataclass
from typing import Optional

@dataclass
class IntentResult:
    intent: str              # translation | writing | meeting | content | general
    action: Optional[str]    # summarize | rewrite | improve | translate | ...
    confidence: float = 0.6  # لاحقًا يمكن تطويره


def detect_intent(text: str) -> IntentResult:
    if not text:
        return IntentResult(intent="general", action=None, confidence=0.1)

    t = text.strip().lower()

    # Translation
    if any(k in t for k in ["ترجم", "ترجمة", "translate", "translation"]):
        return IntentResult(intent="translation", action="translate", confidence=0.9)

    # Writing
    if any(k in t for k in ["لخص", "تلخيص", "summarize", "summary"]):
        return IntentResult(intent="writing", action="summarize", confidence=0.9)

    if any(k in t for k in [
    "أعد صياغة",
    "اعد صياغة",
    "اعادة صياغة",
    "إعادة صياغة",
    "rewrite",
    "paraphrase"
    ]):
        return IntentResult(intent="writing", action="rewrite", confidence=0.85)


    if any(k in t for k in ["حسّن", "تحسين", "improve", "polish"]):
        return IntentResult(intent="writing", action="improve", confidence=0.8)

    # Meeting
    if any(k in t for k in ["اجتماع", "meeting", "minutes", "محضر"]):
        return IntentResult(intent="meeting", action="meeting_summary", confidence=0.8)

    # Content
    if any(k in t for k in ["قصة", "story", "اكتب", "write", "content"]):
        return IntentResult(intent="content", action="generate", confidence=0.8)

    return IntentResult(intent="general", action=None, confidence=0.5)
