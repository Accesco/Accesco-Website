from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, Any

@dataclass
class VideoEngagement:
    """
    Python-side model for Video Engagement Metrics.
    This structure is enforced at the DB level by a JSON Schema.
    """
    video_id: str
    views: int = 0
    completion_rate: float = 0.0
    swipe_left_rate: float = 0.0  # (cart adds)
    saves: int = 0
    double_taps: int = 0
    shares: int = 0
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for PyMongo insertion/update."""
        return {
            "video_id": self.video_id,
            "views": self.views,
            "completion_rate": float(self.completion_rate),
            "swipe_left_rate": float(self.swipe_left_rate),
            "saves": self.saves,
            "double_taps": self.double_taps,
            "shares": self.shares,
            "updated_at": self.updated_at,
        }
