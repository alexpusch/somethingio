defmodule Somethingio.PageController do
  use Somethingio.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
