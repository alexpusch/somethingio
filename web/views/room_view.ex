defmodule Somethingio.RoomView do
  use Somethingio.Web, :view

  def render("room.json", %{json_model: json_model}) do
    %{id: json_model.id,
      name: json_model.name}
  end
end
