defmodule Somethingio.Router do
  use Somethingio.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    # plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", Somethingio do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index

    scope "/rooms" do
      post "reserve", RoomController, :reserve
    end


    resources "/users", UserController
    resources "/json_model", JsonModelController
  end

  # Other scopes may use custom stacks.
  # scope "/api", Somethingio do
  #   pipe_through :api
  # end
end
