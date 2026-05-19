import sys
import json
import urllib.request
import urllib.error

BASE = "http://localhost:8000"

def test(name, url, method="GET", data=None, files=None, content_type=None):
    print(f"\n{'='*50}")
    print(f"TEST: {name}")
    print(f"  {method} {url}")
    try:
        if data and content_type == "json":
            body = json.dumps(data).encode()
            req = urllib.request.Request(url, data=body, method=method,
                headers={"Content-Type": "application/json"})
        else:
            req = urllib.request.Request(url, method=method)
        
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode())
            print(f"  STATUS: {resp.status} OK")
            print(f"  RESPONSE: {json.dumps(result, indent=2)[:500]}")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  STATUS: {e.code} ERROR")
        print(f"  BODY: {body[:300]}")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

# --- Test 1: Health check ---
test("Health Check", f"{BASE}/")

# --- Test 2: Upload .ST file (multipart) ---
print(f"\n{'='*50}")
print("TEST: Upload ST file (multipart)")
import urllib.parse
import io

st_content = b"""VAR
    Pump_P101 : BOOL;
    Tank_Level : REAL;
    High_Level_Limit : REAL := 90.0;
    Low_Level_Limit : REAL := 20.0;
    Emergency_Stop : BOOL;
END_VAR

IF NOT Emergency_Stop AND Tank_Level < High_Level_Limit THEN
    Pump_P101 := TRUE;
END_IF;
IF Tank_Level >= High_Level_Limit OR Emergency_Stop THEN
    Pump_P101 := FALSE;
END_IF;
"""

boundary = b"----TestBoundary123"
body = (
    b"--" + boundary + b"\r\n"
    b'Content-Disposition: form-data; name="file"; filename="test_logic.st"\r\n'
    b"Content-Type: text/plain\r\n\r\n"
    + st_content +
    b"\r\n--" + boundary + b"--\r\n"
)

try:
    req = urllib.request.Request(
        f"{BASE}/api/upload-plc",
        data=body,
        method="POST",
        headers={"Content-Type": f"multipart/form-data; boundary={boundary.decode()}"}
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        result = json.loads(resp.read().decode())
        print(f"  STATUS: {resp.status} OK")
        print(f"  RESPONSE: {json.dumps(result, indent=2)[:800]}")
except urllib.error.HTTPError as e:
    print(f"  STATUS: {e.code} ERROR: {e.read().decode()[:300]}")
except Exception as e:
    print(f"  ERROR: {type(e).__name__}: {e}")

# --- Test 3: Sample logic shortcut ---
print(f"\n{'='*50}")
print("TEST: Sample logic via JSON payload")
try:
    data = json.dumps({"sample": True, "filename": "sample_logic.st"}).encode()
    req = urllib.request.Request(
        f"{BASE}/api/upload-plc",
        data=data, method="POST",
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        result = json.loads(resp.read().decode())
        print(f"  STATUS: {resp.status} OK")
        print(f"  RESPONSE: {json.dumps(result, indent=2)[:600]}")
except urllib.error.HTTPError as e:
    print(f"  STATUS: {e.code} ERROR: {e.read().decode()[:300]}")
except Exception as e:
    print(f"  ERROR: {type(e).__name__}: {e}")

print(f"\n{'='*50}")
print("ALL TESTS COMPLETE")
