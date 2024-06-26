package api

import (
	"encoding/base64"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"google.golang.org/api/gmail/v1"
)

const (
	PriorityHigh   = "high"
	PriorityMedium = "medium"
	PriorityLow    = "low"
	PriorityNone   = "none"

	MoodSad     = "sad"
	MoodNeutral = "neutral"
	MoodAngry   = "angry"
	MoodHappy   = "happy"
)

var mockConversationData = []conversationData{
	{
		ID:      "1",
		Subject: "Masalah Pengiriman",
		From:    "customer@example.com",
		Date:    "2024-06-10",
		Content: "Halo, paket saya belum sampai padahal sudah melewati estimasi waktu pengiriman. Mohon bantuannya.",
		Summary: "Customer mengalami masalah dengan keterlambatan pengiriman.",
		Products: []string{
			"Delivery",
		},
		Priority: PriorityHigh,
		Mood:     MoodSad,
	},
	{
		ID:      "2",
		Subject: "Pertanyaan tentang Garansi",
		From:    "customer@example.com",
		Date:    "2024-06-11",
		Content: "Apakah produk yang saya beli di Tokopedia memiliki garansi? Jika iya, berapa lama garansi tersebut berlaku?",
		Summary: "Customer menanyakan tentang garansi produk di Tokopedia.",
		Products: []string{
			"Warranty",
		},
		Priority: PriorityMedium,
		Mood:     MoodNeutral,
	},
	{
		ID:      "3",
		Subject: "Permintaan Refund",
		From:    "customer@example.com",
		Date:    "2024-06-12",
		Content: "Saya ingin meminta refund untuk produk yang saya beli karena tidak sesuai dengan deskripsi. Apa prosedurnya?",
		Summary: "Customer ingin meminta refund untuk produk yang tidak sesuai dengan deskripsi.",
		Products: []string{
			"Refund",
		},
		Priority: PriorityHigh,
		Mood:     MoodAngry,
	},
	{
		ID:      "4",
		Subject: "Pengiriman Terlambat",
		From:    "customer@example.com",
		Date:    "2024-06-13",
		Content: "Produk yang saya pesan belum sampai hingga sekarang. Padahal sudah lewat dari estimasi waktu pengiriman.",
		Summary: "Customer mengeluh tentang keterlambatan pengiriman produk.",
		Products: []string{
			"Delivery",
		},
		Priority: PriorityMedium,
		Mood:     MoodSad,
	},
	{
		ID:      "5",
		Subject: "Komplain Kualitas Produk",
		From:    "customer@example.com",
		Date:    "2024-06-14",
		Content: "Kualitas produk yang saya terima sangat buruk. Bagaimana cara saya mendapatkan penggantian?",
		Summary: "Customer komplain tentang kualitas produk yang buruk.",
		Products: []string{
			"Product Quality",
		},
		Priority: PriorityHigh,
		Mood:     MoodAngry,
	},
	{
		ID:      "6",
		Subject: "Pertanyaan tentang Fitur",
		From:    "customer@example.com",
		Date:    "2024-06-15",
		Content: "Saya ingin tahu lebih lanjut tentang fitur yang ada pada produk ini. Bisakah Anda menjelaskan lebih detail?",
		Summary: "Customer ingin tahu lebih lanjut tentang fitur produk.",
		Products: []string{
			"Product Features",
		},
		Priority: PriorityLow,
		Mood:     MoodNeutral,
	},
	{
		ID:      "7",
		Subject: "Diskon dan Promosi",
		From:    "customer@example.com",
		Date:    "2024-06-16",
		Content: "Apakah saat ini ada diskon atau promosi untuk produk ini? Saya tertarik untuk membeli lebih banyak jika ada.",
		Summary: "Customer menanyakan tentang diskon dan promosi.",
		Products: []string{
			"Discounts and Promotions",
		},
		Priority: PriorityLow,
		Mood:     MoodHappy,
	},
	{
		ID:      "8",
		Subject: "Kesulitan dalam Pemesanan",
		From:    "customer@example.com",
		Date:    "2024-06-17",
		Content: "Saya mengalami kesulitan saat melakukan pemesanan di Tokopedia. Mohon bantuannya.",
		Summary: "Customer mengalami kesulitan saat melakukan pemesanan di Tokopedia.",
		Products: []string{
			"Ordering Issues",
		},
		Priority: PriorityMedium,
		Mood:     MoodSad,
	},
	{
		ID:      "9",
		Subject: "Request for Invoice",
		From:    "customer@example.com",
		Date:    "2024-06-18",
		Content: "Could you please send me the invoice for my recent purchase? I need it for my records.",
		Summary: "Customer meminta invoice untuk pembelian terbaru.",
		Products: []string{
			"Invoice",
		},
		Priority: PriorityLow,
		Mood:     MoodNeutral,
	},
	{
		ID:      "10",
		Subject: "Feedback on Customer Service",
		From:    "customer@example.com",
		Date:    "2024-06-19",
		Content: "I want to provide feedback on your customer service. The response time was excellent and the staff was very helpful.",
		Summary: "Customer memberikan feedback positif tentang layanan pelanggan.",
		Products: []string{
			"Customer Service",
		},
		Priority: PriorityNone,
		Mood:     MoodHappy,
	},
}

