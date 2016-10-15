defmodule Somethingio.Room do
  use Somethingio.Web, :model

  schema "rooms" do
    field :players_count, :integer
    field :name, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:players_count, :name])
    |> validate_required([:players_count, :name])
  end

  def get_vacent_room() do
    import Ecto.Query, only: [from: 2]

    query = from r in Somethingio.Room,
          where: r.players_count < 6,
          select: r,
          limit: 1

    Somethingio.Repo.one query
  end

  def add_to_room(room) do
    c = room.players_count
    changeset = changeset(room, %{:players_count => c + 1})
    Somethingio.Repo.update changeset
  end

  def remove_from_room_by_id(room_id) do
    room = Somethingio.Repo.get_by Somethingio.Room, id: room_id
    players_count = room.players_count
    changeset = changeset(room, %{:players_count => players_count - 1})
    Somethingio.Repo.update changeset

  end
end
