# TODO: We don't always want to pull the latest for stability
FROM mongo:latest

# Create image directory structure
RUN mkdir -p /data/db
COPY . /data
WORKDIR /data

# Copy mongo daemon initialization script to bin
COPY start_mongo.sh /usr/local/bin

# Initialize the mongo daemon
CMD ["start_mongo.sh"]