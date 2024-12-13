FROM scratch as builder
COPY dist/ /extension/dist
COPY package.json /extension/
COPY images/ /extension/media
COPY LICENSE /extension/
COPY icon.png /extension/
COPY README.md /extension/

FROM scratch

LABEL org.opencontainers.image.title="Long task sample" \
        org.opencontainers.image.description="Long task sample" \
        org.opencontainers.image.vendor="Long task sample" \
        io.podman-desktop.api.version=">= 1.14.0"

COPY --from=builder /extension /extension
