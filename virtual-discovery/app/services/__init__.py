# Services package
# Import submodules so mock.patch("app.services.xxx.yyy") can resolve.
# Each import is guarded so one broken dependency (e.g. torch DLL not found)
# doesn't cascade and break unrelated services.
try:
    from app.services import ai_pipeline       # noqa: F401
except ImportError:
    pass

try:
    from app.services import torchserve_client  # noqa: F401
except ImportError:
    pass

try:
    from app.services import muril_classifier   # noqa: F401
except ImportError:
    pass
