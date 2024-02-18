package handlers

import (
	"fmt"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

func GetMindmapList(client *firestore.Client) func(c *gin.Context) {
	return func(c *gin.Context) {
		user, _ := c.Get("user")
		dsnap, err := client.Collection("users").Doc(user.(string)).Get(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, "")
			return
		}

		fieldValue, err := dsnap.DataAt("meta")

		c.JSON(http.StatusOK, fieldValue)

	}
}

func GetMindmap(client *firestore.Client) func(c *gin.Context) {
	return func(c *gin.Context) {
		name := c.Param("name")
		user, _ := c.Get("user")
		dsnap, err := client.Collection("users" + "/" + user.(string) + "/" + "mindmaps").Doc(name).Get(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err)
			fmt.Println(err)
			return
		}

		fieldValue := dsnap.Data()

		c.JSON(http.StatusOK, fieldValue)

	}
}

func AddMindmap(client *firestore.Client) func(c *gin.Context) {
	return func(c *gin.Context) {
		name := c.Param("name")
		user, _ := c.Get("user")
		dsnap, err := client.Collection("users" + "/" + user.(string) + "/" + "mindmaps").Doc(name).Get(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err)
			fmt.Println(err)
			return
		}

		fieldValue := dsnap.Data()

		c.JSON(http.StatusOK, fieldValue)

	}
}
