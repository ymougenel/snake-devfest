FROM maven:3.9.11-eclipse-temurin-25-noble AS build

WORKDIR /usr/src/app

COPY pom.xml /usr/src/app

# Layer optimization: ensure that all of dependencies are installed locally
RUN mvn dependency:go-offline

COPY src /usr/src/app/src
RUN mvn clean package -DskipTests=true

FROM eclipse-temurin:25

WORKDIR /usr/app
# Configure timezone
RUN echo "Europe/Paris" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata

COPY --from=build /usr/src/app/target/*.jar /usr/app/app.jar

EXPOSE 8080
CMD ["java","-jar","-Dspring.profiles.active=dev","/usr/app/app.jar"]