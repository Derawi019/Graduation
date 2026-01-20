#!/usr/bin/env python3
"""
Generate a secure random secret key for Flask
"""
import secrets

if __name__ == '__main__':
    secret_key = secrets.token_hex(32)
    print("=" * 60)
    print("Generated SECRET_KEY:")
    print("=" * 60)
    print(secret_key)
    print("=" * 60)
    print("\nAdd this to your .env file:")
    print(f"SECRET_KEY={secret_key}")
    print("\nOr run:")
    print(f'export SECRET_KEY="{secret_key}"')
