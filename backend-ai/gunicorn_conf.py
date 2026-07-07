import multiprocessing
import os

# Calculation for number of workers (cores * 2 + 1)
cores = multiprocessing.cpu_count()
workers = int(os.environ.get("WEB_CONCURRENCY", cores * 2 + 1))
threads = int(os.environ.get("PYTHON_MAX_THREADS", 1))

# Port and Bind
port = os.environ.get("PORT", "8000")
bind = os.environ.get("BIND", f"0.0.0.0:{port}")

# Timeout and Keep-Alive
timeout = int(os.environ.get("TIMEOUT", "120"))
keepalive = int(os.environ.get("KEEP_ALIVE", "5"))

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Worker Class
worker_class = "uvicorn.workers.UvicornWorker"
