#!/usr/bin/env python3
"""Comprueba que cada app del catálogo de la Tienda se pueda resolver hoy, para cada ABI.

Hace lo mismo que store/Resolver.kt: consulta la última versión y elige el archivo.
No baja ningún APK. Sale con error si alguna fuente no resuelve.

Uso: python3 scripts/store/check_catalog.py [--token "$(gh auth token)"]
"""
import json, pathlib, re, sys, urllib.parse, urllib.request

CATALOG = pathlib.Path(__file__).resolve().parents[2] / "app/src/main/assets/catalog.json"
ABIS = ["armeabi-v7a", "arm64-v8a"]
UA = "galfredev-os-catalog-check"


def get(url, token=None):
    headers = {"User-Agent": UA}
    if "api.github.com" in url:
        headers["Accept"] = "application/vnd.github+json"
        headers["X-GitHub-Api-Version"] = "2022-11-28"
        if token:
            headers["Authorization"] = f"Bearer {token}"
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def head(url):
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status


def version_key(v):
    return [int(x) for x in re.findall(r"\d+", v)]


def resolve(app, abi, token):
    s = app["source"]
    if s["type"] == "fixed":
        head(s["url"])
        return None, s["url"], None
    if s["type"] == "github":
        rel = json.loads(get(f"https://api.github.com/repos/{s['repo']}/releases/latest", token))
        version = re.sub(r"^[vV]", "", rel["tag_name"])
        pattern = s.get("assets", {}).get(abi) or s.get("asset")
        if pattern is None:
            return None
        regex = re.compile(pattern.replace("{version}", re.escape(version)))
        hits = [a for a in rel["assets"] if regex.search(a["name"])]
        if len(hits) != 1:
            raise RuntimeError(f"{len(hits)} archivos para {pattern}: {[a['name'] for a in rel['assets']][:8]}")
        return version, hits[0]["browser_download_url"], hits[0].get("digest")
    url = s.get("urls", {}).get(abi, s["url"])
    pattern = s.get("assets", {}).get(abi) or s.get("asset")
    if pattern is None:
        return None
    html = get(url)
    hits = {}
    for m in re.finditer(pattern, html):
        hits[m.group(1)] = m.group(0)
    if not hits:
        raise RuntimeError("sin coincidencias en el listado")
    version = max(hits, key=version_key)
    found = hits[version]
    full = found if s.get("absolute") else urllib.parse.urljoin(url, found)
    head(full)
    return version, full, None


def main():
    token = None
    if "--token" in sys.argv:
        token = sys.argv[sys.argv.index("--token") + 1]
    catalog = json.loads(CATALOG.read_text())
    categories = {c["id"] for c in catalog["categories"]}
    failed = 0
    for app in catalog["apps"]:
        assert app["category"] in categories, app["id"]
        for abi in ABIS:
            try:
                got = resolve(app, abi, token)
                if got is None:
                    print(f"  --   {app['id']:<14} {abi:<12} sin archivo para este ABI")
                    continue
                version, url, digest = got
                print(f"  ok   {app['id']:<14} {abi:<12} {version or '-':<12} {'sha256' if digest else '      '} {url.rsplit('/', 1)[-1]}")
            except Exception as e:  # noqa: BLE001 - se informa y sigue con el resto
                failed += 1
                print(f"  MAL  {app['id']:<14} {abi:<12} {e}")
    print(f"{len(catalog['apps'])} apps, {failed} fallas")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
