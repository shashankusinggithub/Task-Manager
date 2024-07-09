

import re


def convert_size_to_bytes(size_str):
    # Define conversion factors
    conversion_factors = {
        'KB': 1024,
        'КБ': 1024,
        'MB': 1024 * 1024,
        'МБ': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'ГБ': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024,
        'ТБ': 1024 * 1024 * 1024 * 1024,
        'B': 1,
        'Б': 1,
    }

    size_str = str(size_str).strip().upper()

    for unit in conversion_factors:
        if size_str.endswith(unit):
            numeric_value = float(size_str[:-len(unit)])
            return numeric_value * conversion_factors[unit]

    return float(size_str)


def domain_name(url):
    url = url.replace('http://', '').replace('https://', '')
    url = url.replace('www.', '').replace('.com', '')
    url = url.split(':')[0]
    url = url.split('?')[0]
    url = url.split('#')[0]
    url = url.rstrip('/')
    url = url.lstrip('/')
    return url.split('/')[0].replace(".", "")


def clean_string(string):
    cleaned_text = re.sub(r'[\n\t]+', '', string)
    cleaned_text = cleaned_text.strip().strip("'").strip('"')
    return cleaned_text


def onerror(*excs, default):
    def inner(func):
        def decorated(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except excs:
                return default
        return decorated
    return inner
