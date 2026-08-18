package com.cofoundhub.dto;

import com.cofoundhub.entity.User;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

// Includes email — only shown once a connection is accepted, or to the owner
@Getter
public class UserDetailDto {
    private final Long id;
    private final String name;
    private final String email;
    private final String bio;
    private final String roleHave;
    private final String roleLookingFor;
    private final String startupIdea;
    private final List<String> skills;

    public UserDetailDto(User u) {
        this.id = u.getId();
        this.name = u.getName();
        this.email = u.getEmail();
        this.bio = u.getBio();
        this.roleHave = u.getRoleHave();
        this.roleLookingFor = u.getRoleLookingFor();
        this.startupIdea = u.getStartupIdea();
        this.skills = u.getSkills().stream().map(s -> s.getName()).collect(Collectors.toList());
    }
}
