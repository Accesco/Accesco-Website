import urllib.request
import zipfile
import os

url = 'https://github.com/sdukea/Video-Feed-Ranking-MVP/archive/refs/heads/main.zip'
zip_path = 'mvp.zip'

urllib.request.urlretrieve(url, zip_path)

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall('.temp_clone')

print("Downloaded and extracted")
