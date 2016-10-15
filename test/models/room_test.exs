defmodule Somethingio.RoomTest do
  use Somethingio.ModelCase

  alias Somethingio.Room

  @valid_attrs %{name: "some content", players_count: 0}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Room.changeset(%Room{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Room.changeset(%Room{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "add_to_room increases rooms players_count by 1" do
    changeset = Room.changeset %Room{}, @valid_attrs
    room = Repo.insert! changeset
    Room.add_to_room(room)

    actual_room = Repo.get_by Room, Map.take(@valid_attrs, ["name"])
    assert actual_room.players_count == 1
  end
end
