"""
Frontend smoke + visual token verification for the Brand Cohesion Refactor (Phase 7).
Testing-type: frontend only (Next.js app - no separate Python backend).

Verifies:
  1. All sitemap pages return HTTP 200.
  2. Critical hero/CTA pages contain the canonical token classes in their HTML
     (prussian-blue -> electric-blue gradient, growth-green, alert-amber, vivid-red).
  3. No lingering forbidden hex literals / lime-XXX / yellow-400 for stars.
"""
import os
import re
import pytest
import requests
import xml.etree.ElementTree as ET
from pathlib import Path


def _load_base_url():
    # Prefer process env, then frontend/.env
    u = os.environ.get("REACT_APP_BACKEND_URL")
    if u:
        return u.rstrip("/")
    env_path = Path("/app/frontend/.env")
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                return line.split("=", 1)[1].strip().rstrip("/")
    raise RuntimeError("REACT_APP_BACKEND_URL not found in env or /app/frontend/.env")


BASE_URL = _load_base_url()

# ---------- Module: sitemap discovery ----------

@pytest.fixture(scope="module")
def sitemap_urls():
    r = requests.get(f"{BASE_URL}/sitemap.xml", timeout=20)
    assert r.status_code == 200, f"sitemap.xml not 200: {r.status_code}"
    # Parse locs
    locs = re.findall(r"<loc>([^<]+)</loc>", r.text)
    # Replace production host with preview host so we can fetch from preview env
    preview = []
    for u in locs:
        path = re.sub(r"^https?://[^/]+", "", u)
        if path == "":
            path = "/"
        preview.append(path)
    return preview


# ---------- Module: page load tests (all sitemap pages HTTP 200) ----------

def test_sitemap_has_expected_page_count(sitemap_urls):
    # main agent stated 47 sitemap pages; we allow small variance
    assert len(sitemap_urls) >= 40, f"Only {len(sitemap_urls)} pages in sitemap"


def test_all_sitemap_pages_return_200(sitemap_urls):
    failed = []
    for path in sitemap_urls:
        url = f"{BASE_URL}{path}"
        try:
            r = requests.get(url, timeout=25, allow_redirects=True)
            if r.status_code != 200:
                failed.append((path, r.status_code))
        except Exception as e:
            failed.append((path, f"EXC:{e}"))
    assert not failed, f"{len(failed)} pages failed: {failed[:10]}"


# ---------- Module: key hero-gradient pages carry canonical tokens ----------

HERO_GRADIENT_PAGES = [
    "/",
    "/financing",
    "/repair-or-replace",
    "/services/system-replacement",
    "/replacement-estimator",
    "/privacy-policy",
    "/terms-of-service",
    "/services",
    "/cities-served",
    "/cities-served/plano",
    "/recent-projects",
    "/request-service",
]

@pytest.mark.parametrize("path", HERO_GRADIENT_PAGES)
def test_hero_gradient_pages_use_canonical_tokens(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=25)
    assert r.status_code == 200, f"{path} returned {r.status_code}"
    html = r.text
    # Canonical hero: prussian-blue -> electric-blue
    has_prussian = "prussian-blue" in html
    has_electric = "electric-blue" in html
    assert has_prussian and has_electric, (
        f"{path} missing canonical hero tokens: "
        f"prussian-blue={has_prussian}, electric-blue={has_electric}"
    )


def test_not_found_page_renders():
    r = requests.get(f"{BASE_URL}/this-route-does-not-exist-xyz", timeout=20)
    # Next.js 404 returns 404 but HTML should be the custom not-found with hero tokens
    assert r.status_code == 404
    assert "prussian-blue" in r.text or "electric-blue" in r.text


# ---------- Module: growth-green appears on funnel pages ----------

FUNNEL_PAGES = ["/financing", "/replacement-estimator", "/repair-or-replace"]

@pytest.mark.parametrize("path", FUNNEL_PAGES)
def test_funnel_pages_use_growth_green(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=25)
    assert r.status_code == 200
    assert "growth-green" in r.text, f"{path} missing growth-green token"


# ---------- Module: star ratings use alert-amber (not yellow-400) ----------

STAR_PAGES = ["/", "/reviews"]

@pytest.mark.parametrize("path", STAR_PAGES)
def test_stars_use_alert_amber_not_yellow(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=25)
    assert r.status_code == 200
    html = r.text
    # The /reviews page renders via ReviewsGrid (alert-amber). The homepage renders
    # via HomePage.jsx — stars should also be alert-amber per design_guidelines.md.
    # yellow-XXX on a star container is forbidden.
    star_yellow_pattern = re.compile(r'text-yellow-\d+[^"\']*"\s*[^>]*>\s*(?:<[^>]*Star|\{\[\.\.\.Array)')
    # simpler heuristic: any <div class="... text-yellow-500 ..."> that wraps Star svgs
    bad = re.findall(r'class="[^"]*text-yellow-(?:400|500|600)[^"]*"', html)
    # Reviews page must use alert-amber
    if path == "/reviews":
        assert "alert-amber" in html, f"{path} should contain alert-amber token for stars"
    # For homepage, flag yellow on star wrappers (this catches the refactor miss)
    if bad:
        # Not all yellow-XXX usages are stars, but homepage star container specifically uses text-yellow-500
        # as the COLOR for the 5-star Google review. Check this is the case.
        if path == "/":
            pytest.fail(
                f"{path} still uses yellow-XXX classes (should be alert-amber per design_guidelines.md). "
                f"Examples: {bad[:3]}"
            )


