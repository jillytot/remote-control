package main

import (
	"log"
	"net/http"
	"sync"
	"time"

	websocket "github.com/gorilla/websocket"
)

const (
	writeWait = 10 * time.Second
	pongWait = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
	maxMessageSize = 512
)

type Client struct {
	stream *Stream

	closing bool

	conn *websocket.Conn

	send chan []byte
}

func (c *Client) close() {
	if c.closing != true {
		c.closing = true

		err := c.conn.Close()

		if err != nil {
			log.Print("Client Close Err: ", err)
		}

		close(c.send)
		c.stream.clientsMutex.Lock()
		defer c.stream.clientsMutex.Unlock()
		delete(c.stream.clients, c)
	}
}

type Stream struct {
	// Stream Name
	name string

	// Stream Closing Down
	closing bool

	// Registered clients.
	clients map[*Client]bool

	// Send Mutex
	sendMutex sync.RWMutex

	// Clients Mutex
	clientsMutex sync.Mutex
}

func (s *Stream) send(data []byte) {
	s.sendMutex.RLock()
	defer s.sendMutex.RUnlock()

	if s.closing != true {
		for client := range s.clients {
			if client.closing != true {
				if len(client.send) == cap(client.send) {
					log.Print("aaa")
				}
				select {
				case client.send <- data:
				default:
					client.close()
				}
			}
		}
	}
}

func (s *Stream) close() {
	if s.closing != true {
		s.closing = true

		for client := range s.clients {
			client.close()
		}

		streamsMutex.Lock()
		defer streamsMutex.Unlock()
		delete(streams, s.name)
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var streams = make(map[string]*Stream)
var streamsMutex = &sync.Mutex{}

func main() {
	http.HandleFunc("/receive", streamRecieve)
	http.HandleFunc("/transmit", steamTransmit)

	err := http.ListenAndServe(":1567", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func streamRecieve(w http.ResponseWriter, r *http.Request) {
	log.Print(streams)
	streamName := r.URL.Query().Get("name")

	stream, exists := streams[streamName]

	if exists != true {
		http.Error(w, "Stream Not Running", http.StatusForbidden)
		return
	}

	if stream.closing {
		http.Error(w, "Stream Closing", http.StatusForbidden)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{stream: stream, closing: false, conn: conn, send: make(chan []byte, 1024)}

	client.stream.clientsMutex.Lock()
	defer client.stream.clientsMutex.Unlock()
	client.stream.clients[client] = true

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}

func steamTransmit(w http.ResponseWriter, r *http.Request) {
	log.Print("Transmit Begin")
	streamName := r.URL.Query().Get("name")
	_, inUse := streams[streamName]

	if inUse {
		log.Print("In Use: ", streamName)
		http.Error(w, "Stream Already Active", http.StatusForbidden)
		return
	}

	log.Print("Starting Stream: ", streamName)

	newStream := &Stream{
		name:         streamName,
		closing:      false,
		clients:      make(map[*Client]bool),
		clientsMutex: sync.Mutex{},
		sendMutex:    sync.RWMutex{},
	}

	addStream(streamName, newStream)

	defer newStream.close()

	for {
		b := make([]byte, 1024)
		if n, err := r.Body.Read(b); err != nil {
			log.Print("Buffer Error: ", err)
			return
		} else {
			newStream.send(b[:n])
		}
	}
}

func addStream(streamName string, stream *Stream) {
	streamsMutex.Lock()
	defer streamsMutex.Unlock()
	streams[streamName] = stream
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.close()
	}()
	for {
		if c.closing != true {
			select {
			case message, ok := <-c.send:
				c.conn.SetWriteDeadline(time.Now().Add(writeWait))
				if !ok {
					c.close()
					return
				}

				w, err := c.conn.NextWriter(websocket.BinaryMessage)
				if err != nil {
					return
				}

				w.Write(message)
				/*
					n := len(c.send)
					log.Print(n)
					for i := 0; i < n; i++ {
						w.Write(<-c.send)
					}
				*/

				if err := w.Close(); err != nil {
					return
				}

			case <-ticker.C:
				c.conn.SetWriteDeadline(time.Now().Add(writeWait))
				if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
					return
				}
			}
		} else {
			return
		}
	}
}

func (c *Client) readPump() {
	defer func() {
		c.close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, _, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Print("ws error: ", err)
			}
			break
		}
	}
}