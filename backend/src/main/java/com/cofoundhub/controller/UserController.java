package com.cofoundhub.controller;

import com.cofoundhub.dto.UserDetailDto;
import com.cofoundhub.dto.UserProfileRequest;
import com.cofoundhub.dto.UserSummaryDto;
import com.cofoundhub.entity.User;
import com.cofoundhub.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Logged-in user's own profile (includes email)
    @GetMapping("/me")
    public UserDetailDto getMe(Authentication auth) {
        User user = userService.getByEmail(auth.getName());
        return new UserDetailDto(user);
    }

    @PutMapping("/me")
    public UserDetailDto updateMe(Authentication auth, @RequestBody UserProfileRequest request) {
        User updated = userService.updateProfile(auth.getName(), request);
        return new UserDetailDto(updated);
    }

    // Browse other founders — skill and/or roleLookingFor are optional query params
    @GetMapping
    public List<UserSummaryDto> browse(Authentication auth,
                                        @RequestParam(required = false) String skill,
                                        @RequestParam(required = false) String roleLookingFor) {
        User currentUser = userService.getByEmail(auth.getName());
        return userService.search(skill, roleLookingFor, currentUser.getId())
                .stream()
                .map(UserSummaryDto::new)
                .collect(Collectors.toList());
    }

    // Public summary view of a specific user (no email — that's revealed only after connection accepted)
    @GetMapping("/{id}")
    public UserSummaryDto getById(@PathVariable Long id) {
        return new UserSummaryDto(userService.getById(id));
    }
}
