from __future__  import print_function
import os
import json
import websocket

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJib3QtM2E4ZThjYmUtMmFiMi00OTA4LWE4MWYtMGNhYzYyMmI1NTRhIiwiaWF0IjoxNTYxMjQ0NzMxLCJleHAiOjE1NjM4MzY3MzEsInN1YiI6IiJ9.LNoyMGy34JOJbVR57J8iwvs_BSMHGcCjBsqnGIW7xMA"
thingy = "serial"
ser = None

if thingy == "serial":
    ser = serial.Serial("/dev/ttyUSB0", 9600, timeout=1)

def on_message(ws, message):
    #print(message)
    try:
        messageData = json.loads(message)
    except:
        return

    try:
        if "e" not in messageData:
            return print("Malformed Message")
        event = messageData["e"]
        data = messageData["d"]

        print(event)
        if event == "BUTTON_COMMAND":
            print("Move: " + data["button"]["label"])
            if thingy != "serial":
                return

            direc = data["button"]["label"]
            if direc == "forward":
                command = "f"
                ser.write(command.lower().encode("utf8") + "\r\n")
            elif direc == "backward":
                command = "b"
                ser.write(command.lower().encode("utf8") + "\r\n")
            elif direc == "left":
                command = "l"
                ser.write(command.lower().encode("utf8") + "\r\n")
            elif direc == "right":
                command = "r"
                ser.write(command.lower().encode("utf8") + "\r\n")

        elif event == "MESSAGE_RECEIVED":
            print("Say: " + data["message"])

    except Exception as e:
        print(e)

def on_error(ws, error):
    print(error)

def on_close(ws):
    print("### websocket closed ###")

def on_open(ws):
    print("### websocket opened ###")
    ws.send(json.dumps({"e": "AUTHENTICATE_ROBOT", "d": {"token": token}}))
    ws.send(json.dumps({"e": "JOIN_CHANNEL", "d": "chan-02063c30-01b8-4d6c-9712-0fa646bcc942"}))
    ws.send(json.dumps({"e": "GET_CHAT", "d": "chat-5dddf758-d393-4ee8-8f66-d362987a2611"}))

if __name__ == "__main__":
    #websocket.enableTrace(True)
    ws = websocket.WebSocketApp("ws://127.0.0.1:3231/",
                              on_message = on_message,
                              on_error = on_error,
                              on_close = on_close)
    ws.on_open = on_open
    while True:
        try:
            ws.run_forever()
            time.sleep(1)
        except KeyboardInterrupt:
            exit()
        except:
            pass