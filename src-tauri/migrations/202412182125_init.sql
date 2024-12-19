CREATE TABLE connection_configs
(
    name      TEXT           NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at DATETIME,
    host      TEXT           NOT NULL,
    port      INTEGER        NOT NULL,
    username  TEXT           NOT NULL,
    password  TEXT           NOT NULL,
    PRIMARY KEY (name)
);
