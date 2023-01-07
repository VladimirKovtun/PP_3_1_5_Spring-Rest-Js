package ru.kata.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseStatus;
import ru.kata.entities.User;
import ru.kata.repositories.RoleRepository;
import ru.kata.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepositories;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepositories, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepositories = roleRepositories;
        this.passwordEncoder = passwordEncoder;
    }


    @Transactional
    @Override
    public User addUser(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(Set.of(roleRepositories.getByName("ROLE_USER")));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return user;
    }

    @Override
    public List<User> showAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User with id : " + id + " not found"));
    }

    @Transactional
    @Override
    public User editUser(Long id, User user) {
        User byId = getUser(id);
        byId.toUser(user);
        byId.setPassword(passwordEncoder.encode(byId.getPassword()));
        userRepository.save(byId);
        return byId;
    }

    @Transactional
    @Override
    public void removeUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User with email : " + email + " not found"));
    }
}
