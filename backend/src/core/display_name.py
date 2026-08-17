from typing import Optional


def mask_display_name(name: Optional[str]) -> Optional[str]:
    """Shorten a reviewer's name for public display: 'Maria Santos' -> 'Maria S.'

    Returns None when there is no usable name so the frontend can fall back to its own
    translated placeholder instead of the API inventing an untranslated one.
    """
    if not name or not name.strip():
        return None

    parts = name.split()
    if len(parts) == 1:
        return parts[0]

    return f"{parts[0]} {parts[-1][0].upper()}."
