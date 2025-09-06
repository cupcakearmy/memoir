# Imgproxy with caching

A simple docker compose file that enables caching of the transformed [imgproxy](https://github.com/imgproxy/imgproxy) responses powered by nginx.

```yaml
version: '3.8'

volumes:
  cache:

services:
  img:
    image: darthsim/imgproxy
    environment:
      # Required for nginx
      IMGPROXY_BIND: 0.0.0.0:80

      # Security
      IMGPROXY_MAX_SRC_RESOLUTION: 100
      IMGPROXY_ALLOWED_SOURCES: https://images.unsplash.com/,https://images.pexels.com/

      # Transforms
      IMGPROXY_ENFORCE_WEBP: true
      IMGPROXY_ENFORCE_AVIF: true
      IMGPROXY_ONLY_PRESETS: true
      IMGPROXY_PRESETS: default=resizing_type:fit,250=size:250:250,500=size:500:500,1000=size:1000:1000,1500=size:1500:1500,2000=size:2000:2000

  proxy:
    image: nginx
    ports:
      - 80:80
    volumes:
      - ./proxy.conf:/etc/nginx/conf.d/default.conf:ro
      - cache:/tmp
```

```
# proxy.conf
# Set cache to 30 days, 1GB.
# Only use the uri as the cache key, as it's the only input for imageproxy.
proxy_cache_path /tmp levels=1:2 keys_zone=backcache:8m max_size=1g inactive=30d;
proxy_cache_key "$uri";
proxy_cache_valid 200 302 30d;

server
{
	listen 80;
	server_name _;

	location /
	{
		proxy_pass_request_headers off;
		proxy_set_header HOST $host;
		proxy_set_header Accept $http_accept;

		proxy_pass http://img;

		proxy_cache backcache;
	}
}
```
