"""
DFW HVAC Next.js 15 + React 19 upgrade regression tests.
Covers: page routes (GET 200), /api/leads (validation, happy path, rate limit,
HTML sanitization), /api/cron/sync-reviews (auth), sitemap/robots, redirects,
and security headers.
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://hvac-conversion-hub.preview.emergentagent.com").rstrip("/")
# NOTE: Preview ingress routes /api/* to the FastAPI backend on :8001, bypassing
# Next.js API routes. For this Next.js-only app, hit localhost:3000 directly for
# /api endpoints. Page tests still use the public URL.
NEXT_API_URL = "http://localhost:3000"

# Read CRON_SECRET from frontend .env.local
CRON_SECRET = None
try:
    with open("/app/frontend/.env.local") as f:
        for ln in f:
            if ln.startswith("CRON_SECRET="):
                CRON_SECRET = ln.strip().split("=", 1)[1]
                break
except Exception:
    pass


# --- Page route tests ---
PAGE_ROUTES = [
    "/",
    "/about",
    "/contact",
    "/services",
    "/services/residential/indoor-air-quality",
    "/cities-served",
    "/cities-served/plano",
    "/reviews",
    "/faq",
    "/estimate",
    "/request-service",
    "/recent-projects",
    "/privacy-policy",
    "/terms-of-service",
    "/sitemap.xml",
    "/robots.txt",
]


@pytest.mark.parametrize("path", PAGE_ROUTES)
def test_page_returns_200(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=30, allow_redirects=True)
    assert r.status_code == 200, f"{path} returned {r.status_code}"
    # Basic content assertion: non-empty body
    assert len(r.text) > 50, f"{path} body suspiciously small"


# --- Security headers ---
def test_security_headers_present():
    r = requests.get(f"{BASE_URL}/", timeout=30)
    assert r.status_code == 200
    headers_lower = {k.lower(): v for k, v in r.headers.items()}
    required = [
        "x-frame-options",
        "x-content-type-options",
        "referrer-policy",
        "content-security-policy",
        "permissions-policy",
    ]
    missing = [h for h in required if h not in headers_lower]
    assert not missing, f"Missing headers: {missing}. Present: {list(headers_lower.keys())}"


# --- Redirects ---
@pytest.mark.parametrize("src,dst_contains", [
    ("/scheduleservicecall", "/request-service"),
    ("/installation", "/estimate"),
    ("/iaq", "/services/residential/indoor-air-quality"),
])
def test_redirects(src, dst_contains):
    r = requests.get(f"{BASE_URL}{src}", timeout=30, allow_redirects=False)
    assert r.status_code in (301, 308), f"{src} returned {r.status_code}"
    loc = r.headers.get("location", "")
    assert dst_contains in loc, f"{src} -> {loc} (expected to contain {dst_contains})"


# --- /api/leads: validation ---
def test_leads_missing_fields_returns_400():
    r = requests.post(f"{NEXT_API_URL}/api/leads", json={}, timeout=30)
    assert r.status_code == 400
    body = r.json()
    assert "error" in body or "message" in body, f"No error message: {body}"


# --- /api/leads: happy path ---
def _valid_payload(suffix=""):
    return {
        "firstName": "TEST",
        "lastName": f"AutoTester{suffix}",
        "email": f"test+{uuid.uuid4().hex[:8]}@example.com",
        "phone": "2145551234",
        "leadType": "service",
        "problemDescription": "Automated regression test lead. Please ignore.",
        "serviceAddress": "123 Test St, Plano, TX 75024",
        "numSystems": "1",
        "source": "automated-test",
    }


def test_leads_valid_payload_returns_success():
    r = requests.post(f"{NEXT_API_URL}/api/leads", json=_valid_payload("-happy"), timeout=30)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text[:500]}"
    body = r.json()
    assert body.get("success"), f"success not True: {body}"
    assert "lead_id" in body or "leadId" in body or "id" in body, f"No lead id in: {body}"


# --- /api/leads: HTML sanitization ---
def test_leads_html_sanitization():
    payload = _valid_payload("-xss")
    payload["firstName"] = "<script>alert('xss')</script>Evil"
    payload["problemDescription"] = "<img src=x onerror=alert(1)> hello"
    r = requests.post(f"{NEXT_API_URL}/api/leads", json=payload, timeout=30)
    assert r.status_code == 200, f"Got {r.status_code}: {r.text[:300]}"
    body = r.json()
    assert body.get("success")
    # The response should not echo raw <script> back
    assert "<script>" not in r.text.lower(), "Raw <script> found in response"


# --- /api/leads: rate limiting (5 per 15 min per IP) ---
def test_leads_rate_limit():
    """Submit 6 requests rapidly; 6th should be blocked with 429."""
    statuses = []
    for i in range(6):
        r = requests.post(f"{NEXT_API_URL}/api/leads", json=_valid_payload(f"-rl{i}"), timeout=30)
        statuses.append(r.status_code)
        time.sleep(0.2)
    # At least one of the later requests must be 429
    assert 429 in statuses, f"Rate limit not enforced. Statuses: {statuses}"


# --- /api/cron/sync-reviews: auth ---
def test_cron_without_auth_returns_401():
    r = requests.get(f"{NEXT_API_URL}/api/cron/sync-reviews", timeout=30)
    assert r.status_code == 401, f"Got {r.status_code}: {r.text[:200]}"


def test_cron_with_valid_bearer_passes_auth():
    if not CRON_SECRET:
        pytest.skip("CRON_SECRET not available")
    r = requests.get(
        f"{NEXT_API_URL}/api/cron/sync-reviews",
        headers={"Authorization": f"Bearer {CRON_SECRET}"},
        timeout=60,
    )
    # 200/500 both mean auth passed (500 may occur if external API is unreachable).
    # The only failure here is 401/403.
    assert r.status_code not in (401, 403), f"Auth failed: {r.status_code} {r.text[:200]}"
