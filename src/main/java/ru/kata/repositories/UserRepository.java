package ru.kata.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.kata.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("from User u join fetch u.roles where u.email = :email")
    Optional<User> findByEmail(String email);

    @Query("from User u join fetch u.roles where u.id = :id")
    Optional<User> findById(Long id);
}
