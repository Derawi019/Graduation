from typing import Dict, Any
from .intent import detect_intent
from .engine import HuggingFaceEngine
from .postprocess import clean_user_instruction, format_output

_engine = None
_engine_error = None


def _get_engine():
    global _engine, _engine_error
    if _engine is not None:
        return _engine
    if _engine_error is not None:
        return None
    try:
        _engine = HuggingFaceEngine()
    except Exception as exc:
        _engine_error = exc
        return None
    return _engine

def handle_request(text: str, meta: Dict[str, Any] | None = None) -> Dict[str, Any]:
    meta = meta or {}

    intent_result = detect_intent(text)

    # ✅ Fallback to explicit action
    explicit_action = meta.get("action")
    if intent_result.intent == "general" and explicit_action:
        intent_result.action = explicit_action

    payload = clean_user_instruction(text)

    engine = _get_engine()
    if not engine:
        return {
            "intent": intent_result.intent,
            "action": intent_result.action,
            "confidence": intent_result.confidence,
            "output": format_output(payload)
        }

    engine_result = engine.run(
        task=intent_result.action,
        text=payload,
        options=meta
    )

    return {
        "intent": intent_result.intent,
        "action": intent_result.action,
        "confidence": intent_result.confidence,
        "output": format_output(engine_result.get("output", payload))
    }
