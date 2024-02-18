package main

import (
	"context"
	"fmt"
	"gcloudmaps/backend/handlers"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/idtoken"
)

func createClient(firestoreProject string, ctx context.Context) *firestore.Client {
	client, err := firestore.NewClient(ctx, firestoreProject)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}
	return client
}

func startsWithBearer(auth string) bool {
	return len(auth) > 7 && auth[:7] == "Bearer "
}

func authentication(c *gin.Context) {

	auth := c.GetHeader("Authorization")
	if auth == "" || !startsWithBearer(auth) {
		fmt.Println("Authoriation Header not set or invalid Bearer")
		c.Set("user", "public")
		return
	}

	tokenId := auth[7:] // Strip "Bearer " prefix

	oauthClientID := os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
	payload, err := idtoken.Validate(c, tokenId, oauthClientID)

	if err != nil {
		c.Set("user", "public")
		return
	}
	c.Set("user", payload.Claims["sub"])
	c.Next()
}

func main() {

	firestoreProject := os.Getenv("FIRESTORE_PROJECT")
	appAddressPort := os.Getenv("APP_ADDRESS_PORT")

	if firestoreProject == "" || appAddressPort == "" {
		log.Fatal("environment variables not set")
	}

	ctx := context.Background()
	client := createClient(firestoreProject, ctx)
	defer client.Close()
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	router.Use(cors.New(config))

	router.Use(authentication)
	router.GET("/health", handlers.HealthCheckHandler())
	router.GET("/list", handlers.GetMindmapList(client))
	router.GET("/mindmaps/:name", handlers.GetMindmap(client))
	//router.DELETE("/mindmaps/:name", handlers.DeleteMindmap(client))
	//router.POST("/mindmaps/:name", handlers.AddMindmap((client)))
	router.Run(appAddressPort)
}
