module.exports = {
  apps: [
    {
      name: "accesco-worker",
      script: "worker.py",
      interpreter: ".venv/bin/python", // Use ".venv/Scripts/python.exe" for Windows dev
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "logs/worker-error.log",
      out_file: "logs/worker-out.log",
      time: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      name: "accesco-app",
      script: ".venv/bin/gunicorn",  // Production WSGI server (not Flask dev server)
      args: "-c deploy/gunicorn.conf.py run:application",
      interpreter: "none",  // gunicorn is the executable itself
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "logs/app-error.log",
      out_file: "logs/app-out.log",
      time: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    },
    {
      // TorchServe Audio Toxicity — Docker container management
      // Build first: docker build -t accesco-audio-toxicity ./inference_service
      // Uses a volume mount to keep the image lightweight
      name: "accesco-torchserve",
      script: "docker",
      args: "run --rm --name accesco-torchserve -p 8080:8080 -p 8081:8081 -p 8082:8082 -v ./inference_service/models:/home/model-server/models accesco-audio-toxicity:latest",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",
      error_file: "logs/torchserve-error.log",
      out_file: "logs/torchserve-out.log",
      time: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }
  ]
};
