import sys
print("Python:", sys.version)
errors = []

try:
    import fastapi
    print("fastapi:", fastapi.__version__)
except ImportError as e:
    errors.append(f"MISSING: fastapi - {e}")

try:
    import uvicorn
    print("uvicorn:", uvicorn.__version__)
except ImportError as e:
    errors.append(f"MISSING: uvicorn - {e}")

try:
    import openai
    print("openai:", openai.__version__)
except ImportError as e:
    errors.append(f"MISSING: openai - {e}")

try:
    import firebase_admin
    print("firebase_admin: OK")
except ImportError as e:
    errors.append(f"MISSING: firebase_admin - {e}")

try:
    import multipart
    print("python-multipart: OK")
except ImportError as e:
    errors.append(f"MISSING: python-multipart - {e}")

try:
    from jose import jwt
    print("python-jose: OK")
except ImportError as e:
    errors.append(f"MISSING: python-jose - {e}")

try:
    from passlib.context import CryptContext
    print("passlib: OK")
except ImportError as e:
    errors.append(f"MISSING: passlib - {e}")

try:
    import dotenv
    print("python-dotenv: OK")
except ImportError as e:
    errors.append(f"MISSING: python-dotenv - {e}")

print()
if errors:
    print("=== MISSING PACKAGES ===")
    for e in errors:
        print(e)
else:
    print("ALL PACKAGES INSTALLED OK")
