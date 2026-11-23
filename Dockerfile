FROM python:3.12-slim AS build
RUN pip install --no-cache-dir uv==0.13.6
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --group dev --no-install-project
COPY . .
RUN uv run zdx generate --docs-dir . --manifest api_manifest.yaml --on-error warn \
    && uv run mkdocs build -f mkdocs.yml

FROM nginx:1.30.7-alpine@sha256:caf4e1e032a20f9c3c5e28fc7f25ffd768ad8677b4975c54193075997b3a97e3
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/site /usr/share/nginx/html
EXPOSE 80