type emailRequest struct {
	MaxResults int64  `json:"maxResults" binding:"required"`
	PageToken  string `json:"pageToken"`
}

type conversationData struct {
	ID       string       `json:"id"`
	Subject  string       `json:"subject"`
	From     string       `json:"from"`
	Date     string       `json:"date"`
	ThreadID string       `json:"threadId"`
	Content  string       `json:"content"`
	Thread   threadDetail `json:"thread"`
	Summary  string       `json:"summary"`
	Products []string     `json:"products"`
	Priority string       `json:"priority"`
	Mood     string       `json:"mood"`
}

type threadDetail struct {
	ID       string      `json:"id"`
	Snippet  string      `json:"snippet"`
	Messages []emailData `json:"messages"`
}

type emailData struct {
	ID       string `json:"id"`
	Subject  string `json:"subject"`
	From     string `json:"from"`
	Date     string `json:"date"`
	ThreadID string `json:"threadId"`
	Content  string `json:"content"`
}

type emailReqML struct {
	Emails        []conversationData `json:"emails"`
	NextPageToken string             `json:"nextPageToken"`
}
type emailResponse struct {
	Emails        []conversationData `json:"emails"`
	NextPageToken string             `json:"nextPageToken"`
}

// @Summary Get Emails
// @Description Fetch emails using Gmail API with provided OAuth token
// @Tags emails
// @Accept json
// @Produce json
// @Param request body emailRequest true "OAuth token"
// @Success 200 {object} emailResponse "List of emails"
// @Security BearerAuth
// @Router /emails [post]
func (server *Server) getEmails(ctx *gin.Context) {
	isRecorded := make(map[string]bool)

	_, token, err := getUserPayload(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	var req emailRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	httpClient := oauth2.NewClient(ctx, tokenSource)
	gmailService, err := gmail.New(httpClient)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	user := "me"
	call := gmailService.Users.Messages.List(user)
	if req.MaxResults > 0 {
		call = call.MaxResults(req.MaxResults)
	} else {
		call = call.MaxResults(10)
	}
	if req.PageToken != "" {
		call = call.PageToken(req.PageToken)
	}

	r, err := call.Do()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var emails []conversationData
	for _, m := range r.Messages {
		msg, err := gmailService.Users.Messages.Get(user, m.Id).Do()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}

		var email conversationData
		email.ID = msg.Id

		if _, exists := isRecorded[email.ID]; exists {
			continue
		}
		isRecorded[email.ID] = true

		email.ThreadID = msg.ThreadId
		email.Content = getMessageContent(msg)

		// Extract headers
		for _, header := range msg.Payload.Headers {
			switch header.Name {
			case "Subject":
				email.Subject = header.Value
			case "From":
				email.From = header.Value
			case "Date":
				email.Date = header.Value
			}
		}

		// Fetch thread details
		thread, err := gmailService.Users.Threads.Get(user, msg.ThreadId).Do()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
		email.Thread = threadDetail{
			ID:      thread.Id,
			Snippet: thread.Snippet,
		}
		for _, threadMsg := range thread.Messages {
			var threadEmail emailData
			threadEmail.ID = threadMsg.Id

			threadEmail.ThreadID = threadMsg.ThreadId
			threadEmail.Content = getMessageContent(threadMsg)

			isRecorded[threadEmail.ID] = true

			for _, header := range threadMsg.Payload.Headers {
				switch header.Name {
				case "Subject":
					threadEmail.Subject = header.Value
				case "From":
					threadEmail.From = header.Value
				case "Date":
					threadEmail.Date = header.Value
				}
			}
			email.Thread.Messages = append(email.Thread.Messages, threadEmail)
		}

		emails = append(emails, email)
	}

	// send to ML
	response := emailReqML{
		Emails: emails,
	}

	// send to FE
	var res emailResponse
	for i, mail := range emails {
		res.Emails = append(res.Emails, conversationData{
			ID:       mail.ID,
			Subject:  mail.Subject,
			From:     mail.From,
			Date:     mail.Date,
			ThreadID: mail.ThreadID,
			Content:  mail.Content,
			Summary:  mockConversationData[i%len(mockConversationData)].Summary,
			Products: mockConversationData[i%len(mockConversationData)].Products,
			Priority: mockConversationData[i%len(mockConversationData)].Priority,
			Mood:     mockConversationData[i%len(mockConversationData)].Mood,
		})
	}

	if r.NextPageToken != "" {
		response.NextPageToken = r.NextPageToken
	}
	ctx.JSON(http.StatusOK, res)
}

