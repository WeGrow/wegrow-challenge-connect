Overview
--------

The goal of this program is to manage a set of bot connections for individual teams. Your program will be measured by its resiliency, clarity, and design.

There are two types of connections: Global and Team. The Global connection is used to manage team connections (`team.join`, `team.left`, `team.connect` are all sent over the global connection). Team connections are used for methods and events that are specific to an individual team. There's one websocket connection for the Global connection and one websocket connection for each Team connection.

To start, open a web socket connection to the Global API and keep team connections alive :) And don't forget, have fun.

Example Sequence
--------

Global Connection

* Open a websocket to `/global`.
* Receive a `hello` event on the global connection.
* Receive a `team.join` event on the global connection.
* Send a `team.connect` event for a new team.
* Receive a `team.connect` event with the websocket URL for the team.
* Receive a `goodbye` event on the global connection when the test is over.

Team Connection

* Open a websocket to the team using `ws_url` in `team.connect`.
* Receive a `hello` event on the team connection.
* Receive a `message` event on the team connection.
* Receive a `team.left` event on the team connection.
* Close the websocket connection.

Example Event
-------------
```{
	"type": "team.connect",
	"team_id": 1,
	"ws_url": "http://localhost:8080/connect/to/team"
}
```

Global RTM API
--------------------------------

NOTE: **Server Events** are sent to you. **Client Events** are sent by you.

**Server Events**

* `hello` sent when the global connection is opened.
* `goodbye` sent when the global connection is closed.
* `team.join` sent when a team joins. (use `team.connect` to connect to this team).
 	* `team_id`
* `team.left` sent when a team disconnects.
	* `team_id`
* `team.connect` sent when a team connection is ready to be made.
	* `ws_url` websocket url used to connect to the team.
	* `team_id`
* `error`
	* `message` details about the error.
	* `received_message` message sent by the client.
	* `team_id`

**Client Events**           

* `team.connect` send this to connect a team. When a team is ready, a `team.connect` event will be sent to you.
	* `team_id`


Team RTM API
--------------------------------

**Server Events**

* `hello` Sent when the team is connected.
* `pong` Sent when a `ping` event is received.
	* `unique_id` ping id
* `message`
	* `text` body of the message.

**Client Events**

* `ping`
	* `unique_id` ping id.


BONUS
--------------------------------

To go above and beyond, handle the `healthcheck` event. This event is sent over the Global connection. When you receive it, send back a `healthcheck` event with the state of your teams.

Here's an example `healthcheck` event sent by your client:


```{
	type: "healthcheck",
	stats: [
		{
			id: 1,              // team id
			connected: true,    // true if the websocket is connected.
			message_count: 100, // total # of messages received by the team.
			props_count: 10     // total # of messages received by the team w/ "props" in the text.
		},
		{
			id: 2,
			connected: false,
			message_count: 99,
			props_count: 9
		}		
	]
}
```