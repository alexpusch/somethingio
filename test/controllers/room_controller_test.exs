defmodule Somethingio.RoomControllerTest do
  use Somethingio.ConnCase

  alias Somethingio.Room

  test "creates a room if no rooms exists", %{conn: conn} do
    post conn, room_path(conn, :reserve)
    rooms = Repo.aggregate(Room, :count, :id)

    assert rooms == 1
  end

  test "returns the id and name of a vacant room", %{conn: conn} do
    post conn, room_path(conn, :reserve)
    conn = post conn, room_path(conn, :reserve)

    query = from r in Somethingio.Room,
      select: r,
      limit: 1

    room = Repo.one query

    assert json_response(conn, 200) == %{"id" => room.id,
      "name" => room.name}
  end

  test "increases the players_count of this room", %{conn: conn} do
    post conn, room_path(conn, :reserve)

    query = from r in Somethingio.Room,
      select: r,
      limit: 1

    room = Repo.one query
    assert room.players_count == 1

    post conn, room_path(conn, :reserve)

    room = Repo.one query
    assert room.players_count == 2
  end

  test "creates a new room if all existing rooms have more than 6 players", %{conn: conn} do
    Enum.map 0..6, fn(_n) ->
      post conn, room_path(conn, :reserve)
    end

    rooms = Repo.aggregate(Room, :count, :id)

    assert rooms == 2
  end
end
