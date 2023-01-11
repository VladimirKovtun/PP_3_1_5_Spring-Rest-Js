package ru.kata.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import ru.kata.dto.UserDto;
import ru.kata.entities.Role;
import ru.kata.services.RoleService;
import ru.kata.services.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserRestController {
    private final RoleService roleService;
    private final UserService userService;

    @Autowired
    public UserRestController(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> showUser(@PathVariable("id") Long id) {
        return new ResponseEntity<>(UserDto.toDto(userService.getUser(id)), HttpStatus.OK);
    }
    @GetMapping("/user")
    public ResponseEntity<UserDto> currentUser(Principal principal) {
        return new ResponseEntity<>(UserDto.toDto(userService.findByEmail(principal.getName())), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<UserDto>> showAllUser() {
        return new ResponseEntity<>(userService.showAllUsers().stream().map(UserDto::toDto).toList(), HttpStatus.OK);
    }

    @GetMapping(value = "/roles")
    public ResponseEntity<List<Role>> showAllRoles() {
        return new ResponseEntity<>(roleService.findAllRoles(), HttpStatus.OK);
    }

    @PostMapping("/newUser")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userForReg) {
        return new ResponseEntity<>(UserDto.toDto(userService.addUser(UserDto.toUser(userForReg))), HttpStatus.OK);
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<UserDto> updateUser(@PathVariable("id") Long id, @RequestBody UserDto user) {
        return new ResponseEntity<>(UserDto.toDto(userService.editUser(id, user)), HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    @ResponseStatus(HttpStatus.OK)
    public void removeUser(@PathVariable("id") Long id) {
        userService.removeUser(id);
    }

    @ExceptionHandler
    private ResponseEntity<String> handleException(UsernameNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }
}