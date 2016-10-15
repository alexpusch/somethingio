defmodule Somethingio.RoomController do
  use Somethingio.Web, :controller

  alias Somethingio.Room

  def reserve(conn, _params) do
    room = Somethingio.Room.get_vacent_room()

    if room do
      if room.players_count < 6 do
        Room.add_to_room(room)

        conn
        |> put_status(:ok)
        |> render("room.json", json_model: room)
      else
        openNewRoom(conn)
      end
    else
      openNewRoom(conn)
    end
  end

  defp openNewRoom(conn) do
    room_name = Somethingio.RandomName.generate()
    room_params = %{:players_count => 1, :name => room_name}
    changeset = Somethingio.Room.changeset(%Somethingio.Room{}, room_params)

    case Somethingio.Repo.insert(changeset) do
      {:ok, json_model} ->
        conn
        |> put_status(:ok)
        |> render("room.json", json_model: json_model)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Somethingio.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
