-- name: CreateMail :one
INSERT INTO "email" (
        email,
        name,
        avatar,
        "accessToken"
    )
VALUES ($1, $2, $3, $4)
RETURNING *;