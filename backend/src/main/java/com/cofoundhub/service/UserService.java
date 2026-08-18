package com.cofoundhub.service;

import com.cofoundhub.dto.UserProfileRequest;
import com.cofoundhub.entity.Skill;
import com.cofoundhub.entity.User;
import com.cofoundhub.repository.SkillRepository;
import com.cofoundhub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public UserService(UserRepository userRepository, SkillRepository skillRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public User updateProfile(String email, UserProfileRequest request) {
        User user = getByEmail(email);

        user.setBio(request.getBio());
        user.setRoleHave(request.getRoleHave());
        user.setRoleLookingFor(request.getRoleLookingFor());
        user.setStartupIdea(request.getStartupIdea());

        if (request.getSkills() != null) {
            Set<Skill> skills = new HashSet<>();
            for (String name : request.getSkills()) {
                if (name == null || name.isBlank()) continue;
                String trimmed = name.trim();
                Skill skill = skillRepository.findByNameIgnoreCase(trimmed)
                        .orElseGet(() -> skillRepository.save(new Skill(null, trimmed)));
                skills.add(skill);
            }
            user.setSkills(skills);
        }

        return userRepository.save(user);
    }

    public List<User> search(String skill, String roleLookingFor, Long excludeUserId) {
        String skillParam = (skill == null || skill.isBlank()) ? null : skill.trim();
        String roleParam = (roleLookingFor == null || roleLookingFor.isBlank()) ? null : roleLookingFor.trim();
        return userRepository.searchUsers(skillParam, roleParam, excludeUserId);
    }
}
