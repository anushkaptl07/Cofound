package com.cofoundhub.service;

import com.cofoundhub.entity.ConnectionRequest;
import com.cofoundhub.entity.ConnectionRequest.ConnectionStatus;
import com.cofoundhub.entity.User;
import com.cofoundhub.repository.ConnectionRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConnectionService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final UserService userService;

    public ConnectionService(ConnectionRequestRepository connectionRequestRepository, UserService userService) {
        this.connectionRequestRepository = connectionRequestRepository;
        this.userService = userService;
    }

    public ConnectionRequest sendRequest(String senderEmail, Long receiverId) {
        User sender = userService.getByEmail(senderEmail);

        if (sender.getId().equals(receiverId)) {
            throw new IllegalArgumentException("You cannot send a connection request to yourself");
        }

        User receiver = userService.getById(receiverId);

        connectionRequestRepository.findBySenderIdAndReceiverId(sender.getId(), receiverId)
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("A request already exists between these users");
                });

        ConnectionRequest request = new ConnectionRequest();
        request.setSender(sender);
        request.setReceiver(receiver);
        request.setStatus(ConnectionStatus.PENDING);

        return connectionRequestRepository.save(request);
    }

    public ConnectionRequest respondToRequest(String currentUserEmail, Long requestId, boolean accept) {
        User currentUser = userService.getByEmail(currentUserEmail);

        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Connection request not found"));

        if (!request.getReceiver().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to respond to this request");
        }

        request.setStatus(accept ? ConnectionStatus.ACCEPTED : ConnectionStatus.REJECTED);
        return connectionRequestRepository.save(request);
    }

    public List<ConnectionRequest> getSentRequests(String email) {
        User user = userService.getByEmail(email);
        return connectionRequestRepository.findBySenderIdAndStatus(user.getId(), ConnectionStatus.PENDING);
    }

    public List<ConnectionRequest> getReceivedRequests(String email) {
        User user = userService.getByEmail(email);
        return connectionRequestRepository.findByReceiverIdAndStatus(user.getId(), ConnectionStatus.PENDING);
    }

    public List<ConnectionRequest> getAcceptedConnections(String email) {
        User user = userService.getByEmail(email);
        return connectionRequestRepository.findAllAcceptedForUser(user.getId(), ConnectionStatus.ACCEPTED);
    }
}
