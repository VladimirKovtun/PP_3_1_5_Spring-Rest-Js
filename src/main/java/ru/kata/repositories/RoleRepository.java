package ru.kata.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kata.entities.Role;


public interface RoleRepository extends JpaRepository<Role, Long> {

    Role getByName(String name);
}
