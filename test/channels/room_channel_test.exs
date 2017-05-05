defmodule Somethingio.RoomChannelTest do
  use Somethingio.ChannelCase
  use Phoenix.ConnTest

  alias Somethingio.RoomChannel
  alias Somethingio.Player

  import Somethingio.Router.Helpers

  @player_name "Player One"
  @valid_state %{x: 10, y: 20, score: 10}

  setup do
    conn =  build_conn()
    post conn, room_path(conn, :reserve)

    query = from r in Somethingio.Room,
      select: r,
      limit: 1

    room = Repo.one query

    {:ok, _, socket} =
      socket("user_id", %{player_name: @player_name})
      |> subscribe_and_join(RoomChannel, "room:#{room.id}")

    {:ok, socket: socket, room: room}
  end

  test "creates a new player after join", %{socket: socket, room: room} do
    player = get_player()

    assert player.name == @player_name
    assert player.room.id == room.id
  end

  test "replays with list of current users" , %{socket: socket, room: room} do
    {:ok, %{current_players: current_players}, socket2} =
      socket("user_id", %{player_name: "Player 2"})
      |> subscribe_and_join(RoomChannel, "room:#{room.id}")

    assert length(current_players) == 2
  end

  test "broadcasts mouse_move event to all clients", %{socket: socket, room: room} do
    player_id = get_player().id

    ref = push socket, "mouse_move", %{x: 10, y: 10}
    assert_broadcast ref, %{body: [player_id, x, y]}
  end

  # @tag :wip
  test "updates player score on mouse_click message", %{socket: socket, room: room} do
    player = get_player()

    ref = push socket, "mouse_click", %{score: 10}
    assert_reply ref, :ok

    player = get_player()
    assert player.score == 10
  end

  test "broadcasts mouse_click to all clients", %{socket: socket, room: room} do
    player = get_player()
    ref = push socket, "mouse_click", %{score: 10}
    assert_broadcast ref, %{body: [player_id, 10]}
  end

  defp get_player() do
    query = from p in Somethingio.Player,
      select: p,
      limit: 1,
      preload: :room

    Repo.one query
  end
end
