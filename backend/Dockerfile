# --- Stage 1: build the jar with Maven ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml first so Docker can cache the dependency download layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the rest of the source and build
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: slim runtime image, no Maven/JDK bloat ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/cofoundhub-backend-0.0.1-SNAPSHOT.jar app.jar

# Render sets PORT dynamically; Spring Boot reads it via server.port=${PORT:8080}
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
