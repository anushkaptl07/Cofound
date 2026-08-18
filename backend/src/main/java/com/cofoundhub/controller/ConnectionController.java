package com.cofoundhub.controller;

import com.cofoundhub.dto.ConnectionRequestDto;
import com.cofoundhub.entity.ConnectionRequest;
import com.cofoundhub.service.ConnectionService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping("/request/{receiverId}")
    public ConnectionRequestDto sendRequest(Authentication auth, @PathVariable Long receiverId) {
        ConnectionRequest request = connectionService.sendRequest(auth.getName(), receiverId);
        return new ConnectionRequestDto(request);
    }

    @PatchMapping("/{requestId}/respond")
    public ConnectionRequestDto respond(Authentication auth, @PathVariable Long requestId,
                                         @RequestBody Map<String, Boolean> body) {
        boolean accept = Boolean.TRUE.equals(body.get("accept"));
        ConnectionRequest request = connectionService.respondToRequest(auth.getName(), requestId, accept);
        return new ConnectionRequestDto(request);
    }

    @GetMapping("/sent")
    public List<ConnectionRequestDto> sent(Authentication auth) {
        return connectionService.getSentRequests(auth.getName())
                .stream().map(ConnectionRequestDto::new).collect(Collectors.toList());
    }

    @GetMapping("/received")
    public List<ConnectionRequestDto> received(Authentication auth) {
        return connectionService.getReceivedRequests(auth.getName())
                .stream().map(ConnectionRequestDto::new).collect(Collectors.toList());
    }

    @GetMapping("/accepted")
    public List<ConnectionRequestDto> accepted(Authentication auth) {
        return connectionService.getAcceptedConnections(auth.getName())
                .stream().map(ConnectionRequestDto::new).collect(Collectors.toList());
    }
}
