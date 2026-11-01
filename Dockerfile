FROM python:3.12-slim AS build
RUN pip install --no-cache-dir uv==0.13.6
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --group dev --no-install-project
COPY . .
RUN uv run zdx generate --docs-dir . --manifest api_manifest.yaml --on-error warn \
    && uv run mkdocs build -f mkdocs.yml

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/site /usr/share/nginx/html
EXPOSE 80
