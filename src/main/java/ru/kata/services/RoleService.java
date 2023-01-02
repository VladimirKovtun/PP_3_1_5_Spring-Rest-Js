package ru.kata.services;

import ru.kata.entities.Role;

import java.util.List;

public interface RoleService {
    List<Role> findAllRoles();
}
