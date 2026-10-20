# Production-grade lightweight Nginx image
FROM nginx:alpine

# Metadata
LABEL maintainer="Juan Pablo Ortiz <juanpabloortizmoralez@gmail.com>"
LABEL description="Portafolio - Juan Pablo Ortiz (Technical Growth Marketing)"

# Remove default nginx static web assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy portfolio static assets into Nginx web root
COPY . /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Healthcheck to verify the web server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
