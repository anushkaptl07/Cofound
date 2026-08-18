package com.cofoundhub.repository;

import com.cofoundhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Browse/search: filter by skill name and/or role-looking-for text (case-insensitive)
    @Query("""
           SELECT DISTINCT u FROM User u LEFT JOIN u.skills s
           WHERE (:skill IS NULL OR LOWER(s.name) = LOWER(:skill))
           AND (:roleLookingFor IS NULL OR LOWER(u.roleLookingFor) LIKE LOWER(CONCAT('%', :roleLookingFor, '%')))
           AND u.id <> :excludeUserId
           """)
    List<User> searchUsers(@Param("skill") String skill,
                            @Param("roleLookingFor") String roleLookingFor,
                            @Param("excludeUserId") Long excludeUserId);
}
