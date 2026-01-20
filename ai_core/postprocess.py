def clean_user_instruction(text: str) -> str:
    """
    Optional: remove common instruction prefixes to isolate payload.
    (We'll improve it in Phase 3 for translation.)
    """
    t = text.strip()
    # أمثلة بسيطة
    for prefix in ["لخص هذا النص:", "لخص النص:", "ترجم هذا النص إلى العربية:", "أعد صياغة هذا النص:", "اعادة صياغة هذا النص:"]:
        if t.startswith(prefix):
            return t[len(prefix):].strip()
    return t


def format_output(text: str) -> str:
    return text.strip()
 
