defmodule Somethingio.Player do
  use Somethingio.Web, :model

  schema "players" do
    field :name, :string
    field :score, :integer

    belongs_to :room, Somethingio.Room
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :score, :room_id])
    |> validate_required([:name, :score])
  end

  def update_score(player_id, score) do
    IO.puts ">> updating score to #{score} for player #{player_id}"
    player = Somethingio.Repo.get!(Somethingio.Player, player_id)
    player = Ecto.Changeset.change player, score: score

    IO.inspect player
    Somethingio.Repo.update player
  end

  def get_players_of_room(room_id) do
    query = from p in Somethingio.Player,
          where: p.room_id == ^room_id,
          select: %{id: p.id, name: p.name, score: p.score}

    Somethingio.Repo.all query
  end
end
