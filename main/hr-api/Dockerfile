FROM mongo:latest AS development

RUN mkdir /security

# Generate secret key
RUN openssl rand -base64 768 > /security/secret.key

# Set permission for secret key
RUN chmod 400 /security/secret.key
RUN chown 999:999 /security/secret.key

# Copy replica setup script
ADD ./mongo/replica.sh /security

# Set permission for replica script
RUN chmod 755 /security/replica.sh
RUN chown 999:999 /security/replica.sh

CMD ["--replSet", "nexlehr", "--auth", "--keyFile", "/security/secret.key", "--bind_ip_all"]