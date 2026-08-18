package com.cofoundhub.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserProfileRequest {
    private String bio;
    private String roleHave;
    private String roleLookingFor;
    private String startupIdea;
    private List<String> skills; // plain skill names, e.g. ["React", "Spring Boot"]
}
