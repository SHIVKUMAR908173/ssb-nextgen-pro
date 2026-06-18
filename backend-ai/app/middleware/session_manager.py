import time
from typing import Dict, Any

class SessionManager:
    """
    A simple in-memory TTL cache to prevent memory leaks from unbounded dictionaries.
    Used for tracking active interview sessions, rate limits, and progress data.
    """
    def __init__(self, ttl_seconds: int = 3600, max_items: int = 1000):
        self._store: Dict[str, Any] = {}
        self._timestamps: Dict[str, float] = {}
        self.ttl = ttl_seconds
        self.max_items = max_items
    
    def set(self, key: str, value: Any):
        self._cleanup()
        # Evict oldest if we hit the limit
        if len(self._store) >= self.max_items:
            oldest = min(self._timestamps, key=self._timestamps.get)
            self.delete(oldest)
            
        self._store[key] = value
        self._timestamps[key] = time.time()
        
    def get(self, key: str) -> Any:
        self._cleanup()
        if key in self._store:
            # Refresh timestamp on access
            self._timestamps[key] = time.time()
            return self._store[key]
        return None
        
    def delete(self, key: str):
        if key in self._store:
            del self._store[key]
            del self._timestamps[key]
            
    def _cleanup(self):
        """Remove expired items"""
        now = time.time()
        expired = [k for k, ts in self._timestamps.items() if now - ts > self.ttl]
        for k in expired:
            self.delete(k)
            
    def __contains__(self, key: str) -> bool:
        self._cleanup()
        return key in self._store
        
    def items(self):
        self._cleanup()
        return self._store.items()
        
    def keys(self):
        self._cleanup()
        return self._store.keys()
        
    def __getitem__(self, key: str) -> Any:
        val = self.get(key)
        if val is None:
            raise KeyError(key)
        return val
        
    def __setitem__(self, key: str, value: Any):
        self.set(key, value)
        
    def __delitem__(self, key: str):
        self.delete(key)
