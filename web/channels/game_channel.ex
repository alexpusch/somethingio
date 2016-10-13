defmodule Somethingio.GameChannel do
  use Phoenix.Channel

  def join("game:public", _message, socket) do
    IO.puts ">>> join game:public"
    uuid = UUID.uuid4()
    {:ok, %{:id => uuid}, socket}
  end

  def handle_in("mousemove", %{"body" => body}, socket) do
    # IO.puts body
    broadcast_from! socket, "mousemove", %{body: body}
    {:noreply, socket}
  end

  def handle_out("new_msg", payload, socket) do
    push socket, "new_msg", payload
    {:noreply, socket}
  end
end
