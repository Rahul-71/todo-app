FROM openjdk:17-jdk-slim

VOLUME [ "/tmp" ]

EXPOSE 8080

# adding application's jar file
ARG JAR_FILE=target/todo-3.2.6.jar

# adding applicaion's jar to the container
ADD ${JAR_FILE} todo.jar

# execute the jar file from the container
ENTRYPOINT [ "java", "-jar", "/todo.jar"]