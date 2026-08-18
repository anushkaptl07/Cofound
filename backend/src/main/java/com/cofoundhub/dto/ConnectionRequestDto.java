package com.cofoundhub.dto;

import com.cofoundhub.entity.ConnectionRequest;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ConnectionRequestDto {
    private final Long id;
    private final UserSummaryDto sender;
    private final UserSummaryDto receiver;
    private final String status;
    private final LocalDateTime createdAt;

    public ConnectionRequestDto(ConnectionRequest c) {
        this.id = c.getId();
        this.sender = new UserSummaryDto(c.getSender());
        this.receiver = new UserSummaryDto(c.getReceiver());
        this.status = c.getStatus().name();
        this.createdAt = c.getCreatedAt();
    }
}