func getMessageContent(msg *gmail.Message) string {
	var content string
	if msg.Payload.MimeType == "text/plain" {
		data, err := base64.URLEncoding.DecodeString(msg.Payload.Body.Data)
		if err == nil {
			content = string(data)
		}
	}
	for _, part := range msg.Payload.Parts {
		if part.MimeType == "text/plain" {
			data, err := base64.URLEncoding.DecodeString(part.Body.Data)
			if err == nil {
				content = string(data)
				break
			}
		}
	}
	return content
}

func (server *Server) isOnboarded(ctx *gin.Context) {
	_, token, err := getUserPayload(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	
}

type threadRequest struct {
	ThreadID string `json:"threadId" binding:"required"`
}

type threadResponse struct {
	Messages []emailData `json:"messages"`
}

// @Summary Get Messages by Thread ID
// @Description Fetch messages by thread ID using Gmail API with provided OAuth token
// @Tags emails
// @Accept json
// @Produce json
// @Param request body threadRequest true "Thread ID"
// @Success 200 {object} threadResponse "List of messages in the thread"
// @Security BearerAuth
// @Router /emails/thread [post]
func (server *Server) getMessagesByThreadID(ctx *gin.Context) {
	_, token, err := getUserPayload(ctx)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	var req threadRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: token})
	httpClient := oauth2.NewClient(ctx, tokenSource)
	gmailService, err := gmail.New(httpClient)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Fetch messages by thread ID
	thread, err := gmailService.Users.Threads.Get("me", req.ThreadID).Do()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var messages []emailData
	for _, msg := range thread.Messages {
		email := extractEmailData(msg)
		if email.ID != "" {
			messages = append(messages, email)
		}
	}

	response := threadResponse{
		Messages: messages,
	}
	ctx.JSON(http.StatusOK, response)
}

// Helper function to extract email data
func extractEmailData(msg *gmail.Message) emailData {
	var email emailData
	email.ID = msg.Id
	email.ThreadID = msg.ThreadId
	email.Content = getMessageContent(msg)

	// Extract headers
	for _, header := range msg.Payload.Headers {
		switch header.Name {
		case "Subject":
			email.Subject = header.Value
		case "From":
			email.From = header.Value
		case "Date":
			email.Date = header.Value
		}
	}
	return email
}
