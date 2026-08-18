package com.cofoundhub.dto;

import com.cofoundhub.entity.User;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

// Public-facing view of a user — never includes the password hash
@Getter
public class UserSummaryDto {
    private final Long id;
    private final String name;
    private final String bio;
    private final String roleHave;
    private final String roleLookingFor;
    private final String startupIdea;
    private final List<String> skills;

    public UserSummaryDto(User u) {
        this.id = u.getId();
        this.name = u.getName();
        this.bio = u.getBio();
        this.roleHave = u.getRoleHave();
        this.roleLookingFor = u.getRoleLookingFor();
        this.startupIdea = u.getStartupIdea();
        this.skills = u.getSkills().stream().map(s -> s.getName()).collect(Collectors.toList());
    }
}
