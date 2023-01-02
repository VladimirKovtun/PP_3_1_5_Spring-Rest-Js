package ru.kata;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import ru.kata.entities.Role;
import ru.kata.entities.User;
import ru.kata.repositories.RoleRepository;
import ru.kata.services.UserService;

import java.util.Arrays;
import java.util.Set;

@SpringBootApplication
public class Pp315RestJsApplication {

    public static void main(String[] args) {
        SpringApplication.run(Pp315RestJsApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunnerBean(UserService userService, RoleRepository roleRepositories) {


        return (args) -> {
            Role roleUser = new Role("ROLE_USER");
            Role roleAdmin = new Role("ROLE_ADMIN");
            roleRepositories.save(roleAdmin);
            roleRepositories.save(roleUser);
            Arrays.asList(new User("admin", "admin", "2222", 39, "admin@mail.ru", Set.of(roleAdmin, roleUser)),
                            new User("user", "user", "1111", 31, "user@mail.ru", Set.of(roleUser)))
                    .forEach(userService::addUser);
        };
    }
}
