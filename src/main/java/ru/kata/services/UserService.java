package ru.kata.services;

import ru.kata.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User addUser(User user);

    List<User> showAllUsers();

    User getUser(Long id);

    User editUser(Long id, User user);

    void removeUser(Long id);

    User findByEmail(String name);

}