# ---------- Module: forbidden inline hex/linear-gradient on hero pages ----------

@pytest.mark.parametrize("path", HERO_GRADIENT_PAGES)
def test_no_forbidden_inline_hero_gradients(path):
    r = requests.get(f"{BASE_URL}{path}", timeout=25)
    html = r.text
    # forbidden: inline linear-gradient with hex literals
    # Allow linear-gradient used by svg/background-image in legitimate places like Sanity images.
    # but inline style on section/div with hex hero colors is forbidden.
    forbidden = re.findall(
        r'style="[^"]*linear-gradient\([^)]*#003153[^)]*\)', html, re.IGNORECASE
    )
    assert not forbidden, f"{path} has inline hex hero gradient: {forbidden[:2]}"


# ---------- Module: CTA labels present on critical pages ----------

CTA_CHECKS = [
    ("/financing", ["Pre-Qualify Now", "Get a Free Estimate"]),
    # Estimator hero CTA label — wizard uses "See My Range" / hero CTA may be "Get Your Range" etc.
    ("/replacement-estimator", ["Range"]),
    ("/services/system-replacement", ["Request My Free Estimate"]),
    ("/repair-or-replace", ["Get a Free Written Estimate"]),
    ("/contact", ["Send Message"]),
]

@pytest.mark.parametrize("path,labels", CTA_CHECKS)
def test_cta_labels_present(path, labels):
    r = requests.get(f"{BASE_URL}{path}", timeout=25)
    assert r.status_code == 200
    missing = [l for l in labels if l.lower() not in r.text.lower()]
    assert not missing, f"{path} missing CTA labels: {missing}"


# ---------- Module: Footer only uses 2 icon colors (red + blue) ----------

def test_footer_icon_colors_red_and_blue_only():
    r = requests.get(f"{BASE_URL}/", timeout=20)
    assert r.status_code == 200
    html = r.text
    # Extract footer block only
    m = re.search(r"<footer[^>]*>.*?</footer>", html, re.DOTALL | re.IGNORECASE)
    assert m, "No <footer> element found in homepage HTML"
    footer = m.group(0)
    # Forbidden: yellow, green map pin on the footer icons. Allow subtle gray text.
    # Check the icon-holding wrappers specifically
    bad_green = re.findall(r"text-(?:lime|success-green|growth-green)-?\d*", footer)
    bad_yellow = re.findall(r"text-(?:yellow|amber|gold)-?\d+", footer)
    # The footer is allowed to have brand-color tokens but the refactor removed yellow/green icons.
    # Permit at most 0 yellow/green icon classes in the ICON wrappers.
    # We do a soft check here; flag suspicious usage only.
    if bad_yellow:
        pytest.fail(f"Footer contains yellow icon colors (should be removed): {bad_yellow[:3]}")
    # growth-green/success-green map pins were removed per refactor
    if any("success-green" in c or "growth-green" in c for c in bad_green):
        pytest.fail(f"Footer uses green for icons (should be blue-only): {bad_green[:3]}")


# ---------- Module: API endpoints still work (leads + estimator) ----------
# Note: /api/* routes on preview URL are rerouted to FastAPI per prior agent context.
# Next.js API routes are reachable at http://localhost:3000 from inside the container.

INTERNAL = "http://localhost:3000"

def test_api_leads_accepts_valid_submission():
    payload = {
        "firstName": "TEST_Brand",
        "lastName": "Refactor",
        "email": "test_brand_refactor@example.com",
        "phone": "972-555-0100",
        "problemDescription": "Brand refactor smoke test submission",
        "source": "test",
    }
    try:
        r = requests.post(f"{INTERNAL}/api/leads", json=payload, timeout=20)
    except Exception as e:
        pytest.skip(f"Cannot reach internal Next.js at {INTERNAL}: {e}")
    assert r.status_code in (200, 201), f"POST /api/leads => {r.status_code}: {r.text[:200]}"
    data = r.json()
    assert data.get("success") is True or "lead" in str(data).lower() or "id" in data


def test_api_estimator_calculate():
    payload = {
        "sqft": "1500_2500",
        "systemType": "matched",
        "stage": "standard",
        "seer": "mid",
        "ducts": "newer_fine",
    }
    try:
        r = requests.post(f"{INTERNAL}/api/estimator/calculate", json=payload, timeout=20)
    except Exception as e:
        pytest.skip(f"Cannot reach internal Next.js at {INTERNAL}: {e}")
    assert r.status_code == 200, f"POST /api/estimator/calculate => {r.status_code}: {r.text[:200]}"
    data = r.json()
    # Should return a range (low/high) or similar
    assert any(k in data for k in ["low", "high", "min", "max", "range", "estimate", "priceRange", "rangeLow", "rangeHigh"]), (
        f"estimator/calculate response lacks range fields: {list(data.keys())}"
    )


def test_api_estimator_calculate_rejects_invalid():
    payload = {"sqft": "bad_value", "systemType": "matched", "stage": "standard", "seer": "mid", "ducts": "newer_fine"}
    try:
        r = requests.post(f"{INTERNAL}/api/estimator/calculate", json=payload, timeout=20)
    except Exception as e:
        pytest.skip(f"Cannot reach internal Next.js at {INTERNAL}: {e}")
    assert r.status_code == 400, f"expected 400 for invalid sqft, got {r.status_code}"
