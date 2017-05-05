defmodule Somethingio.RoomChannel do
  use Phoenix.Channel
  alias Somethingio.Repo
  alias Somethingio.Player

  def join(room, message, socket) do
    room_id = Regex.named_captures(~r/room\:(?<room_id>\d*)/, room)["room_id"]
    player_changeset = Player.changeset %Player{}, %{name: socket.assigns.player_name, score: 0, room_id: room_id}

    case Repo.insert player_changeset do
      {:ok, player} ->
        socket = Phoenix.Socket.assign socket, :room_id, room_id
        socket = Phoenix.Socket.assign socket, :player_id, player.id

        current_players = Player.get_players_of_room(room_id)
        IO.puts "current_players"
        IO.inspect current_players

        send(self, {:after_join, player})
        {:ok, %{current_players: current_players}, socket}
      {:error, changeset} ->
        {:error, changeset}
    end
  end

  def handle_info({:after_join, player}, socket) do
    broadcast_from! socket, "new_player", %{body: [player.id, player.name, player.score]}
    {:noreply, socket}
  end

  def terminate(arg, socket) do
    IO.puts "terminate"
    IO.inspect socket
    # room_id = socket.assigns.room_id
    # Somethingio.Room.remove_from_room_by_id room_id
  end

  def handle_in("mouse_click", %{"score" => score}, socket) do
    player_id = socket.assigns.player_id

    case Player.update_score(socket.assigns.player_id, score) do
      {:ok, player} ->
        IO.puts ">>> click"
        broadcast_from! socket, "mouse_click", %{body: [player_id, score]}
        {:reply, {:ok, %{}}, socket}
      {:error, params} ->
        raise params
    end
  end

  def handle_in("mouse_move", %{"x" => x, "y" => y}, socket) do
    player_id = socket.assigns.player_id
    broadcast_from! socket, "mouse_move", %{body: [player_id, x, y]}
    {:noreply, socket}
  end

  # def handle_out("new_msg", payload, socket) do
  #   push socket, "new_msg", payload
  #   {:noreply, socket}
  # end
end
