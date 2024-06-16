// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

package db

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Emails struct {
	ID        uuid.UUID `json:"id"`
	Uid       uuid.UUID `json:"uid"`
	Date      time.Time `json:"date"`
	From      string    `json:"from"`
	Subject   string    `json:"subject"`
	Content   string    `json:"content"`
	Summary   string    `json:"summary"`
	Products  []string  `json:"products"`
	Priority  string    `json:"priority"`
	Mood      string    `json:"mood"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Users struct {
	Uid         uuid.UUID      `json:"uid"`
	Name        sql.NullString `json:"name"`
	Email       string         `json:"email"`
	Avatar      sql.NullString `json:"avatar"`
	AccessToken sql.NullString `json:"accessToken"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
}
