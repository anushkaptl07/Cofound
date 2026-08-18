package com.cofoundhub.repository;

import com.cofoundhub.entity.ConnectionRequest;
import com.cofoundhub.entity.ConnectionRequest.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    List<ConnectionRequest> findBySenderIdAndStatus(Long senderId, ConnectionStatus status);

    List<ConnectionRequest> findByReceiverIdAndStatus(Long receiverId, ConnectionStatus status);

    @Query("""
           SELECT c FROM ConnectionRequest c
           WHERE (c.sender.id = :userId OR c.receiver.id = :userId)
           AND c.status = :status
           """)
    List<ConnectionRequest> findAllAcceptedForUser(@Param("userId") Long userId,
                                                    @Param("status") ConnectionStatus status);

    Optional<ConnectionRequest> findBySenderIdAndReceiverId(Long senderId, Long receiverId);
}
