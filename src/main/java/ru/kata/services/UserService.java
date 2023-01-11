package ru.kata.services;

import ru.kata.dto.UserDto;
import ru.kata.entities.User;

import java.util.List;

public interface UserService {
    User addUser(User user);

    List<User> showAllUsers();

    User getUser(Long id);

    User editUser(Long id, UserDto user);

    void removeUser(Long id);

    User findByEmail(String name);
}
