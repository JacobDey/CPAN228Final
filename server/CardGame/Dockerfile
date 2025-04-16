# Use lightweight OpenJDK 17 base image
FROM eclipse-temurin:21-jdk-alpine

# Set working directory in container
WORKDIR /app

# Install Maven (needed for building the JAR)
RUN apk add --no-cache maven

# Copy the source code to the container
COPY pom.xml .
COPY src ./src

# Build the project
RUN mvn clean package -DskipTests

# Copy the built JAR to run
RUN cp target/*.jar app.jar

# Set the command to run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
